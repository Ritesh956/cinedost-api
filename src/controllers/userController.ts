import { Request, Response } from 'express';
import User from '../models/User';

interface AuthRequest extends Request {
  userId?: string;
}

export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { favoriteGenres, watchlist } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { favoriteGenres, watchlist },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const addToWatchlist = async (req: AuthRequest, res: Response) => {
  try {
    const { movieId } = req.body;
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.watchlist.includes(movieId)) {
      user.watchlist.push(movieId);
      await user.save();
    }

    res.json({ message: 'Added to watchlist' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getWatchlist = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.watchlist || []);
  } catch (error) {
    console.error('Get watchlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const removeFromWatchlist = async (req: AuthRequest, res: Response) => {
  try {
    const { movieId } = req.params;
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.watchlist = user.watchlist.filter(id => id !== movieId);
    await user.save();

    res.json({ message: 'Removed from watchlist', watchlist: user.watchlist });
  } catch (error) {
    console.error('Remove from watchlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getRatings = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.ratings || []);
  } catch (error) {
    console.error('Get ratings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const rateMovie = async (req: AuthRequest, res: Response) => {
  try {
    const { movieId, rating, type } = req.body;
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user already rated this movie
    const existingRatingIndex = user.ratings.findIndex(r => r.movieId === movieId);
    
    if (existingRatingIndex > -1) {
      // Update existing rating
      user.ratings[existingRatingIndex].rating = rating;
    } else {
      // Add new rating
      user.ratings.push({ movieId, rating, type, ratedAt: new Date() });
    }

    await user.save();
    res.json({ message: 'Rating saved', ratings: user.ratings });
  } catch (error) {
    console.error('Rate movie error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
