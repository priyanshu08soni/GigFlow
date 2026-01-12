import { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import GigCard from '../components/GigCard';

const MyGigs = () => {
    const [gigs, setGigs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyGigs();
    }, []);

    const fetchMyGigs = async () => {
        try {
            const { data } = await axios.get('/gigs/my-gigs');
            setGigs(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">My Posted Gigs</h1>

            {loading ? (
                <div className="text-center py-20 text-gray-500">Loading your gigs...</div>
            ) : gigs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {gigs.map((gig) => (
                        <GigCard key={gig._id} gig={gig} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-surface rounded-xl border border-gray-800">
                    <h2 className="text-xl font-semibold mb-2">No Gigs Yet</h2>
                    <p className="text-gray-400">You haven't posted any gigs yet.</p>
                </div>
            )}
        </div>
    );
};

export default MyGigs;
