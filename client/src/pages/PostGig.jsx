import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';

const PostGig = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [budget, setBudget] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/gigs', {
                title,
                description,
                budget: Number(budget)
            });
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Post a New Gig</h1>

            <form onSubmit={submitHandler} className="space-y-6 bg-surface p-8 rounded-xl border border-gray-800">
                {error && <div className="p-3 bg-red-500/10 text-red-500 rounded">{error}</div>}

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Job Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 bg-background border border-gray-700 rounded-lg focus:outline-none focus:border-primary transition-colors"
                        placeholder="e.g. Build a React Website"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Budget ($)</label>
                    <input
                        type="number"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full p-3 bg-background border border-gray-700 rounded-lg focus:outline-none focus:border-primary transition-colors"
                        placeholder="500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-3 bg-background border border-gray-700 rounded-lg focus:outline-none focus:border-primary transition-colors h-40"
                        placeholder="Describe the project details..."
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-primary rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Posting...' : 'Post Job'}
                </button>
            </form>
        </div>
    );
};

export default PostGig;
