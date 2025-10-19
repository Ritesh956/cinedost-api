import axios from 'axios';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

if (!TMDB_API_KEY) {
  console.warn('⚠️  TMDB_API_KEY is not set in environment variables');
}

export const searchMovies = async (query: string) => {
  try {
    if (!query || query.trim() === '') {
      throw new Error('Search query cannot be empty');
    }
    
    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query: query.trim(),
        language: 'en-US'
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('TMDB search error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.status_message || 'Failed to search movies');
  }
};

export const getMovieDetails = async (movieId: string) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'en-US',
        append_to_response: 'credits,videos,keywords,release_dates,external_ids'
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('TMDB movie details error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.status_message || 'Failed to get movie details');
  }
};

export const getMovieCredits = async (movieId: string) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}/credits`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'en-US'
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('TMDB credits error:', error.response?.data || error.message);
    throw new Error('Failed to get movie credits');
  }
};

export const getMovieVideos = async (movieId: string) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}/videos`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'en-US'
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('TMDB videos error:', error.response?.data || error.message);
    throw new Error('Failed to get movie videos');
  }
};

export const getMovieKeywords = async (movieId: string) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}/keywords`, {
      params: {
        api_key: TMDB_API_KEY
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('TMDB keywords error:', error.response?.data || error.message);
    throw new Error('Failed to get movie keywords');
  }
};

export const getPopularMovies = async (page: number = 1) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'en-US',
        page: page
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('TMDB popular movies error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.status_message || 'Failed to get popular movies');
  }
};

export const getMovieExternalIds = async (movieId: string) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}/external_ids`, {
      params: {
        api_key: TMDB_API_KEY
      }
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to get external IDs');
  }
};

export const getMoviesByGenre = async (genreIds: number[], page: number = 1) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'en-US',
        sort_by: 'popularity.desc',
        include_adult: false,
        include_video: false,
        page: page,
        with_genres: genreIds.join(','),
        'vote_count.gte': 100 // Ensure movies have enough votes
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('TMDB genre movies error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.status_message || 'Failed to get movies by genre');
  }
};

// Genre name to ID mapping (TMDB genre IDs)
export const GENRE_MAP: { [key: string]: number } = {
  'Action': 28,
  'Adventure': 12,
  'Animation': 16,
  'Comedy': 35,
  'Crime': 80,
  'Documentary': 99,
  'Drama': 18,
  'Family': 10751,
  'Fantasy': 14,
  'History': 36,
  'Horror': 27,
  'Music': 10402,
  'Mystery': 9648,
  'Romance': 10749,
  'Science Fiction': 878,
  'Sci-Fi': 878,
  'TV Movie': 10770,
  'Thriller': 53,
  'War': 10752,
  'Western': 37
};
