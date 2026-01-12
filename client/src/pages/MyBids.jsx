import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const MyBids = () => {
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyBids();
    }, []);

    const fetchMyBids = async () => {
        try {
            const { data } = await axios.get('/bids/my-bids');
            setBids(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-20">Loading your bids...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">My Applications</h1>

            {bids.length > 0 ? (
                <div className="space-y-4">
                    {bids.map((bid) => (
                        <Link
                            to={`/gigs/${bid.gigId?._id}`}
                            key={bid._id}
                            className="block p-6 bg-surface border border-gray-800 rounded-xl hover:border-primary/50 transition-colors group"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors mb-2">
                                        {bid.gigId?.title || 'Unknown Gig'}
                                    </h3>
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-1">{bid.message}</p>
                                    <div className="text-sm text-gray-500">
                                        Bid Amount: <span className="text-white font-medium">${bid.price}</span>
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
                                    ) : (
                                        <span className="flex items-center gap-1 text-yellow-500 font-semibold bg-yellow-500/10 px-3 py-1 rounded-full">
                                            <Clock className="w-4 h-4" /> Pending
                                        </span>
                                    )}
                                    <span className="text-xs text-gray-600">
                                        {new Date(bid.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-surface rounded-xl border border-gray-800">
                    <h2 className="text-xl font-semibold mb-2">No Bids Yet</h2>
                    <p className="text-gray-400">You haven't applied to any gigs yet.</p>
                </div>
            )}
        </div>
    );
};

export default MyBids;
