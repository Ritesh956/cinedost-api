import express from 'express';
import { 
  getUserProfile, 
  updateUserProfile, 
  addToWatchlist, 
  removeFromWatchlist,
  getWatchlist,
  rateMovie,
  getRatings 
} from '../controllers/userController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/profile', auth, getUserProfile);
router.put('/profile', auth, updateUserProfile);
router.get('/watchlist', auth, getWatchlist);
router.post('/watchlist', auth, addToWatchlist);
router.delete('/watchlist/:movieId', auth, removeFromWatchlist);
router.get('/ratings', auth, getRatings);
router.post('/rate', auth, rateMovie);

export default router;
