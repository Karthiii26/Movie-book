import React from 'react';
import { Link } from 'react-router-dom';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
    if (!movie) return null;

    return (
        <Link to={`/movie/${movie._id}`} className="movie-card fade-in">
            <div className="card-poster">
                <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    loading="lazy"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/500x750?text=No+Poster+Available';
                    }}
                />
                <div className="card-overlay">
                    {movie.genre && movie.genre[0] && <span className="genre-tag">{movie.genre[0]}</span>}
                    <button className="book-btn">View Details</button>
                </div>
            </div>
            <div className="card-info">
                <h3>{movie.title}</h3>
                <p>
                    <span>{movie.duration} mins</span>
                    <span className="card-language">{movie.language}</span>
                </p>
            </div>
        </Link>
    );
};

export default MovieCard;
