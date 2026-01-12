import Bid from '../models/Bid.js';
import Gig from '../models/Gig.js';
import mongoose from 'mongoose';

export const placeBid = async (req, res) => {
    try {
        const { gigId, message, price } = req.body;

        // Check if gig exists and is open
        const gig = await Gig.findById(gigId);
        if (!gig) {
            return res.status(404).json({ message: 'Gig not found' });
        }
        if (gig.status !== 'open') {
            return res.status(400).json({ message: 'This gig is no longer open' });
        }

        // Prevent owner from bidding
        if (gig.ownerId.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'Owner cannot bid on their own gig' });
        }

        // Check for existing bid
        const existingBid = await Bid.findOne({ gigId, freelancerId: req.user._id });
        if (existingBid) {
            return res.status(400).json({ message: 'You have already placed a bid' });
        }

        const bid = await Bid.create({
            gigId,
            freelancerId: req.user._id,
            message,
            price,
        });

        res.status(201).json(bid);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getGigBids = async (req, res) => {
    try {
        const { gigId } = req.params;
        const gig = await Gig.findById(gigId);

        if (!gig) {
            return res.status(404).json({ message: 'Gig not found' });
        }

        // Only owner can view bids (per requirements)
        if (gig.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view bids' });
        }

        const bids = await Bid.find({ gigId })
            .populate('freelancerId', 'name email')
            .sort({ createdAt: -1 });

        res.json(bids);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserBids = async (req, res) => {
    try {
        const bids = await Bid.find({ freelancerId: req.user._id })
            .populate('gigId', 'title status ownerId')
            .sort({ createdAt: -1 });
        res.json(bids);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ATOMIC HIRING TRANSACTION WITH FALLBACK
export const hireFreelancer = async (req, res) => {
    let session = null;
    try {
        // Attempt to start a session for transaction
        session = await mongoose.startSession();
        session.startTransaction();
    } catch (err) {
        // If sessions/transactions are not supported (e.g., standalone Mongo), proceed without session
        console.log("Transactions not supported, falling back to standard logic.");
        session = null;
    }

    try {
        const { bidId } = req.params;

        // Use session if it exists, otherwise standard findById
        const bid = session
            ? await Bid.findById(bidId).session(session)
            : await Bid.findById(bidId);

        if (!bid) {
            if (session) { await session.abortTransaction(); session.endSession(); }
            return res.status(404).json({ message: 'Bid not found' });
        }

        const gig = session
            ? await Gig.findById(bid.gigId).session(session)
            : await Gig.findById(bid.gigId);

        // Authorization check
        if (gig.ownerId.toString() !== req.user._id.toString()) {
            if (session) { await session.abortTransaction(); session.endSession(); }
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (gig.status !== 'open') {
            if (session) { await session.abortTransaction(); session.endSession(); }
            return res.status(400).json({ message: 'Gig is already assigned' });
        }

        // 1. Update Gig status
        gig.status = 'assigned';
        if (session) {
            await gig.save({ session });
        } else {
            await gig.save();
        }

        // 2. Update Chosen Bid status
        bid.status = 'hired';
        if (session) {
            await bid.save({ session });
        } else {
            await bid.save();
        }

        // 3. Reject all other bids for this gig
        if (session) {
            await Bid.updateMany(
                { gigId: gig._id, _id: { $ne: bid._id } },
                { status: 'rejected' },
                { session }
            );
        } else {
            await Bid.updateMany(
                { gigId: gig._id, _id: { $ne: bid._id } },
                { status: 'rejected' }
            );
        }

        if (session) {
            await session.commitTransaction();
            session.endSession();
        }

        // 4. Real-time Notification (Bonus)
        const io = req.app.get('io');
        if (io) {
            io.to(bid.freelancerId.toString()).emit('notification', {
                message: `You have been hired for "${gig.title}"!`,
                gigId: gig._id,
            });
        }

        res.json({ message: 'Freelancer hired successfully', bid });
    } catch (error) {
        if (session) {
            await session.abortTransaction();
            session.endSession();
        }
        console.error("Hire Error:", error);
        res.status(500).json({ message: "Hiring failed. Ensure your database supports transactions or check logs." });
    }
};
