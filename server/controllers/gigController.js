import Gig from '../models/Gig.js';

export const createGig = async (req, res) => {
    try {
        const { title, description, budget } = req.body;

        // req.user is set by auth middleware (to be implemented)
        // For now assuming we extract it from request/token
        const gig = await Gig.create({
            title,
            description,
            budget,
            ownerId: req.user._id,
            status: 'open',
        });

        res.status(201).json(gig);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllGigs = async (req, res) => {
    try {
        const { search } = req.query;
        let query = { status: 'open' };

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        const gigs = await Gig.find(query)
            .populate('ownerId', 'name email')
            .sort({ createdAt: -1 });

        res.json(gigs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getGigById = async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id).populate('ownerId', 'name email');
        if (!gig) {
            return res.status(404).json({ message: 'Gig not found' });
        }
        res.json(gig);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserGigs = async (req, res) => {
    try {
        const gigs = await Gig.find({ ownerId: req.user._id }).sort({ createdAt: -1 });
        res.json(gigs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
