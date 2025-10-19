import mongoose, { Document, Schema } from 'mongoose';

export interface IRating extends Document {
  userId: string;
  movieId: string;
  rating: number;
  type: 'movie' | 'anime';
  createdAt: Date;
}

const RatingSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  movieId: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  type: { type: String, enum: ['movie', 'anime'], required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IRating>('Rating', RatingSchema);
