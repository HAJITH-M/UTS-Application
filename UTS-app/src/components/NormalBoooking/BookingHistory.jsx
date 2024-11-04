// BookingHistory.jsx
import React from 'react';

const BookingHistory = ({ bookings }) => {
  return (
    <div className="bg-gray-100 p-5">
      <h2 className="text-lg font-semibold">Your Bookings:</h2>
      <ul>
        {bookings.map((booking) => (
          <li key={booking.id} className="mb-2 border p-2 rounded">
            <p><strong>Departure:</strong> {booking.departureTrainNumber}</p>
            <p><strong>Arrival:</strong> {booking.arrivalTrainNumber}</p>
            <p><strong>Fare:</strong> ${booking.totalFare}</p>
            <p><strong>Email:</strong> {booking.email}</p>
            <p><strong>Created At:</strong> {new Date(booking.createdAt).toLocaleString()}</p>
          </li>
        ))}
        {bookings.length === 0 && <p>No bookings found.</p>}
      </ul>
    </div>
  );
};

export default BookingHistory;
