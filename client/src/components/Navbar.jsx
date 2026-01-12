import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { LogOut, PlusCircle, Briefcase } from 'lucide-react';

const Navbar = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <nav className="bg-surface border-b border-gray-800 sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Left: Logo */}
                <Link to="/" className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    <Briefcase className="text-primary w-6 h-6" />
                    GigFlow
                </Link>

                {/* Center: Navigation Links */}
                {userInfo && (
                    <div className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
                        <Link to="/" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Home</Link>
                        <Link to="/my-gigs" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">My Gigs</Link>
                        <Link to="/my-bids" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">My Bids</Link>
                    </div>
                )}

                {/* Right: User Info & Logout */}
                <div className="flex items-center gap-4">
                    {userInfo ? (
                        <>
                            <span className="text-gray-400 hidden lg:block">Welcome, {userInfo.name}</span>
                            <button
                                onClick={logoutHandler}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-gray-400 hover:text-white transition-colors">SignIn</Link>
                            <Link to="/register" className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-blue-600 transition-colors">
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
