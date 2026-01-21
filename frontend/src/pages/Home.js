import React, { useEffect, useState } from 'react';
import API from '../services/api';
import MovieCard from '../components/MovieCard';
import './Home.css';

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [language, setLanguage] = useState('All Languages');

    const languages = ['All Languages', 'English', 'Tamil', 'Telugu', 'Hindi', 'Malayalam', 'Kannada'];

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            try {
                const { data } = await API.get(`/movies`, {
                    params: { language }
                });
                setMovies(data);
            } catch (error) {
                console.error('Error fetching movies:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMovies();
    }, [language]);

    return (
        <div className="home-page container">
            <header className="home-header fade-in">
                <h1 className="text-gradient">Recommended Movies</h1>
                <p>Explore the best of regional and global cinema</p>
            </header>

            {loading ? (
                <div className="loader">Searching for the best movies...</div>
            ) : (
                <div className="movies-grid">
                    {(movies || []).map((movie) => (
                        movie && <MovieCard key={movie._id} movie={movie} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
