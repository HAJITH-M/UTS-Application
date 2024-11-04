// BookingHistory.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import { FaTrain, FaMoneyBillWave, FaEnvelope, FaClock } from 'react-icons/fa';

const BookingHistory = () => {
  const location = useLocation();
  const bookings = location.state?.bookings || []; // Get bookings from state

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Your Booking History</h2>
      <div className="max-w-4xl mx-auto">
        {bookings.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow-md">
            <p className="text-gray-600 text-lg">No bookings found.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {bookings.map((booking) => (
              <li key={booking.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <FaTrain className="text-indigo-600 text-xl" />
                    <div>
                      <p className="text-sm text-gray-500">Departure Train</p>
                      <p className="font-semibold text-gray-800">{booking.departureTrainNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaTrain className="text-indigo-600 text-xl" />
                    <div>
                      <p className="text-sm text-gray-500">Arrival Train</p>
                      <p className="font-semibold text-gray-800">{booking.arrivalTrainNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaMoneyBillWave className="text-green-600 text-xl" />
                    <div>
                      <p className="text-sm text-gray-500">Total Fare</p>
                      <p className="font-semibold text-gray-800">${booking.totalFare}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaEnvelope className="text-blue-600 text-xl" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-semibold text-gray-800">{booking.email}</p>
                    </div>
                  </div>
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
