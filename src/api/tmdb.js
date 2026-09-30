import axios from 'axios';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
export const IMAGE_BASE_URL =
  process.env.REACT_APP_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';

const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: API_KEY,
  },
});

export function posterUrl(path, size = 'w500') {
  return path ? `${IMAGE_BASE_URL}/${size}${path}` : null;
}

export async function getTrendingMovies(page = 1) {
  const { data } = await tmdb.get('/trending/movie/week', { params: { page } });
  return data;
}

export async function searchMovies(query, page = 1) {
  const { data } = await tmdb.get('/search/movie', {
    params: { query, page, include_adult: false },
  });
  return data;
}

export async function getMovieDetails(id) {
  const { data } = await tmdb.get(`/movie/${id}`, {
    params: { append_to_response: 'credits,videos' },
  });
  return data;
}

export async function getGenres() {
  const { data } = await tmdb.get('/genre/movie/list');
  return data.genres;
}

export async function discoverMovies({ genreId, year, minRating, page = 1 } = {}) {
  const { data } = await tmdb.get('/discover/movie', {
    params: {
      page,
      with_genres: genreId || undefined,
      primary_release_year: year || undefined,
      'vote_average.gte': minRating || undefined,
      sort_by: 'popularity.desc',
    },
  });
  return data;
}

export default tmdb;
