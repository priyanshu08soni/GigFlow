# GigFlow - Freelance Marketplace

GigFlow is a full-stack MERN application connecting clients with freelancers. It features secure authentication, gig posting, bidding with real-time notifications, and atomic hiring transactions.

## Features

- **Authentication**: Secure JWT-based login/register with HttpOnly cookies.
- **Gig Management**: Post jobs, search/filter gigs by title.
- **Bidding System**: Freelancers can bid on open gigs.
- **Hiring Logic**: Clients can hire freelancers. This executes a MongoDB transaction to ensure data integrity (atomic updates).
- **Real-time Updates**: Socket.io integration for instant "Hired" notifications.
- **Premium UI**: Built with React, Tailwind CSS, and Lucide Icons.

## Tech Stack

- **Frontend**: Vite + React, Tailwind CSS, Redux Toolkit, Axios.
- **Backend**: Node.js, Express, MongoDB (Mongoose), Socket.io.
- **Database**: MongoDB (Requires Replica Set for Transactions - Atlas recommended or local replica setup).

## Prerequisites

- Node.js (v14+)
- MongoDB (Running locally or MongoDB Atlas URI)

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/gigflow.git
cd gigflow
```

### 2. Backend Setup
```bash
cd server
npm install
```
- Create a `.env` file in the `server` directory (copy from `.env.example` in root or create new):
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/gigflow
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```
> **Note**: For MongoDB Transactions to work locally, your local MongoDB must be running as a Replica Set. If not, use a MongoDB Atlas URI.

### 3. Frontend Setup
```bash
cd ../client
npm install
```

## Running the Application

You need to run both the backend and frontend terminals.

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage Guide

1. **Register**: Create two accounts (e.g., "Client User" and "Freelancer User").
2. **Post Gig**: Log in as Client, go to Dashboard -> "Post Gig".
3. **Bid**: Log in as Freelancer (incognito window), search for the gig, click it, and submit a bid.
4. **Hire**: Log in as Client, view the Gig Details, see the list of bids, and click "Hire".
   - The Freelancer will receive an instant alert notification.
   - The Gig will be marked as "Assigned".
   - Other bids will be "Rejected".

## License
MIT
