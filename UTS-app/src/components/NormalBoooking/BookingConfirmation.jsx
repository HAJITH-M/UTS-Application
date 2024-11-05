import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extracting data from location state
  const { departure, arrival, fare } = location.state || {};
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch userId based on email stored in localStorage
  useEffect(() => {
    const email = localStorage.getItem('userEmail'); // Retrieve email from localStorage

    if (email) {
      // Make a request to your backend to fetch userId based on the email
      const fetchUserId = async () => {
        try {
          const response = await axios.get('http://localhost:5000/get-user-id', {
            params: { email }, // Assuming you have a route to fetch userId by email
          });

          if (response.data.userId) {
            setUserId(response.data.userId); // Set the userId
          } else {
            console.error('User ID not found');
            setError('User ID not found');
          }
        } catch (error) {
          console.error('Error fetching user ID:', error.response ? error.response.data : error.message);
          setError('Error fetching user ID');
        }
      };

      fetchUserId();
    } else {
      console.error('User email not found in localStorage');
      setError('User email not found');
    }
  }, []);

  // Handle the booking confirmation
  const handleConfirmBooking = async () => {
    if (!userId) {
      alert('User ID is required. Please login first.');
      return;
    }
  
    // Log the data being sent
    console.log('Booking data:', {
      departureTrainId: departure.stationId,
      arrivalTrainId: arrival.stationId,
      fare,
      userId,
    });
  
    try {
      const response = await axios.post('http://localhost:5000/book', {
        departureTrainId: departure.stationId,
        arrivalTrainId: arrival.stationId,
        userId, // Ensure userId is available
      });
  
      if (response.data.message === 'Booking successful!') {
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
      
      {/* Error message */}
      {error && (
        <div className="text-red-500 bg-red-100 p-2 mb-4 rounded">
          {error}
        </div>
      )}

      {/* Success message */}
      {successMessage && (
        <div className="text-green-500 bg-green-100 p-2 mb-4 rounded">
          {successMessage}
        </div>
      )}

      {/* Train details */}
      <div>
        <h2 className="font-semibold">Departure Train:</h2>
        <p>{departure?.trainNumber} - {departure?.stationName}</p>
      </div>
      <div>
        <h2 className="font-semibold">Arrival Train:</h2>
        <p>{arrival?.trainNumber} - {arrival?.stationName}</p>
      </div>
      <div>
        <h2 className="font-semibold">Total Fare:</h2>
        <p>${fare}</p>
      </div>

      {/* Booking button */}
      <button 
        onClick={handleConfirmBooking} 
        className="bg-green-500 text-white px-4 py-2 rounded mt-4"
        disabled={loading || !userId} // Disable button while loading or if userId isn't fetched
      >
        {loading ? 'Booking...' : 'Confirm Booking'}
      </button>

      {/* Cancel button to navigate back */}
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
