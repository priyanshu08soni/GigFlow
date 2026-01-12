import express from 'express';
import { createGig, getAllGigs, getGigById, getUserGigs } from '../controllers/gigController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllGigs);
router.get('/my-gigs', protect, getUserGigs);
router.get('/:id', getGigById);
router.post('/', protect, createGig);

export default router;
