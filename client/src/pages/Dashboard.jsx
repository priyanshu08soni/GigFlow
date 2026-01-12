import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import GigCard from '../components/GigCard';
import { Search, PlusCircle } from 'lucide-react';

const Dashboard = () => {
    const [gigs, setGigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchGigs();
    }, [search]);

    const fetchGigs = async () => {
        try {
            const { data } = await axios.get(`/gigs?search=${search}`);
            setGigs(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bold">Explore Gigs</h1>
                    <Link to="/post-gig" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-blue-600 transition-colors">
                        <PlusCircle className="w-4 h-4" />
                        <span>Post Gig</span>
                    </Link>
                </div>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search gigs..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-surface border border-gray-800 rounded-lg focus:outline-none focus:border-primary transition-colors"
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-500">Loading gigs...</div>
            ) : gigs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {gigs.map((gig) => (
                        <GigCard key={gig._id} gig={gig} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-surface rounded-xl border border-gray-800">
                    <h2 className="text-xl font-semibold mb-2">No Gigs Found</h2>
                    <p className="text-gray-400">Try adjusting your search query.</p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
