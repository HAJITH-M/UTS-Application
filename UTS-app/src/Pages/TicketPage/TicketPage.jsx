  import React, { useEffect, useState } from 'react';
  import { FaTicketAlt, FaCalendarAlt, FaMapMarkerAlt, FaClock, FaUser, FaTrain, FaMoneyBillWave, FaEnvelope } from 'react-icons/fa';
  import axios from 'axios';
  import { backEndUrl } from '../../Auth/AuthComponent/BackEndUrl';

  const TicketPage = () => {
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      let isMounted = true;
      const fetchTicketDetails = async () => {
        const email = localStorage.getItem('userEmail');
        if (!email) {
          if (isMounted) setLoading(false);
          return;
        }

        try {
          const baseUrl = await backEndUrl();
          const response = await axios.get(`${baseUrl}/booking-history?email=${encodeURIComponent(email)}`);
          if (response.data && response.data.length > 0 && isMounted) {
            setTicket(response.data[response.data.length - 1]); // Get the last booking
          }
        } catch (error) {
          console.error('Error fetching ticket details:', error);
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };

      fetchTicketDetails();

      return () => {
        isMounted = false;
      };
    }, []);

    const handleDownload = () => {
      // Implementation for ticket download functionality
      window.print();
    };

    if (loading) {
      return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
          <div className="text-center">Loading ticket details...</div>
        </div>
      );
    }

    if (!ticket) {
      return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
          <div className="text-center">No ticket found.</div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 p-6 text-white">
            <div className="flex items-center gap-3">
              <FaTicketAlt className="text-2xl" />
              <h1 className="text-2xl font-bold">Train Ticket</h1>
            </div>
          </div>
        
          <div className="p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <FaTrain className="text-gray-500 text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Departure Train</p>
                  <p className="font-semibold">{ticket.departureTrainNumber}</p>
                  <p className="text-sm text-gray-500">{ticket.departureTrain?.station?.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <FaTrain className="text-gray-500 text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Arrival Train</p>
                  <p className="font-semibold">{ticket.arrivalTrainNumber}</p>
                  <p className="text-sm text-gray-500">{ticket.arrivalTrain?.station?.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <FaClock className="text-gray-500 text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Booking Time</p>
                  <p className="font-semibold">
                    {new Date(ticket.createdAt).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <FaEnvelope className="text-gray-500 text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold">{ticket.userEmail || 'Email not available'}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Ticket Type</p>
                  <p className="font-semibold">Train Ticket</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Fare</p>
                  <p className="font-semibold text-blue-600">${ticket.totalFare}</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button 
                onClick={handleDownload}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Download Ticket
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default TicketPage;