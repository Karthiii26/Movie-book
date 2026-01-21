import React, { createContext, useState } from 'react';

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
    const [bookingData, setBookingData] = useState({
        movie: null,
        theatre: null,
        showtime: null,
        selectedSeats: [],
        totalPrice: 0,
    });

    const updateBooking = (data) => {
        setBookingData((prev) => ({ ...prev, ...data }));
    };

    const resetBooking = () => {
        setBookingData({
            movie: null,
            theatre: null,
            showtime: null,
            selectedSeats: [],
            totalPrice: 0,
        });
    };

    return (
        <BookingContext.Provider value={{ bookingData, updateBooking, resetBooking }}>
            {children}
        </BookingContext.Provider>
    );
};
