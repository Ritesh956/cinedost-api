import { Request, Response } from 'express';
import { searchMovies, getMovieDetails, getPopularMovies } from '../services/tmdbService';

// Mock movies data for when TMDB API fails
const mockMovies = {
  results: [
    {
      id: 550,
      title: "Fight Club",
      poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
      backdrop_path: "/rr7E0NoGKxvbkb89eR1GwfoYjpA.jpg",
      overview: "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.",
      release_date: "1999-10-15",
      vote_average: 8.4,
      vote_count: 26000,
      popularity: 61.416,
      genre_ids: [18, 53]
    },
    {
      id: 13,
      title: "Forrest Gump",
      poster_path: "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
      backdrop_path: "/3h1JZGDhZ8nzxdgvkxha0qBqi V.jpg",
      overview: "The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man.",
      release_date: "1994-07-06",
      vote_average: 8.5,
      vote_count: 24000,
      popularity: 49.319,
      genre_ids: [35, 18, 10749]
    },
    {
      id: 278,
      title: "The Shawshank Redemption",
      poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
      backdrop_path: "/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg",
      overview: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
      release_date: "1994-09-23",
      vote_average: 8.7,
      vote_count: 23000,
      popularity: 68.221,
      genre_ids: [18, 80]
    },
    {
      id: 680,
      title: "Pulp Fiction",
      poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
      backdrop_path: "/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
      overview: "A burger-loving hit man, his philosophical partner, and a drug-addled gangster's moll cross paths in this crime comedy.",
      release_date: "1994-09-10",
      vote_average: 8.5,
      vote_count: 25000,
      popularity: 72.492,
      genre_ids: [53, 80]
    },
    {
      id: 155,
      title: "The Dark Knight",
      poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      backdrop_path: "/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg",
      overview: "Batman raises the stakes in his war on crime with the help of Lt. Jim Gordon and District Attorney Harvey Dent.",
      release_date: "2008-07-18",
      vote_average: 8.5,
      vote_count: 29000,
      popularity: 112.312,
      genre_ids: [18, 28, 80, 53]
    },
    {
      id: 424,
      title: "Schindler's List",
      poster_path: "/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
      backdrop_path: "/loRmRzQXZeqG78TqZuyvSlEQfZb.jpg",
      overview: "In German-occupied Poland during World War II, industrialist Oskar Schindler becomes concerned for his Jewish workforce.",
      release_date: "1993-12-15",
      vote_average: 8.6,
      vote_count: 13000,
      popularity: 46.123,
      genre_ids: [18, 36, 10752]
    }
  ]
};

const mockMovieDetails = {
  id: 550,
  title: "Fight Club",
  original_title: "Fight Club",
  tagline: "Mischief. Mayhem. Soap.",
  poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
  backdrop_path: "/rr7E0NoGKxvbkb89eR1GwfoYjpA.jpg",
  overview: "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.",
  release_date: "1999-10-15",
  runtime: 139,
  vote_average: 8.4,
  vote_count: 26000,
  popularity: 61.416,
  budget: 63000000,
  revenue: 100853753,
  status: "Released",
  genres: [{ id: 18, name: "Drama" }, { id: 53, name: "Thriller" }],
  production_companies: [
    { id: 508, name: "Fox 2000 Pictures", logo_path: null },
    { id: 711, name: "Regency Enterprises", logo_path: null }
  ],
  spoken_languages: [{ english_name: "English", iso_639_1: "en" }],
  credits: {
    cast: [
      { id: 287, name: "Brad Pitt", character: "Tyler Durden", profile_path: "/kU3B75TyRiCgE270EyZnHjfivoq.jpg", order: 0 },
      { id: 819, name: "Edward Norton", character: "The Narrator", profile_path: "/5XBzD5WuTyVQZeS4VI25z2moMeY.jpg", order: 1 },
      { id: 1283, name: "Helena Bonham Carter", character: "Marla Singer", profile_path: "/rHZafjfHKDs8aTKfwgHQGnQa5Rf.jpg", order: 2 }
    ],
    crew: [
      { id: 7467, name: "David Fincher", job: "Director", department: "Directing", profile_path: null }
    ]
  },
  videos: {
    results: [
      { id: "5e382d1b4ca676001453826d", key: "SUXWAEX2jlg", name: "Fight Club - Trailer", site: "YouTube", type: "Trailer" }
    ]
  },
  keywords: {
    keywords: [
      { id: 825, name: "support group" },
      { id: 4565, name: "dual identity" },
      { id: 5565, name: "rage and hate" }
    ]
  },
  external_ids: {
    imdb_id: "tt0137523"
  }
};

export const searchMoviesController = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const results = await searchMovies(query as string);
    res.json(results);
  } catch (error: any) {
    console.error('Search movies error:', error.message);
    console.log('⚠️  Returning mock data due to TMDB API error');
    // Return mock data when TMDB fails
    res.json(mockMovies);
  }
};

export const getPopularMoviesController = async (req: Request, res: Response) => {
  try {
    const results = await getPopularMovies();
    res.json(results);
  } catch (error: any) {
    console.error('Get popular movies error:', error.message);
    console.log('⚠️  Returning mock data due to TMDB API error');
    // Return mock data when TMDB fails
    res.json(mockMovies);
  }
};

export const getMovieDetailsController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const movie = await getMovieDetails(id);
    res.json(movie);
  } catch (error: any) {
    console.error('Get movie details error:', error.message);
    console.log('⚠️  Returning mock movie details due to TMDB API error');
    // Return mock data when TMDB fails
    res.json({ ...mockMovieDetails, id: parseInt(req.params.id) });
  }
};
