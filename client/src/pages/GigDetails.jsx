import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../utils/axiosConfig';
import { DollarSign, User, Calendar, CheckCircle, XCircle } from 'lucide-react';

const GigDetails = () => {
    const { id } = useParams();
    const { userInfo } = useSelector((state) => state.auth);

    const [gig, setGig] = useState(null);
    const [bids, setBids] = useState([]);
    const [bidMessage, setBidMessage] = useState('');
    const [bidPrice, setBidPrice] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState('');

    const isOwner = userInfo && gig && userInfo._id === gig.ownerId._id;

    useEffect(() => {
        fetchGig();
    }, [id]);

    useEffect(() => {
        if (isOwner) {
            fetchBids();
        }
    }, [isOwner, gig]);

    const fetchGig = async () => {
        try {
            const { data } = await axios.get(`/gigs/${id}`);
            setGig(data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setLoading(false);
        }
    };

    const fetchBids = async () => {
        try {
            const { data } = await axios.get(`/bids/${id}`);
            setBids(data);
        } catch (err) {
            console.error(err);
        }
    };

    const submitBidHandler = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/bids', {
                gigId: id,
                message: bidMessage,
                price: Number(bidPrice),
            });
            setSuccessMsg('Bid submitted successfully!');
            setBidMessage('');
            setBidPrice('');
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    const hireHandler = async (bidId) => {
        if (!window.confirm('Are you sure you want to hire this freelancer?')) return;
        try {
            await axios.patch(`/bids/${bidId}/hire`);
            setSuccessMsg('Freelancer hired successfully!');
            // Refresh data
            fetchGig();
            fetchBids();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    if (loading) return <div className="text-center py-20">Loading details...</div>;
    if (!gig) return <div className="text-center py-20">Gig not found</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Gig Header */}
            <div className="bg-surface p-8 rounded-xl border border-gray-800">
                <div className="flex justify-between items-start mb-6">
                    <h1 className="text-3xl font-bold">{gig.title}</h1>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${gig.status === 'open' ? 'bg-primary/10 text-primary' : 'bg-green-500/10 text-green-500'
                        }`}>
                        {gig.status}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-gray-400">
                    <div className="flex items-center gap-2">
                        <User className="text-primary w-5 h-5" />
                        <span>Posted by {gig.ownerId.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <DollarSign className="text-green-500 w-5 h-5" />
                        <span>Budget: ${gig.budget}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="text-secondary w-5 h-5" />
                        <span>{new Date(gig.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="prose prose-invert max-w-none">
                    <h3 className="text-xl font-semibold mb-2 text-white">Description</h3>
                    <p className="whitespace-pre-wrap text-gray-300">{gig.description}</p>
                </div>
            </div>

            {/* Logic Split: Owner vs Freelancer */}
            {isOwner ? (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Received Bids ({bids.length})</h2>
                    {bids.length === 0 ? (
                        <p className="text-gray-500">No bids yet.</p>
                    ) : (
                        bids.map((bid) => (
                            <div key={bid._id} className="bg-surface p-6 rounded-xl border border-gray-800 flex justify-between items-center gap-4">
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-lg">{bid.freelancerId.name}</h4>
                                        <span className="text-green-400 font-bold">${bid.price}</span>
                                    </div>
                                    <p className="text-gray-400 text-sm mb-2">{bid.message}</p>
                                    <div className="text-xs text-gray-600">
                                        {new Date(bid.createdAt).toLocaleString()}
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    {bid.status === 'hired' ? (
                                        <span className="flex items-center gap-1 text-green-500 font-semibold bg-green-500/10 px-3 py-1 rounded-full">
                                            <CheckCircle className="w-4 h-4" /> Hired
                                        </span>
                                    ) : bid.status === 'rejected' ? (
                                        <span className="flex items-center gap-1 text-red-500 font-semibold bg-red-500/10 px-3 py-1 rounded-full">
                                            <XCircle className="w-4 h-4" /> Rejected
                                        </span>
                                    ) : gig.status === 'open' ? (
                                        <button
                                            onClick={() => hireHandler(bid._id)}
                                            className="px-4 py-2 bg-primary hover:bg-blue-600 rounded-lg text-sm font-semibold transition-colors"
                                        >
                                            Hire
                                        </button>
                                    ) : (
                                        <span className="text-gray-500 text-sm font-medium">Pending</span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                /* Freelancer View: Bid Form */
                <div>
                    <h2 className="text-2xl font-bold mb-6">Place Your Bid</h2>
                    {gig.status === 'open' ? (
                        <div className="bg-surface p-8 rounded-xl border border-gray-800">
                            {successMsg && <div className="p-3 mb-4 bg-green-500/10 text-green-500 rounded">{successMsg}</div>}
                            {error && <div className="p-3 mb-4 bg-red-500/10 text-red-500 rounded">{error}</div>}

                            <form onSubmit={submitBidHandler} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Your Price ($)</label>
                                    <input
                                        type="number"
                                        value={bidPrice}
                                        onChange={(e) => setBidPrice(e.target.value)}
                                        className="w-full p-3 bg-background border border-gray-700 rounded-lg focus:outline-none focus:border-primary transition-colors"
                                        placeholder="Enter your bid amount"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Cover Letter</label>
                                    <textarea
                                        value={bidMessage}
                                        onChange={(e) => setBidMessage(e.target.value)}
                                        className="w-full p-3 bg-background border border-gray-700 rounded-lg focus:outline-none focus:border-primary transition-colors h-32"
                                        placeholder="Why are you the best fit for this job?"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-3 px-4 bg-gradient-to-r from-primary to-secondary rounded-lg font-semibold hover:opacity-90 transition-opacity"
                                >
                                    Submit Proposal
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="bg-surface p-8 rounded-xl border border-gray-800 text-center">
                            <h3 className="text-xl font-semibold mb-2">This Gig is Closed</h3>
                            <p className="text-gray-500">The client has already hired someone for this project.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GigDetails;
