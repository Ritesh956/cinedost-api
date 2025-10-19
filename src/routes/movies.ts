import express from 'express';
import { searchMoviesController, getPopularMoviesController, getMovieDetailsController } from '../controllers/movieController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/search', auth, searchMoviesController);
router.get('/popular', auth, getPopularMoviesController);
router.get('/:id', auth, getMovieDetailsController);

export default router;
