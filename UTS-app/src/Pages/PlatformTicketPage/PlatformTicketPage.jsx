  import React, { useState } from 'react';
  import { FaUser, FaCalendarAlt, FaIdCard, FaPhone, FaMapMarkerAlt, FaCreditCard, FaMoneyBill } from 'react-icons/fa';

  const PlatformTicketPage = () => {
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [errors, setErrors] = useState({});

    const platformTicketData = {
      stations: [
        {
          id: 1,
          name: "Central Station",
          price: 10,
          validityHours: 2
        },
        {
          id: 2,
          name: "Parramatta Station",
          price: 10,
          validityHours: 2
        },
        {
          id: 3,
          name: "Strathfield Station",
          price: 10,
          validityHours: 2
        }
      ]
    };

    const handleBooking = (ticket) => {
      setSelectedTicket(ticket);
      setShowBookingModal(true);
    };

    const handleConfirmBooking = () => {
      setShowBookingModal(false);
      setShowPaymentModal(true);
    };

    const validateCardDetails = () => {
      const newErrors = {};
      if (!cardDetails.number.trim()) {
        newErrors.number = 'Please enter card number';
      }
      if (!cardDetails.expiry.trim()) {
        newErrors.expiry = 'Please enter expiry date';
      }
      if (!cardDetails.cvv.trim()) {
        newErrors.cvv = 'Please enter CVV';
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handlePayment = async () => {
      if (paymentMethod === 'card') {
        if (!validateCardDetails()) {
          return;
        }
      }
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsLoading(false);
      setIsSuccess(true);
      setShowReceipt(true);
      setTimeout(() => {
        setShowPaymentModal(false);
        setIsSuccess(false);
        setPaymentMethod(null);
        setCardDetails({ number: '', expiry: '', cvv: '' });
        setErrors({});
        setShowReceipt(false);
      }, 5000);
    };

    const renderReceipt = () => {
      const currentDate = new Date().toLocaleString();
      const validUntil = new Date(Date.now() + selectedTicket.validityHours * 60 * 60 * 1000).toLocaleString();

      if (paymentMethod === 'card') {
        return (
          <div className="border-2 p-4 mt-4 rounded-lg">
            <h3 className="text-lg font-bold mb-2">Platform Ticket Receipt</h3>
            <p>Date: {currentDate}</p>
            <p>Station: {selectedTicket.name}</p>
            <p>Valid Until: {validUntil}</p>
            <p>Amount Paid: ₹{selectedTicket.price}</p>
            <p>Payment Method: Credit/Debit Card</p>
            <p>Card Number: ****{cardDetails.number.slice(-4)}</p>
            <p className="mt-2 text-green-600">Transaction Successful</p>
          </div>
        );
      } else {
        return (
          <div className="border-2 p-4 mt-4 rounded-lg">
            <h3 className="text-lg font-bold mb-2">Payment Instructions</h3>
            <p>Date: {currentDate}</p>
            <p>Station: {selectedTicket.name}</p>
            <p>Valid Until: {validUntil}</p>
            <p>Amount to Pay: ₹{selectedTicket.price}</p>
            <p>Payment Method: Cash</p>
            <p className="mt-2 text-red-600 font-bold">Please pay at the counter</p>
          </div>
        );
      }
    };

    return (
      <div className="min-h-screen bg-orange-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-orange-800 mb-8">Platform Ticket Booking</h1>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-orange-700 flex items-center">
              <FaMapMarkerAlt className="mr-2" />
              Available Stations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {platformTicketData.stations.map((station) => (
                <div key={station.id} className="bg-orange-50 p-4 rounded-md">
                  <h3 className="font-medium text-lg mb-2">{station.name}</h3>
                  <p className="text-orange-600 font-bold mb-2">₹{station.price}</p>
                  <p className="text-sm text-gray-600 mb-4">Valid for {station.validityHours} hours</p>
                  <button
                    onClick={() => handleBooking(station)}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-400 text-white py-2 rounded-md hover:from-orange-600 hover:to-red-500 transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-orange-700">Important Instructions</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Platform tickets are valid only for the selected station.</li>
              <li>Each ticket is valid for {platformTicketData.stations[0].validityHours} hours from the time of purchase.</li>
              <li>Please carry a valid ID proof while traveling.</li>
              <li>For card payments, ensure you have sufficient balance.</li>
              <li>For cash payments, exact change is preferred.</li>
              <li>Keep the receipt safe until your platform visit is complete.</li>
              <li>Platform tickets are non-refundable and non-transferable.</li>
              <li>Follow all station safety guidelines and protocols.</li>
            </ul>
          </div>
        </div>

        {showBookingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-semibold mb-4">Confirm Platform Ticket</h2>
              <p className="mb-4">Are you sure you want to book a platform ticket for {selectedTicket.name}?</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmBooking}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-400 text-white rounded-md hover:from-orange-600 hover:to-red-500"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-semibold mb-4">Select Payment Method</h2>
              {!paymentMethod ? (
                <div className="space-y-4">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className="w-full flex items-center justify-center gap-2 p-3 border rounded-md hover:bg-orange-50"
                  >
                    <FaCreditCard /> Credit/Debit Card
                  </button>
                  <button
                    onClick={() => setPaymentMethod('cash')}
                    className="w-full flex items-center justify-center gap-2 p-3 border rounded-md hover:bg-orange-50"
                  >
                    <FaMoneyBill /> Cash
                  </button>
                </div>
              ) : paymentMethod === 'card' ? (
                <div className="space-y-4">
                  <button
                    onClick={() => setPaymentMethod(null)}
                    className="text-orange-600 hover:text-orange-800 mb-4"
                  >
                    Change Payment Method
                  </button>
                  <div>
                    <input
                      type="text"
                      placeholder="Card Number"
                      className={`w-full p-2 border rounded-md ${errors.number ? 'border-red-500' : ''}`}
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                    />
                    {errors.number && <p className="text-red-500 text-sm mt-1">{errors.number}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className={`p-2 border rounded-md w-full ${errors.expiry ? 'border-red-500' : ''}`}
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                      />
                      {errors.expiry && <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>}
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="CVV"
                        className={`p-2 border rounded-md w-full ${errors.cvv ? 'border-red-500' : ''}`}
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                      />
                      {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => setPaymentMethod(null)}
                    className="text-orange-600 hover:text-orange-800 mb-4"
                  >
                    Change Payment Method
                  </button>
                  <p className="text-center mb-4">Please pay at the counter</p>
                </div>
              )}

              {isLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                  <p className="mt-2">Processing payment...</p>
                </div>
              ) : isSuccess ? (
                <div className="text-center text-green-600 py-4">
                  <p className="font-semibold">Platform Ticket Booked Successfully!</p>
                  {showReceipt && renderReceipt()}
                </div>
              ) : (
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePayment}
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-400 text-white rounded-md hover:from-orange-600 hover:to-red-500"
                  >
                    Pay Now
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  export default PlatformTicketPage;
