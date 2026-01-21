const axios = require('axios');

const getPosterUrl = async (movieTitle) => {
    try {
        const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
            params: {
                api_key: process.env.TMDB_API_KEY,
                query: movieTitle,
            },
        });

        if (response.data.results && response.data.results.length > 0) {
            const posterPath = response.data.results[0].poster_path;
            if (posterPath) {
                return `https://image.tmdb.org/t/p/w500${posterPath}`;
            }
        }

        // Fallback placeholder if no poster found
        return 'https://via.placeholder.com/500x750?text=No+Poster+Available';
    } catch (error) {
        console.error('TMDB API Error:', error.message);
        return 'https://via.placeholder.com/500x750?text=No+Poster+Available';
    }
};

module.exports = { getPosterUrl };
