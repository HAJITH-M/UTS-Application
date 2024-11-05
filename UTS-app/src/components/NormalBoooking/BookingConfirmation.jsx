import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { departure, arrival, fare } = location.state || {};

  const [userId, setUserId] = useState(null);

  // Fetch userId based on email
  useEffect(() => {
    const email = localStorage.getItem('userEmail'); // Retrieve email from localStorage

    if (email) {
      // Make a request to your backend to fetch the userId based on the email
      const fetchUserId = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/get-user-id`, {
            params: { email } // Assuming you have a route to fetch userId by email
          });

          if (response.data.userId) {
            setUserId(response.data.userId); // Set the userId
          } else {
            console.error('User ID not found');
          }
        } catch (error) {
          console.error('Error fetching user ID:', error.response ? error.response.data : error.message);
        }
      };

      fetchUserId();
    } else {
      console.error('User email not found in localStorage');
    }
  }, []);

  // Handle the booking confirmation
  const handleConfirmBooking = async () => {
    if (!userId) {
      alert('User ID is required. Please login first.');
      return;
    }

    try {
      console.log('Sending data:', {
        departure,
        arrival,
        fare,
        userId, // Ensure userId is valid
      });

      const response = await axios.post('http://localhost:5000/book', {
        departure,
        arrival,
        fare,
        userId,
      });

      if (response.data.message === 'Booking confirmed') {
        alert('Booking successful!');
        navigate('/'); // Redirect to homepage or booking list
      }
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
        <p>{departure?.trainNumber} - {departure?.stationName}</p>
      </div>
      <div>
        <h2>Arrival Train:</h2>
        <p>{arrival?.trainNumber} - {arrival?.stationName}</p>
      </div>
      <div>
        <h2>Total Fare:</h2>
        <p>${fare}</p>
      </div>
      <button 
        onClick={handleConfirmBooking} 
        className="bg-green-500 text-white px-4 py-2 rounded mt-4"
        disabled={!userId} // Disable the button until userId is fetched
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
