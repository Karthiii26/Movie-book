import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { BookingContext } from '../context/BookingContext';
import { Ticket, CreditCard, ChevronLeft } from 'lucide-react';
import './Confirmation.css';

const Confirmation = () => {
    const navigate = useNavigate();
    const { bookingData, resetBooking } = useContext(BookingContext);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (
            !bookingData?.movie ||
            !bookingData?.theatre ||
            !bookingData?.showtime ||
            !bookingData?.selectedSeats?.length
        ) {
            navigate('/');
        }
    }, [bookingData, navigate]);

    if (!bookingData?.selectedSeats?.length) return null;

    const handleConfirm = async () => {
        const movieId = bookingData?.movie?._id;
        const theatreId = bookingData?.theatre?._id;
        const showtimeId = bookingData?.showtime?._id;

        if (!movieId || !theatreId || !showtimeId) {
            alert('Booking session expired. Please start your booking again.');
            resetBooking();
            navigate('/');
            return;
        }

        setLoading(true);
        try {
            await API.post('/bookings', {
                movie: movieId,
                theatre: theatreId,
                showtime: showtimeId,
                selectedSeats: bookingData.selectedSeats,
                totalAmount: bookingData.totalPrice
            });

            alert('Booking Successful!');
            resetBooking();
            navigate('/dashboard');
        } catch (error) {
            console.error('❌ Booking error:', error);
            const errorMessage = error.response?.data?.message || 'Booking failed';
            alert(errorMessage);

            // If unauthorized (401), redirect to login
            if (error.response?.status === 401) {
                localStorage.removeItem('userInfo'); // Clear invalid session
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="confirmation-page container fade-in">
            <button onClick={() => navigate(-1)} className="back-link">
                <ChevronLeft size={16} /> Back to Seat Selection
            </button>

            <div className="confirmation-card glass-morphism">
                <div className="summary-section">
                    <h2>Booking Summary</h2>
                    <div className="summary-item">
                        <Ticket className="summary-icon" />
                        <div>
                            <h3>{bookingData.movie?.title}</h3>
                            <p>{bookingData.theatre?.name} | {bookingData.showtime?.showTime}</p>
                        </div>
                    </div>

                    <div className="divider"></div>

                    <div className="details-grid">
                        <div className="detail-box">
                            <p>Seats</p>
                            <h3>{bookingData.selectedSeats.join(', ')}</h3>
                        </div>
                        <div className="detail-box">
                            <p>Tickets</p>
                            <h3>{bookingData.selectedSeats.length}</h3>
                        </div>
                    </div>

                    <div className="pricing-box">
                        <div className="price-row">
                            <span>Ticket Price (x{bookingData.selectedSeats.length})</span>
                            <span>₹{bookingData.totalPrice}</span>
                        </div>
                        <div className="price-row total">
                            <span>Total Amount</span>
                            <span>₹{bookingData.totalPrice}</span>
                        </div>
                    </div>

                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className="primary-btn confirm-btn"
                    >
                        {loading ? 'Processing...' : 'Confirm & Book Now'}
                        {!loading && <CreditCard size={18} style={{ marginLeft: '10px' }} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Confirmation;
