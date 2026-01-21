import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getShowById, createBooking } from '../services/api';

const Booking = () => {
    const { showId } = useParams();
    const navigate = useNavigate();
    const [show, setShow] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchShow = async () => {
            try {
                const { data } = await getShowById(showId);
                setShow(data.show);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchShow();
    }, [showId]);

    const toggleSeat = (seatNo, status) => {
        if (status === 'booked') return;
        if (selectedSeats.includes(seatNo)) {
            setSelectedSeats(selectedSeats.filter(s => s !== seatNo));
        } else {
            setSelectedSeats([...selectedSeats, seatNo]);
        }
    };

    const handleBooking = async () => {
        try {
            const bookingData = {
                userId: "GuestUser", // Mock user
                showId,
                seats: selectedSeats,
                totalAmount: selectedSeats.length * show.price
            };
            const { data } = await createBooking(bookingData);
            if (data.success) {
                navigate('/confirmation', { state: { booking: data.booking, movie: show.movieId, theatre: show.theatreId } });
            }
        } catch (error) {
            alert(error.response?.data?.message || "Booking failed");
        }
    };

    if (loading) return <div className="container" style={{ padding: '100px', textAlign: 'center' }}>Loading Seats...</div>;
    if (!show) return <div className="container">Show not found</div>;

    return (
        <div className="container">
            <div className="seats-container">
                <h2>{show.movieId.title} - {show.theatreId.name}</h2>
                <p style={{ color: '#999', marginBottom: '40px' }}>
                    {new Date(show.showTime).toLocaleString([], { dateStyle: 'long', timeStyle: 'short' })}
                </p>

                <div className="screen"></div>
                <p style={{ marginBottom: '20px', fontSize: '12px', color: '#666' }}>All eyes this way please!</p>

                <div className="seats-grid">
                    {Object.entries(
                        show.seats.reduce((acc, seat) => {
                            const row = seat.seatNo.charAt(0);
                            if (!acc[row]) acc[row] = [];
                            acc[row].push(seat);
                            return acc;
                        }, {})
                    ).map(([row, rowSeats]) => (
                        <div key={row} className="seats-row">
                            <div className="seat-row-label">{row}</div>
                            {rowSeats.map(seat => (
                                <div
                                    key={seat.seatNo}
                                    className={`seat ${seat.status} ${selectedSeats.includes(seat.seatNo) ? 'selected' : ''}`}
                                    onClick={() => toggleSeat(seat.seatNo, seat.status)}
                                >
                                    {seat.seatNo.substring(1)}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>


                <div className="booking-summary">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span>Selected Seats:</span>
                        <span>{selectedSeats.join(', ') || 'None'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <span>Total Price:</span>
                        <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary)' }}>₹{selectedSeats.length * show.price}</span>
                    </div>
                    <button
                        className="btn"
                        style={{ width: '100%' }}
                        disabled={selectedSeats.length === 0}
                        onClick={handleBooking}
                    >
                        Book {selectedSeats.length} Tickets
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Booking;
