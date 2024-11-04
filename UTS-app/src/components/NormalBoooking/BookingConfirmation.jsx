import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { departure, arrival, fare, email } = location.state || {};

  const handleConfirmBooking = async () => {
    try {
      await axios.post('http://localhost:5000/book', {
        departure,
        arrival,
        fare,
        email,
      });
      alert('Booking successful!');
      navigate('/'); // Redirect to homepage or booking list
    } catch (error) {
      console.error('Error confirming booking:', error.response ? error.response.data : error.message);
      alert('Error confirming booking. Please try again.');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Confirm Your Booking</h1>
      <div>
        <h2>Departure Train:</h2>
        <p>{departure.trainNumber} - {departure.stationName}</p>
      </div>
      <div>
        <h2>Arrival Train:</h2>
        <p>{arrival.trainNumber} - {arrival.stationName}</p>
      </div>
      <div>
        <h2>Total Fare:</h2>
        <p>${fare}</p>
      </div>
      <div>
        <h2>Email:</h2>
        <p>{email}</p>
      </div>
      <button 
        onClick={handleConfirmBooking} 
        className="bg-green-500 text-white px-4 py-2 rounded mt-4"
      >
        Confirm Booking
      </button>
      <button 
        onClick={() => navigate(-1)} 
        className="bg-gray-500 text-white px-4 py-2 rounded mt-4 ml-2"
      >
        Cancel
      </button>
    </div>
  );
};

export default BookingConfirmation;
