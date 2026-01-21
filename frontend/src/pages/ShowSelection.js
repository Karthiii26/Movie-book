import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { BookingContext } from '../context/BookingContext';
import { AuthContext } from '../context/AuthContext';
import { MapPin, Calendar, Clock, AlertCircle } from 'lucide-react';
import './ShowSelection.css';

const ShowSelection = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showtimes, setShowtimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const { bookingData, updateBooking } = useContext(BookingContext);
    const { userInfo } = useContext(AuthContext);

    useEffect(() => {
        const fetchShowtimes = async () => {
            try {
                const { data } = await API.get(`/showtimes/movie/${id}`);
                setShowtimes(data);
            } catch (error) {
                console.error('Error fetching showtimes:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchMovieDetails = async () => {
            if (!bookingData.movie) {
                try {
                    const { data } = await API.get(`/movies/${id}`);
                    updateBooking({ movie: data });
                } catch (error) {
                    console.error('Error fetching movie details:', error);
                }
            }
        };

        fetchShowtimes();
        fetchMovieDetails();
    }, [id, bookingData.movie, updateBooking]);

    const handleSelectShow = (show) => {
        console.log('=== SHOW SELECTION DEBUG ===');
        console.log('Selected show object:', show);
        console.log('Show.theatre:', show.theatre);
        console.log('Show.theatre._id:', show.theatre?._id);

        updateBooking({
            theatre: show.theatre,
            showtime: show
        });
        navigate('/seats');
    };

    if (loading) return <div className="loader">Loading showtimes...</div>;

    // Group showtimes by theatre
    const groupedShows = (showtimes || []).reduce((acc, show) => {
        // Defensive check: ensure all required properties exist
        if (!show || !show.theatre || !show.theatre._id || !show.theatre.name) {
            console.warn('Invalid showtime data received:', show);
            return acc;
        }
        const theatreId = show.theatre._id;
        if (!acc[theatreId]) {
            acc[theatreId] = {
                name: show.theatre.name,
                address: show.theatre.address,
                shows: []
            };
        }
        acc[theatreId].shows.push(show);
        return acc;
    }, {});

    return (
        <div className="show-selection container fade-in">
            <header className="page-header">
                {userInfo?.isAdmin && (
                    <div className="admin-warning-banner glass-morphism">
                        <p><strong>Note:</strong> As an Administrator, you can view showtimes but cannot book tickets.</p>
                    </div>
                )}
                <h1>{bookingData.movie?.title}</h1>
                <div className="movie-meta">
                    <span>{bookingData.movie?.language}</span>
                    <span>{bookingData.movie?.duration} mins</span>
                </div>
            </header>

            <div className="theatre-list">
                {Object.values(groupedShows).map((theatre, idx) => (
                    <div key={idx} className="theatre-card glass-morphism">
                        <div className="theatre-info">
                            <h3>{theatre.name}</h3>
                            <p><MapPin size={14} /> {theatre.address}</p>
                        </div>
                        <div className="showtimes-grid">
                            {theatre.shows.map((show) => (
                                <button
                                    key={show._id}
                                    className="show-btn"
                                    onClick={() => handleSelectShow(show)}
                                >
                                    <div className="show-time">
                                        <Clock size={14} /> {show.showTime}
                                    </div>
                                    <div className="show-screen">{show.screenId}</div>
                                    <span className="price">₹{show.pricePerSeat}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
                {showtimes.length === 0 && <p className="no-shows">No showtimes available for this movie.</p>}
            </div>
        </div>
    );
};

export default ShowSelection;
