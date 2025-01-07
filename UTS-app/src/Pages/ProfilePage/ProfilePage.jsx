  import React, { useState, useEffect } from 'react';
  import axios from 'axios';
  import { FaUser, FaHistory, FaTrain, FaMapMarkerAlt, FaRupeeSign, FaCalendarAlt } from 'react-icons/fa';
  import { MdEmail } from 'react-icons/md';
import { backEndUrl } from '../../Auth/AuthComponent/BackEndUrl';

  const ProfilePage = () => {
    const [bookingHistory, setBookingHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const email = localStorage.getItem('userEmail');

    useEffect(() => {
      const fetchBookingHistory = async () => {
        try {
            const BackEndUrl = await backEndUrl()
          if (email) {
            const response = await axios.get(`${BackEndUrl}/booking-history?email=${email}`);
            setBookingHistory(response.data);
            console.log('Booking history:', response.data);
          }
        } catch (err) {
          setError('Failed to fetch booking history');
          console.error('Error fetching booking history:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchBookingHistory();
    }, [email]);

    if (loading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex justify-center items-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-8 border border-purple-200">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
              <p className="text-lg font-semibold text-indigo-600">Loading...</p>
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return <div className="flex justify-center items-center min-h-screen text-red-600">{error}</div>;
    }

    return (

      <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">

          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-6 mb-8 border border-purple-200">
            <div className="flex items-center mb-6">


              <FaUser className="text-4xl text-indigo-600 mr-4" />
              <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Profile</h1>
            </div>
            <div className="flex items-center text-gray-700 mb-4">

              <MdEmail className="mr-2 text-indigo-600" />
              <p><span className="font-semibold">Email:</span> {email}</p>
            </div>
          </div>


          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-6 border border-purple-200">
            <div className="flex items-center mb-6">


              <FaHistory className="text-3xl text-indigo-600 mr-4" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Booking History <span className="text-lg ml-2">({bookingHistory.length} bookings)</span>
              </h2>
            </div>
            {bookingHistory.length === 0 ? (
              <p className="text-gray-600 text-center py-4">No booking history found</p>
            ) : (
              <div className="space-y-6">
                {bookingHistory.map((booking) => (

                  <div key={booking.id} className="border border-purple-200 rounded-lg p-6 hover:shadow-xl transition-shadow bg-gradient-to-r from-white to-indigo-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center">


                        <FaTrain className="text-indigo-600 mr-2" />
                        <h3 className="font-semibold text-indigo-800">Booking ID: {booking.id}</h3>
                      </div>
                      <div className="flex items-center">


                        <FaMapMarkerAlt className="text-indigo-600 mr-2" />
                        <p><span className="font-semibold text-purple-700">From:</span> {booking.departureTrain?.station?.name}</p>
                      </div>
                      <div className="flex items-center">


                        <FaMapMarkerAlt className="text-indigo-600 mr-2" />
                        <p><span className="font-semibold text-purple-700">To:</span> {booking.arrivalTrain?.station?.name}</p>
                      </div>
                      <div className="flex items-center">


                        <FaTrain className="text-indigo-600 mr-2" />
                        <p><span className="font-semibold text-purple-700">Departure Train:</span> {booking.departureTrainNumber}</p>
                      </div>
                      <div className="flex items-center">


                        <FaTrain className="text-indigo-600 mr-2" />
                        <p><span className="font-semibold text-purple-700">Arrival Train:</span> {booking.arrivalTrainNumber}</p>
                      </div>
                      <div className="flex items-center">


                        <FaRupeeSign className="text-indigo-600 mr-2" />
                        <p><span className="font-semibold text-purple-700">Total Fare:</span> ₹{booking.totalFare}</p>
                      </div>
                      <div className="flex items-center">


                        <FaCalendarAlt className="text-indigo-600 mr-2" />
                        <p><span className="font-semibold text-purple-700">Booking Date:</span> {new Date(booking.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  export default ProfilePage;