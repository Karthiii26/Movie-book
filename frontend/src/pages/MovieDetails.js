import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { BookingContext } from '../context/BookingContext';
import { Clock, Globe, Calendar, Tag } from 'lucide-react';
import './MovieDetails.css';

const MovieDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const { updateBooking } = useContext(BookingContext);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const { data } = await API.get(`/movies/${id}`);
                setMovie(data);
            } catch (error) {
                console.error('Error fetching movie:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMovie();
    }, [id]);

    const handleBookNow = () => {
        updateBooking({ movie });
        navigate(`/book/${id}`);
    };

    if (loading) return <div className="loader">Loading...</div>;
    if (!movie) return <div className="loader">Movie not found</div>;

    return (
        <div className="movie-details-page">
            <div className="backdrop-container">
                <img src={movie.posterUrl} alt="" className="backdrop-image" />
                <div className="backdrop-overlay"></div>
            </div>

            <div className="container fade-in">
                <div className="details-layout">
                    <div className="poster-section">
                        <img
                            src={movie.posterUrl}
                            alt={movie.title}
                            className="detail-poster"
                            loading="lazy"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/500x750?text=No+Poster+Available';
                            }}
                        />
                    </div>

                    <div className="info-section">
                        <h1 className="text-gradient">{movie.title}</h1>
                        <div className="meta-info">
                            <span className="info-item"><Clock size={16} /> {movie.duration} mins</span>
                            <span className="info-item"><Globe size={16} /> {movie.language}</span>
                            <span className="info-item"><Calendar size={16} /> {new Date(movie.releaseDate).getFullYear()}</span>
                        </div>

                        <div className="genre-list">
                            {movie.genre.map((g, idx) => (
                                <span key={idx} className="genre-tag">{g}</span>
                            ))}
                        </div>

                        <p className="description">{movie.description}</p>

                        <button onClick={handleBookNow} className="primary-btn">Book Tickets Now</button>

                        <div className="details-sections">
                            <section>
                                <h2 className="section-title">Trailer</h2>
                                <div className="trailer-container glass-morphism">
                                    {movie.trailerUrl ? (
                                        <iframe
                                            src={movie.trailerUrl.replace('watch?v=', 'embed/')}
                                            title="Movie Trailer"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    ) : (
                                        <div className="loader">Trailer coming soon...</div>
                                    )}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;
