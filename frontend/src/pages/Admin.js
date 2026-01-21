import React, { useState, useEffect } from 'react';
import API from '../services/api';
import {
    Plus,
    Edit2,
    Trash2,
    Film,
    Calendar,
    Ticket,
    Activity,
    X,
    Upload,
    ChevronRight,
    Search
} from 'lucide-react';
import './Admin.css';
import { useToast } from '../components/Toast';

const Admin = () => {
    const toast = useToast();
    const [activeTab, setActiveTab] = useState('bookings');
    const [bookings, setBookings] = useState([]);
    const [movies, setMovies] = useState([]);
    const [showtimes, setShowtimes] = useState([]);
    const [theatres, setTheatres] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [isMovieModalOpen, setIsMovieModalOpen] = useState(false);
    const [editingMovie, setEditingMovie] = useState(null);
    const [movieFormData, setMovieFormData] = useState({
        title: '',
        description: '',
        duration: '',
        language: '',
        genre: '',
        releaseDate: '',
        posterUrl: '',
        trailerUrl: '',
        director: '',
    });

    // Showtime Modal states
    const [isShowtimeModalOpen, setIsShowtimeModalOpen] = useState(false);
    const [editingShowtime, setEditingShowtime] = useState(null);
    const [showtimeFormData, setShowtimeFormData] = useState({
        movie: '',
        theatre: '',
        screenId: '',
        showDate: '',
        showTime: '',
        pricePerSeat: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [bookingsRes, moviesRes, showtimesRes, theatresRes] = await Promise.all([
                API.get('/bookings/all'),
                API.get('/movies'),
                API.get('/showtimes/all/global'),
                API.get('/theatres')
            ]);

            if (bookingsRes.data) setBookings(bookingsRes.data);
            if (moviesRes.data) setMovies(moviesRes.data);
            if (showtimesRes.data) setShowtimes(showtimesRes.data);
            if (theatresRes.data) setTheatres(theatresRes.data);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching admin data:', error);
            setLoading(false);
        }
    };

    const handleMovieSubmit = async (e) => {
        e.preventDefault();
        try {
            const genresArray = typeof movieFormData.genre === 'string'
                ? movieFormData.genre.split(',').map(g => g.trim())
                : movieFormData.genre;

            const data = { ...movieFormData, genre: genresArray };

            if (editingMovie) {
                await API.put(`/movies/${editingMovie._id}`, data);
                toast.success('Movie updated successfully');
            } else {
                await API.post('/movies', data);
                toast.success('Movie added successfully');
            }
            setIsMovieModalOpen(false);
            setEditingMovie(null);
            setMovieFormData({ title: '', description: '', duration: '', language: '', genre: '', releaseDate: '', posterUrl: '', trailerUrl: '', director: '' });
            fetchData();
        } catch (error) {
            console.error('Error saving movie:', error);
            toast.error('Failed to save movie');
        }
    };

    const handleShowtimeSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingShowtime) {
                await API.put(`/showtimes/${editingShowtime._id}`, showtimeFormData);
                toast.success('Showtime updated successfully');
            } else {
                await API.post('/showtimes', showtimeFormData);
                toast.success('Showtime added successfully');
            }
            setIsShowtimeModalOpen(false);
            setEditingShowtime(null);
            setShowtimeFormData({ movie: '', theatre: '', screenId: '', showDate: '', showTime: '', pricePerSeat: '' });
            fetchData();
        } catch (error) {
            console.error('Error saving showtime:', error);
            toast.error('Failed to save showtime');
        }
    };

    const deleteMovie = async (id) => {
        if (!window.confirm('Are you sure you want to delete this movie?')) return;
        try {
            await API.delete(`/movies/${id}`);
            fetchData();
        } catch (error) {
            console.error('Error deleting movie:', error);
        }
    };

    const deleteShowtime = async (id) => {
        if (!window.confirm('Are you sure you want to delete this showtime?')) return;
        try {
            await API.delete(`/showtimes/${id}`);
            fetchData();
        } catch (error) {
            console.error('Error deleting showtime:', error);
        }
    };

    const openEditModal = (movie) => {
        setEditingMovie(movie);
        setMovieFormData({
            ...movie,
            genre: movie.genre.join(', '),
            releaseDate: movie.releaseDate.split('T')[0]
        });
        setIsMovieModalOpen(true);
    };

    const openShowtimeEditModal = (show) => {
        setEditingShowtime(show);
        setShowtimeFormData({
            movie: show.movie?._id,
            theatre: show.theatre?._id,
            screenId: show.screenId,
            showDate: show.showDate.split('T')[0],
            showTime: show.showTime,
            pricePerSeat: show.pricePerSeat
        });
        setIsShowtimeModalOpen(true);
    };

    if (loading) return <div className="loader">Initializing Command Center...</div>;

    return (
        <div className="admin-page container fade-in">
            <header className="admin-header">
                <div>
                    <h1 className="text-gradient">Command Center</h1>
                    <p className="text-dim">Platform management and analytics</p>
                </div>
                {activeTab === 'movies' && (
                    <button className="primary-btn" onClick={() => { setEditingMovie(null); setIsMovieModalOpen(true); }}>
                        <Plus size={18} /> Add New Movie
                    </button>
                )}
                {activeTab === 'showtimes' && (
                    <button className="primary-btn" onClick={() => { setEditingShowtime(null); setIsShowtimeModalOpen(true); }}>
                        <Plus size={18} /> Schedule Showtime
                    </button>
                )}
            </header>

            <nav className="admin-nav">
                <button className={`admin-nav-btn ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>
                    <Ticket size={18} /> Bookings
                </button>
                <button className={`admin-nav-btn ${activeTab === 'movies' ? 'active' : ''}`} onClick={() => setActiveTab('movies')}>
                    <Film size={18} /> Movies
                </button>
                <button className={`admin-nav-btn ${activeTab === 'showtimes' ? 'active' : ''}`} onClick={() => setActiveTab('showtimes')}>
                    <Calendar size={18} /> Showtimes
                </button>
                <button className={`admin-nav-btn ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>
                    <Activity size={18} /> Analytics
                </button>
            </nav>

            <div className="admin-content">
                {activeTab === 'bookings' && (
                    <div className="admin-table-container glass-morphism">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Booking ID</th>
                                    <th>Movie</th>
                                    <th>User</th>
                                    <th>Seats</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map(booking => (
                                    <tr key={booking._id}>
                                        <td className="font-mono" style={{ fontSize: '0.8rem' }}>#{booking._id.slice(-8).toUpperCase()}</td>
                                        <td>{booking.movie?.title}</td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span>{booking.user?.name}</span>
                                                <span className="text-dim" style={{ fontSize: '0.75rem' }}>{booking.user?.email}</span>
                                            </div>
                                        </td>
                                        <td>{booking.selectedSeats?.join(', ')}</td>
                                        <td>₹{booking.totalAmount}</td>
                                        <td>
                                            <span className={`status-badge ${booking.bookingStatus?.toLowerCase()}`}>
                                                {booking.bookingStatus}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'movies' && (
                    <div className="admin-table-container glass-morphism">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Poster</th>
                                    <th>Title</th>
                                    <th>Language</th>
                                    <th>Genre</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {movies.map(movie => (
                                    <tr key={movie._id}>
                                        <td><img src={movie.posterUrl} alt="" style={{ width: '40px', borderRadius: '4px' }} /></td>
                                        <td>{movie.title}</td>
                                        <td>{movie.language}</td>
                                        <td>{movie.genre.slice(0, 2).join(', ')}</td>
                                        <td>{movie.isActive ? 'Active' : 'Inactive'}</td>
                                        <td className="action-btns">
                                            <button className="icon-btn" onClick={() => openEditModal(movie)}><Edit2 size={16} /></button>
                                            <button className="icon-btn delete" onClick={() => deleteMovie(movie._id)}><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'showtimes' && (
                    <div className="admin-table-container glass-morphism">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Movie</th>
                                    <th>Theatre</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Price</th>
                                    <th>Booked</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {showtimes.map(show => (
                                    <tr key={show._id}>
                                        <td>{show.movie?.title}</td>
                                        <td>{show.theatre?.name}</td>
                                        <td>{new Date(show.showDate).toLocaleDateString()}</td>
                                        <td>{show.showTime}</td>
                                        <td>₹{show.pricePerSeat}</td>
                                        <td>{show.bookedSeats?.length} / 100</td>
                                        <td className="action-btns">
                                            <button className="icon-btn" onClick={() => openShowtimeEditModal(show)}><Edit2 size={16} /></button>
                                            <button className="icon-btn delete" onClick={() => deleteShowtime(show._id)}><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                                {showtimes.length === 0 && (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }} className="text-dim">No showtimes scheduled.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'stats' && (
                    <div className="admin-stats-grid">
                        <div className="stat-card glass-morphism">
                            <h3>Total Revenue</h3>
                            <div className="value text-gradient">₹{bookings.reduce((acc, b) => b.bookingStatus === 'CONFIRMED' ? acc + b.totalAmount : acc, 0).toLocaleString()}</div>
                        </div>
                        <div className="stat-card glass-morphism">
                            <h3>Total Bookings</h3>
                            <div className="value">{bookings.length}</div>
                        </div>
                        <div className="stat-card glass-morphism">
                            <h3>Active Movies</h3>
                            <div className="value">{movies.filter(m => m.isActive).length}</div>
                        </div>
                        <div className="stat-card glass-morphism">
                            <h3>Cancelled Tickets</h3>
                            <div className="value">{bookings.filter(b => b.bookingStatus === 'CANCELLED').length}</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Movie Modal */}
            {isMovieModalOpen && (
                <div className="modal-overlay">
                    <div className="admin-modal glass-morphism fade-in">
                        <div className="close-modal" onClick={() => setIsMovieModalOpen(false)}><X size={24} /></div>
                        <h2>{editingMovie ? 'Edit Movie' : 'Add New Movie'}</h2>
                        <form className="admin-form" onSubmit={handleMovieSubmit}>
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    value={movieFormData.title}
                                    onChange={(e) => setMovieFormData({ ...movieFormData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Language</label>
                                    <select
                                        value={movieFormData.language}
                                        onChange={(e) => setMovieFormData({ ...movieFormData, language: e.target.value })}
                                    >
                                        <option value="English">English</option>
                                        <option value="Tamil">Tamil</option>
                                        <option value="Telugu">Telugu</option>
                                        <option value="Hindi">Hindi</option>
                                        <option value="Malayalam">Malayalam</option>
                                        <option value="Kannada">Kannada</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Duration (mins)</label>
                                    <input
                                        type="number"
                                        value={movieFormData.duration}
                                        onChange={(e) => setMovieFormData({ ...movieFormData, duration: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Genre (comma separated)</label>
                                <input
                                    type="text"
                                    value={movieFormData.genre}
                                    onChange={(e) => setMovieFormData({ ...movieFormData, genre: e.target.value })}
                                    placeholder="Action, Sci-Fi"
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    rows="3"
                                    value={movieFormData.description}
                                    onChange={(e) => setMovieFormData({ ...movieFormData, description: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Release Date</label>
                                    <input
                                        type="date"
                                        value={movieFormData.releaseDate}
                                        onChange={(e) => setMovieFormData({ ...movieFormData, releaseDate: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Director</label>
                                    <input
                                        type="text"
                                        value={movieFormData.director}
                                        onChange={(e) => setMovieFormData({ ...movieFormData, director: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Poster URL</label>
                                <input
                                    type="text"
                                    value={movieFormData.posterUrl}
                                    onChange={(e) => setMovieFormData({ ...movieFormData, posterUrl: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Trailer URL (YouTube)</label>
                                <input
                                    type="text"
                                    value={movieFormData.trailerUrl}
                                    onChange={(e) => setMovieFormData({ ...movieFormData, trailerUrl: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="primary-btn">{editingMovie ? 'Update Movie' : 'Create Movie'}</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Showtime Modal */}
            {isShowtimeModalOpen && (
                <div className="modal-overlay">
                    <div className="admin-modal glass-morphism fade-in">
                        <div className="close-modal" onClick={() => setIsShowtimeModalOpen(false)}><X size={24} /></div>
                        <h2>{editingShowtime ? 'Edit Showtime' : 'Schedule Showtime'}</h2>
                        <form className="admin-form" onSubmit={handleShowtimeSubmit}>
                            <div className="form-group">
                                <label>Movie</label>
                                <select
                                    value={showtimeFormData.movie}
                                    onChange={(e) => setShowtimeFormData({ ...showtimeFormData, movie: e.target.value })}
                                    required
                                >
                                    <option value="">Select Movie</option>
                                    {movies.map(m => (
                                        <option key={m._id} value={m._id}>{m.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Theatre</label>
                                <select
                                    value={showtimeFormData.theatre}
                                    onChange={(e) => setShowtimeFormData({ ...showtimeFormData, theatre: e.target.value })}
                                    required
                                >
                                    <option value="">Select Theatre</option>
                                    {theatres.map(t => (
                                        <option key={t._id} value={t._id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Screen ID</label>
                                    <input
                                        type="text"
                                        value={showtimeFormData.screenId}
                                        onChange={(e) => setShowtimeFormData({ ...showtimeFormData, screenId: e.target.value })}
                                        placeholder="Screen 1"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Price per Seat</label>
                                    <input
                                        type="number"
                                        value={showtimeFormData.pricePerSeat}
                                        onChange={(e) => setShowtimeFormData({ ...showtimeFormData, pricePerSeat: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Show Date</label>
                                    <input
                                        type="date"
                                        value={showtimeFormData.showDate}
                                        onChange={(e) => setShowtimeFormData({ ...showtimeFormData, showDate: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Show Time</label>
                                    <input
                                        type="text"
                                        value={showtimeFormData.showTime}
                                        onChange={(e) => setShowtimeFormData({ ...showtimeFormData, showTime: e.target.value })}
                                        placeholder="10:00 AM"
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" className="primary-btn">{editingShowtime ? 'Update Showtime' : 'Create Showtime'}</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
