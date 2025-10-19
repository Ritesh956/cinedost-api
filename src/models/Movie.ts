import mongoose, { Document, Schema } from 'mongoose';

export interface IMovie extends Document {
  tmdbId: number;
  title: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  releaseDate: string;
  voteAverage: number;
  genreIds: number[];
  type: 'movie' | 'anime';
  imdbRating?: number;
  rottenTomatoesRating?: number;
  malRating?: number;
}

const MovieSchema: Schema = new Schema({
  tmdbId: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  overview: { type: String },
  posterPath: { type: String },
  backdropPath: { type: String },
  releaseDate: { type: String },
  voteAverage: { type: Number },
  genreIds: [{ type: Number }],
  type: { type: String, enum: ['movie', 'anime'], required: true },
  imdbRating: { type: Number },
  rottenTomatoesRating: { type: Number },
  malRating: { type: Number }
});

export default mongoose.model<IMovie>('Movie', MovieSchema);
