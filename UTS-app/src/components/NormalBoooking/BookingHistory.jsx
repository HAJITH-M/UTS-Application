import React, { useEffect, useState } from 'react';
import { FaTrain, FaMoneyBillWave, FaEnvelope, FaClock } from 'react-icons/fa';
import axios from 'axios';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);  // State to store bookings
  const [loading, setLoading] = useState(true);   // Loading state

  useEffect(() => {
    const fetchBookings = async () => {
      const email = localStorage.getItem('userEmail');  // Get email from localStorage
      if (!email) return;  // If no email is found, return early

      try {
        const response = await axios.get(`http://localhost:5000/booking-history?email=${encodeURIComponent(email)}`);
        console.log('Booking History Response:', response.data);  // Log the response to debug

        // Check if response contains bookings and set them in state
        if (response.data) {
          setBookings(response.data);  // Set bookings from the response
        }
      } catch (error) {
        console.error('Error fetching booking history:', error);
      } finally {
        setLoading(false);  // Set loading to false after data is fetched
      }
    };

    fetchBookings();  // Call fetch function on component mount
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Your Booking History</h2>
      <div className="max-w-4xl mx-auto">
        {loading ? (
          <div className="text-center py-10 bg-white rounded-lg shadow-md">
            <p className="text-gray-600 text-lg">Loading your booking history...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow-md">
            <p className="text-gray-600 text-lg">No bookings found.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {bookings.map((booking) => (
              <li key={booking.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Departure Train Information */}
                  <div className="flex items-center space-x-3">
                    <FaTrain className="text-indigo-600 text-xl" />
                    <div>
                      <p className="text-sm text-gray-500">Departure Train</p>
                      <p className="font-semibold text-gray-800">{booking.departureTrainNumber}</p>
                      <p className="text-xs text-gray-500">{booking.departureTrain?.station?.name}</p>
                    </div>
                  </div>

                  {/* Arrival Train Information */}
                  <div className="flex items-center space-x-3">
                    <FaTrain className="text-indigo-600 text-xl" />
                    <div>
                      <p className="text-sm text-gray-500">Arrival Train</p>
                      <p className="font-semibold text-gray-800">{booking.arrivalTrainNumber}</p>
                      <p className="text-xs text-gray-500">{booking.arrivalTrain?.station?.name}</p>
                    </div>
                  </div>

                  {/* Total Fare Information */}
                  <div className="flex items-center space-x-3">
                    <FaMoneyBillWave className="text-green-600 text-xl" />
                    <div>
                      <p className="text-sm text-gray-500">Total Fare</p>
                      <p className="font-semibold text-gray-800">${booking.totalFare}</p>
                    </div>
                  </div>

                  {/* User Email */}
                  <div className="flex items-center space-x-3">
                    <FaEnvelope className="text-blue-600 text-xl" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-semibold text-gray-800">{booking.userEmail || 'Email not available'}</p> {/* Display user email */}
                    </div>
                  </div>

                  {/* Booking Time */}
                  <div className="flex items-center space-x-3 col-span-full">
                    <FaClock className="text-purple-600 text-xl" />
                    <div>
                      <p className="text-sm text-gray-500">Booking Time</p>
                      <p className="font-semibold text-gray-800">{new Date(booking.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;
