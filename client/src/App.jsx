import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PostGig from './pages/PostGig';
import MyGigs from './pages/MyGigs';
import MyBids from './pages/MyBids';
import GigDetails from './pages/GigDetails';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import NotificationListener from './components/NotificationListener';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-white font-sans">
        <Navbar />
        <NotificationListener />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Protected Routes placeholder */}
            {/* <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} /> */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/post-gig" element={<PrivateRoute><PostGig /></PrivateRoute>} />
            <Route path="/my-gigs" element={<PrivateRoute><MyGigs /></PrivateRoute>} />
            <Route path="/my-bids" element={<PrivateRoute><MyBids /></PrivateRoute>} />
            <Route path="/gigs/:id" element={<GigDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
