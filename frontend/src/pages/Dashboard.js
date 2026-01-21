import React, { useEffect, useState, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Calendar, MapPin, Ticket } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userInfo } = useContext(AuthContext);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data } = await API.get('/bookings/mybookings');
                setBookings(data);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const cancelBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;

        try {
            await API.put(`/bookings/${bookingId}/cancel`);
            setBookings(bookings.map(b => b._id === bookingId ? { ...b, bookingStatus: 'CANCELLED' } : b));
            alert('Booking cancelled successfully');
        } catch (error) {
            console.error('Error cancelling booking:', error);
            alert(error.response?.data?.message || 'Failed to cancel booking');
        }
    };

    if (loading) return <div className="loader">Preparing your ticket collection...</div>;

    return (
        <div className="dashboard-page container fade-in">
            <header className="dashboard-header">
                <h1 className="text-gradient">Welcome, {userInfo?.name}!</h1>
                <p>Manage your movie experiences and ticket history</p>
            </header>

            <div className="bookings-list">
                {bookings.length === 0 ? (
                    <div className="no-bookings glass-morphism">
                        <Ticket size={64} style={{ opacity: 0.3 }} />
                        <p>Your ticket collection is empty.</p>
                        <button onClick={() => window.location.href = '/'} className="primary-btn">Explore Movies</button>
                    </div>
                ) : (
                    (bookings || []).map((booking) => (
                        booking && (
                            <div key={booking._id} className="booking-card glass-morphism">
                                <div className="booking-poster">
                                    <img src={booking.movie?.posterUrl} alt={booking.movie?.title} />
                                </div>
                                <div className="booking-details">
                                    <div className="booking-main">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <h3>{booking.movie?.title || 'Unknown Movie'}</h3>
                                                <span className="booking-id">ID: {booking._id?.slice(-8).toUpperCase()}</span>
                                            </div>
                                            <div className="booking-footer" style={{ border: 'none', padding: 0 }}>
                                                <span className={`status-badge ${booking.bookingStatus?.toLowerCase()}`}>
                                                    {booking.bookingStatus}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="booking-info-grid">
                                        <div className="info-item">
                                            <MapPin size={16} />
                                            <span>{booking.theatre?.name || 'Unknown Theatre'}</span>
                                        </div>
                                        <div className="info-item">
                                            <Calendar size={16} />
                                            <span>{new Date(booking.bookingDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })} | {booking.showtime?.showTime || 'N/A'}</span>
                                        </div>
                                        <div className="info-item">
                                            <Ticket size={16} />
                                            <span>{booking.selectedSeats?.join(', ') || 'N/A'} ({booking.selectedSeats?.length || 0} Tickets)</span>
                                        </div>
                                    </div>
                                    <div className="booking-footer">
                                        <span className="total-paid">Total: ₹{booking.totalAmount}</span>
                                        <div>
                                            {booking.bookingStatus === 'CONFIRMED' && (
                                                <button onClick={() => cancelBooking(booking._id)} className="cancel-btn">
                                                    Cancel Booking
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    ))
                )}
            </div>
        </div>
    );
};

export default Dashboard;
