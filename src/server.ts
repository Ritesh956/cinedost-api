import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables first
dotenv.config({ path: path.join(__dirname, '../.env') });

import { connectDB } from './utils/database';
import { errorHandler } from './middleware/errorHandler';

// Routes
import authRoutes from './routes/auth';
import movieRoutes from './routes/movies';
import userRoutes from './routes/users';
import recommendationRoutes from './routes/recommendation';
// Ensure the recommendations route file exists at the specified path.
// If the file is named differently (e.g., recommendation.ts), update the import accordingly.

// import recommendationRoutes from './routes/recommendation'; // Uncomment if the file is named 'recommendation.ts'
/*
    Ensure that the recommendations route file exists at:
    ./src/routes/recommendations.ts

    If you get a "Cannot find module './routes/recommendations'" error,
    check that the file is named correctly and is in the correct folder.
    If your file is named 'recommendation.ts', use:
*/

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/users', userRoutes);
app.use('/api/recommendations', recommendationRoutes);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
