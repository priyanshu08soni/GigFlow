import { Link } from 'react-router-dom';
import { DollarSign, User } from 'lucide-react';

const GigCard = ({ gig }) => {
    return (
        <Link
            to={`/gigs/${gig._id}`}
            className="block p-6 bg-surface border border-gray-800 rounded-xl hover:border-primary/50 transition-colors group"
        >
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">{gig.title}</h3>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {gig.status}
                </span>
            </div>

            <p className="text-gray-400 mb-6 line-clamp-2">{gig.description}</p>

            <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{gig.ownerId?.name || 'Unknown Client'}</span>
                </div>
                <div className="flex items-center gap-1 text-green-400 font-semibold">
                    <DollarSign className="w-4 h-4" />
                    <span>{gig.budget}</span>
                </div>
            </div>
        </Link>
    );
};

export default GigCard;
