import express from 'express';
import { getRecommendations, getPersonalizedRecommendations } from '../controllers/recommendationController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/', auth, getRecommendations);
router.get('/personalized', auth, getPersonalizedRecommendations);

export default router;
