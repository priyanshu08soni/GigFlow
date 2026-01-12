import express from 'express';
import { placeBid, getGigBids, hireFreelancer, getUserBids } from '../controllers/bidController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, placeBid);
router.get('/my-bids', protect, getUserBids);
router.get('/:gigId', protect, getGigBids);
router.patch('/:bidId/hire', protect, hireFreelancer);

export default router;
