import React, { useState, useEffect } from 'react';
import { FaTicketAlt, FaHistory, FaEye, FaWallet, FaUser, FaExchangeAlt } from 'react-icons/fa';

const Tracking = () => {
  const [activeButton, setActiveButton] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [userEmail, setUserEmail] = useState(null); // State for user email

  useEffect(() => {
    // Retrieve email from local storage on component mount
    const email = localStorage.getItem('userEmail'); // Adjust the key as necessary
    setUserEmail(email);
  }, []);

  const fetchBookingHistory = async () => {
    if (!userEmail) {
      console.error('No user email found');
      return; // Exit if user email is not set
    }

    const url = `http://localhost:5000/booking-history?email=${encodeURIComponent(userEmail)}`;
    console.log('Fetching booking history from:', url); // Log the URL

    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json(); // Capture error response
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error}`);
      }
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching booking history:', error);
    }
  };

  const handleButtonClick = (buttonType) => {
    setActiveButton(buttonType);
    if (buttonType === 'Booking History') {
      fetchBookingHistory();
    }
  };

  return (
    <div className="bg-gray-100 p-2 pb-5">
      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
          <Button icon={<FaTicketAlt />} text="Cancel Ticket" isActive={activeButton === 'Cancel Ticket'} onClick={() => handleButtonClick('Cancel Ticket')} />
          <Button icon={<FaHistory />} text="Booking History" isActive={activeButton === 'Booking History'} onClick={() => handleButtonClick('Booking History')} />
          <Button icon={<FaEye />} text="Show Ticket" isActive={activeButton === 'Show Ticket'} onClick={() => handleButtonClick('Show Ticket')} />
          <Button icon={<FaWallet />} text="R-Wallet" isActive={activeButton === 'R-Wallet'} onClick={() => handleButtonClick('R-Wallet')} />
          <Button icon={<FaUser />} text="Profile" isActive={activeButton === 'Profile'} onClick={() => handleButtonClick('Profile')} />
          <Button icon={<FaExchangeAlt />} text="Transactions" isActive={activeButton === 'Transactions'} onClick={() => handleButtonClick('Transactions')} />
        </div>

        {activeButton === 'Booking History' && (
          <div className="mt-4">
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
        )}
      </div>
    </div>
  );
};

const Button = ({ icon, text, isActive, onClick }) => {
  return (
    <button
      className={`flex flex-col items-center justify-center p-2 rounded-md shadow-sm transition-all duration-200 ${
        isActive
          ? 'bg-blue-500 text-white'
          : 'bg-white text-gray-700 hover:shadow-md'
      }`}
      onClick={onClick}
    >
      <div className={`text-2xl mb-1 ${isActive ? 'text-white' : 'text-gray-500'}`}>{icon}</div>
      <span className={`text-xs font-medium ${isActive ? 'text-white' : 'text-gray-700'}`}>{text}</span>
    </button>
  );
};

export default Tracking;
