import axios from 'axios';

const OMDB_API_KEY = process.env.OMDB_API_KEY;
const OMDB_BASE_URL = 'http://www.omdbapi.com/';

export const getMovieRatings = async (imdbId: string) => {
  try {
    const response = await axios.get(OMDB_BASE_URL, {
      params: {
        apikey: OMDB_API_KEY,
        i: imdbId
      }
    });
    
    const data = response.data;
    const ratings = {
      imdbRating: data.imdbRating !== 'N/A' ? parseFloat(data.imdbRating) : null,
      rottenTomatoesRating: null as number | null
    };

    // Extract Rotten Tomatoes rating
    if (data.Ratings) {
      const rtRating = data.Ratings.find((r: any) => r.Source === 'Rotten Tomatoes');
      if (rtRating) {
        ratings.rottenTomatoesRating = parseInt(rtRating.Value.replace('%', ''));
      }
    }

    return ratings;
  } catch (error) {
    throw new Error('Failed to get movie ratings');
  }
};

export const searchMovieByTitle = async (title: string, year?: string) => {
  try {
    const response = await axios.get(OMDB_BASE_URL, {
      params: {
        apikey: OMDB_API_KEY,
        t: title,
        y: year
      }
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to search movie by title');
  }
};
