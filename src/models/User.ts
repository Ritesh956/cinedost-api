import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  favoriteGenres: string[];
  watchlist: string[];
  ratings: Array<{
    movieId: string;
    rating: number;
    type: 'movie' | 'anime';
    ratedAt?: Date;
  }>;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favoriteGenres: [{ type: String }],
  watchlist: [{ type: String }],
  ratings: [{
    movieId: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    type: { type: String, enum: ['movie', 'anime'], required: true },
    ratedAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', UserSchema);
