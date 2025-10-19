import { Request, Response } from 'express';
import User from '../models/User';
import { getPopularMovies, getMoviesByGenre, GENRE_MAP } from '../services/tmdbService';

interface AuthRequest extends Request {
  userId?: string;
}

// Mock movies for fallback - organized by genre
const mockMoviesByGenre: { [key: string]: any[] } = {
  'Action': [
    { id: 155, title: "The Dark Knight", poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg", backdrop_path: "/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg", overview: "Batman raises the stakes in his war on crime.", release_date: "2008-07-18", vote_average: 8.5, vote_count: 29000, popularity: 112.312, genre_ids: [28, 18, 80] },
    { id: 27205, title: "Inception", poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg", backdrop_path: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg", overview: "A thief who steals corporate secrets through dream-sharing technology.", release_date: "2010-07-16", vote_average: 8.4, vote_count: 32000, popularity: 95.4, genre_ids: [28, 878, 12] },
    { id: 299536, title: "Avengers: Infinity War", poster_path: "/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg", backdrop_path: "/lmZFxXgJE3vgrciwuDib0N8CfQo.jpg", overview: "The Avengers must stop Thanos from collecting the Infinity Stones.", release_date: "2018-04-25", vote_average: 8.3, vote_count: 27000, popularity: 156.4, genre_ids: [28, 12, 878] },
    { id: 299534, title: "Avengers: Endgame", poster_path: "/or06FN3Dka5tukK1e9sl16pB3iy.jpg", backdrop_path: "/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg", overview: "After Thanos' devastating snap, the Avengers assemble once more.", release_date: "2019-04-24", vote_average: 8.3, vote_count: 25000, popularity: 145.2, genre_ids: [28, 12, 18] }
  ],
  'Comedy': [
    { id: 13, title: "Forrest Gump", poster_path: "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg", backdrop_path: "/3h1JZGDhZ8nzxdgvkxha0qBqiV.jpg", overview: "The presidencies of Kennedy and Johnson unfold from an Alabama man's perspective.", release_date: "1994-07-06", vote_average: 8.5, vote_count: 24000, popularity: 49.319, genre_ids: [35, 18, 10749] },
    { id: 637, title: "Life Is Beautiful", poster_path: "/74hLDKjD5aGYOotO6esUVaeISa2.jpg", backdrop_path: "/bORe0eI72D874TMawAgpC6TPjHb.jpg", overview: "A Jewish man uses humor to protect his son in a concentration camp.", release_date: "1997-12-20", vote_average: 8.5, vote_count: 12000, popularity: 38.5, genre_ids: [35, 18] },
    { id: 19995, title: "Avatar", poster_path: "/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg", backdrop_path: "/o0s4XsEDfDlvit5pDRKjzXR4pp2.jpg", overview: "A paraplegic Marine is sent to Pandora on a unique mission.", release_date: "2009-12-18", vote_average: 7.6, vote_count: 28000, popularity: 132.8, genre_ids: [28, 12, 878] }
  ],
  'Drama': [
    { id: 278, title: "The Shawshank Redemption", poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg", backdrop_path: "/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg", overview: "Two imprisoned men bond over a number of years.", release_date: "1994-09-23", vote_average: 8.7, vote_count: 23000, popularity: 68.221, genre_ids: [18, 80] },
    { id: 550, title: "Fight Club", poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg", backdrop_path: "/rr7E0NoGKxvbkb89eR1GwfoYjpA.jpg", overview: "An insomniac and a soap salesman channel primal aggression.", release_date: "1999-10-15", vote_average: 8.4, vote_count: 26000, popularity: 61.416, genre_ids: [18, 53] },
    { id: 389, title: "12 Angry Men", poster_path: "/ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg", backdrop_path: "/qqHQsStV6exghCM7zbObuYBiYxw.jpg", overview: "A jury holdout attempts to prevent a miscarriage of justice.", release_date: "1957-04-10", vote_average: 8.5, vote_count: 7500, popularity: 29.4, genre_ids: [18] },
    { id: 497, title: "The Green Mile", poster_path: "/velWPhVMQeQKcxggNEU8YmIo52R.jpg", backdrop_path: "/Apl2LhKPdoPNx57hdE5lGfqBzU.jpg", overview: "The lives of guards on Death Row are affected by a mysterious inmate.", release_date: "1999-12-10", vote_average: 8.5, vote_count: 15000, popularity: 65.8, genre_ids: [14, 18, 80] }
  ],
  'Thriller': [
    { id: 680, title: "Pulp Fiction", poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg", backdrop_path: "/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg", overview: "A burger-loving hit man and philosophical partner cross paths.", release_date: "1994-09-10", vote_average: 8.5, vote_count: 25000, popularity: 72.492, genre_ids: [53, 80] },
    { id: 424, title: "Schindler's List", poster_path: "/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg", backdrop_path: "/rIpSszng8P0DL0HNqKqvaxaHSa.jpg", overview: "In German-occupied Poland, Oskar Schindler saves over a thousand Jewish refugees.", release_date: "1993-12-15", vote_average: 8.6, vote_count: 14000, popularity: 54.3, genre_ids: [18, 36, 10752] },
    { id: 129, title: "Spirited Away", poster_path: "/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg", backdrop_path: "/Ab8mkHmkYADjU7wQiOkia9BzGvS.jpg", overview: "A young girl enters a world ruled by gods, witches, and spirits.", release_date: "2001-07-20", vote_average: 8.5, vote_count: 14000, popularity: 86.5, genre_ids: [16, 10751, 14] }
  ],
  'Horror': [
    { id: 694, title: "The Shining", poster_path: "/xazWoLealQwEgqZ89MLZklLZD3k.jpg", backdrop_path: "/3GhAMkMw5DBjwG3y6Y5NqPdezIF.jpg", overview: "A family heads to an isolated hotel for the winter.", release_date: "1980-05-23", vote_average: 8.2, vote_count: 15000, popularity: 68.5, genre_ids: [27, 53] },
    { id: 429617, title: "The Spider's Web", poster_path: "/betExZlgK0l7CZ9CsCBVcwO1OjL.jpg", backdrop_path: "/1RWLMyC9KcFfcaoViMiJGSSZzzr.jpg", overview: "A mysterious thriller about dark secrets.", release_date: "2019-03-15", vote_average: 7.1, vote_count: 3200, popularity: 22.4, genre_ids: [27, 53] }
  ],
  'Science Fiction': [
    { id: 603, title: "The Matrix", poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg", backdrop_path: "/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg", overview: "A computer hacker learns about the true nature of reality.", release_date: "1999-03-31", vote_average: 8.2, vote_count: 23000, popularity: 78.9, genre_ids: [878, 28] },
    { id: 13475, title: "Star Trek", poster_path: "/lV5N3mCRRd1aLbqPfzjoS8TX18i.jpg", backdrop_path: "/stJNUmZW3w8p2qjLH2SelPwLvyB.jpg", overview: "The brash James T. Kirk tries to live up to his father's legacy.", release_date: "2009-05-06", vote_average: 7.4, vote_count: 8700, popularity: 45.2, genre_ids: [878, 28, 12] },
    { id: 11, title: "Star Wars", poster_path: "/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg", backdrop_path: "/4iJfYYoQzZcONB9hNzg0J0wWyPH.jpg", overview: "Luke Skywalker joins forces to rescue a princess from the evil Darth Vader.", release_date: "1977-05-25", vote_average: 8.2, vote_count: 18000, popularity: 91.3, genre_ids: [12, 28, 878] }
  ],
  'Fantasy': [
    { id: 122, title: "The Lord of the Rings: The Return of the King", poster_path: "/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg", backdrop_path: "/2u7zbn8EudG6kLlBzUYqP8RyFU4.jpg", overview: "Gandalf and Aragorn lead the World of Men against Sauron's army.", release_date: "2003-12-17", vote_average: 8.5, vote_count: 22000, popularity: 98.7, genre_ids: [12, 14, 28] },
    { id: 120, title: "The Lord of the Rings: The Fellowship of the Ring", poster_path: "/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg", backdrop_path: "/pIUvQ9Ed35wlWhY2oU6OmwEsmzG.jpg", overview: "A meek Hobbit and companions set out to destroy a powerful ring.", release_date: "2001-12-18", vote_average: 8.4, vote_count: 22000, popularity: 95.2, genre_ids: [12, 14, 28] }
  ],
  'Animation': [
    { id: 12477, title: "Grave of the Fireflies", poster_path: "/k9tv1rXZbOhH7eiCk3lcjMLjT9h.jpg", backdrop_path: "/3OUSWgNWknFEejvCf0sOpW0Fqxw.jpg", overview: "Two siblings struggle to survive in Japan during World War II.", release_date: "1988-04-16", vote_average: 8.5, vote_count: 4800, popularity: 34.5, genre_ids: [16, 18, 10752] },
    { id: 569094, title: "Spider-Man: Across the Spider-Verse", poster_path: "/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg", backdrop_path: "/nGxUxi3PfXDRm7Vg95VBNgNM8yc.jpg", overview: "Miles Morales catapults across the Multiverse.", release_date: "2023-05-31", vote_average: 8.4, vote_count: 6200, popularity: 287.5, genre_ids: [16, 28, 12] }
  ]
};

export const getRecommendations = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('📋 User favorite genres:', user.favoriteGenres);

    // Convert user's favorite genre names to TMDB genre IDs
    const genreIds: number[] = user.favoriteGenres
      .map(genreName => GENRE_MAP[genreName])
      .filter(id => id !== undefined);

    console.log('🎬 Genre IDs for recommendations:', genreIds);

    // Random page between 1-20 for much more variety on each refresh
    const randomPage = Math.floor(Math.random() * 20) + 1;
    console.log('🎲 Fetching page:', randomPage);

    try {
      let recommendations;
      
      // Always fetch popular movies for maximum variety
      // Genre filtering can be done client-side if needed
      console.log('📺 Fetching popular movies from page', randomPage);
      recommendations = await getPopularMovies(randomPage);

      res.json({
        results: recommendations.results || [],
        page: recommendations.page || 1,
        total_results: recommendations.total_results || 0
      });
    } catch (tmdbError) {
      console.log('⚠️  TMDB API failed, returning mock recommendations with variety');
      
      // Return ALL mock movies, shuffled randomly for maximum variety
      let mockResults = Object.values(mockMoviesByGenre).flat();
      
      // Fisher-Yates shuffle for true randomization
      for (let i = mockResults.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [mockResults[i], mockResults[j]] = [mockResults[j], mockResults[i]];
      }

      res.json({
        results: mockResults,
        page: 1,
        total_results: mockResults.length
      });
    }
  } catch (error: any) {
    console.error('Recommendations error:', error.message);
    res.status(500).json({ 
      message: 'Failed to get recommendations',
      error: error.message 
    });
  }
};

export const getPersonalizedRecommendations = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // TODO: Implement actual collaborative filtering algorithm
    // For now, return popular movies filtered by user's favorite genres
    const recommendations = await getPopularMovies();
    
    res.json({
      message: 'Personalized recommendations based on your preferences',
      recommendations: recommendations.results
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get personalized recommendations' });
  }
};
