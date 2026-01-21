import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookingContext } from '../context/BookingContext';
import { AuthContext } from '../context/AuthContext';
import './SeatSelection.css';

const SeatSelection = () => {
    const navigate = useNavigate();
    const { bookingData, updateBooking } = useContext(BookingContext);
    const { userInfo } = useContext(AuthContext);
    const [selectedSeats, setSelectedSeats] = useState([]);

    useEffect(() => {
        if (!bookingData.showtime) {
            navigate('/');
        }
    }, [bookingData.showtime, navigate]);

    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const cols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const handleSeatClick = (seat) => {
        if (!bookingData.showtime || !bookingData.showtime.bookedSeats) return;
        if (bookingData.showtime.bookedSeats.includes(seat)) return;

        if (selectedSeats.includes(seat)) {
            setSelectedSeats(selectedSeats.filter(s => s !== seat));
        } else {
            setSelectedSeats([...selectedSeats, seat]);
        }
    };

    const handleContinue = () => {
        if (selectedSeats.length === 0) {
            alert('Please select at least one seat');
            return;
        }

        if (!bookingData.showtime || !bookingData.showtime.pricePerSeat) {
            alert('Booking session expired. Please select a show again.');
            navigate('/');
            return;
        }

        if (!userInfo) {
            navigate('/login', { state: { from: '/seats' } });
            return;
        }

        updateBooking({
            selectedSeats,
            totalPrice: selectedSeats.length * bookingData.showtime.pricePerSeat
        });
        navigate('/confirmation');
    };

    if (!bookingData.showtime) return null;

    return (
        <div className="seat-selection container fade-in">
            <div className="selection-header">
                <h2>Select Your Seats</h2>
                <p>{bookingData.theatre?.name} | {bookingData.showtime?.showTime}</p>
            </div>

            <div className="screen-container">
                <div className="screen-curve"></div>
                <p>SCREEN THIS WAY</p>
            </div>

            <div className="seats-grid">
                {rows.map(row => (
                    <div key={row} className="seat-row">
                        <span className="row-label">{row}</span>
                        {cols.map(col => {
                            const seatId = `${row}${col}`;
                            const isBooked = bookingData.showtime?.bookedSeats?.includes(seatId) || false;
                            const isSelected = selectedSeats.includes(seatId);

                            return (
                                <button
                                    key={seatId}
                                    className={`seat ${isBooked ? 'booked' : ''} ${isSelected ? 'selected' : ''}`}
                                    disabled={isBooked}
                                    onClick={() => handleSeatClick(seatId)}
                                    title={seatId}
                                >
                                    {col}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>

            <div className="legend">
                <div className="legend-item"><div className="seat-sample available"></div> Available</div>
                <div className="legend-item"><div className="seat-sample selected"></div> Selected</div>
                <div className="legend-item"><div className="seat-sample booked"></div> Booked</div>
            </div>

            <div className="selection-footer glass-morphism">
                <div className="footer-info">
                    <p>Seats: <span>{selectedSeats.join(', ') || 'None'}</span></p>
                    <h3>Total: ₹{selectedSeats.length * (bookingData.showtime?.pricePerSeat || 0)}</h3>
                </div>
                <button
                    onClick={handleContinue}
                    className={`primary-btn continue-btn ${userInfo?.isAdmin ? 'disabled' : ''}`}
                    disabled={userInfo?.isAdmin}
                    title={userInfo?.isAdmin ? 'Admin accounts cannot book tickets' : ''}
                >
                    {userInfo?.isAdmin ? 'Admin: Booking Disabled' : 'Proceed to Pay'}
                </button>
            </div>
        </div>
    );
};

export default SeatSelection;
