import React, { useState, useEffect } from 'react';
import { FaTrain, FaClock, FaMapPin, FaLayerGroup, FaSearch, FaTimes, FaTicketAlt, FaRupeeSign, FaCalendarAlt, FaUserFriends } from 'react-icons/fa';
import axios from 'axios';
import { backEndUrl } from '../../Auth/AuthComponent/BackEndUrl';

const TrainsPage = () => {
    const [nextTrains, setNextTrains] = useState([]);
    const [stations, setStations] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [departure, setDeparture] = useState({ trainNumber: '', stationName: '', stationId: '' });
    const [arrival, setArrival] = useState({ trainNumber: '', stationName: '', stationId: '' });
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      fetchStations();
    }, []);
  
    const fetchStations = async () => {
      try {
        setIsLoading(true);
        const baseUrl = await backEndUrl();
        const response = await axios.get(`${baseUrl}/stations`);
        setStations(response.data);
      } catch (error) {
        console.error('Error fetching stations:', error);
      } finally {
        setIsLoading(false);
      }
    };

  const handleStationSelect = (station) => {
    if (modalType === 'departure') {
      if (station.station.id === arrival.stationId) {
        alert('You cannot select the same station for departure and arrival.');
        return;
      }
    } else {
      if (station.station.id === departure.stationId) {
        alert('You cannot select the same station for departure and arrival.');
        return;
      }
    }
    onTrainSelect(station, modalType);
    setIsModalOpen(false);
  };

  const fetchNextTrains = async () => {
    if (!selectedOption) {
      setShowWarningModal(true);
      return;
    }
    if (!departure.trainNumber || !arrival.trainNumber) {
      alert('Please select both departure and arrival trains.');
      return;
    }

    try {
      const baseUrl = await backEndUrl();
      const response = await axios.get(`${baseUrl}/next-trains?from=${departure.trainNumber}&to=${arrival.trainNumber}`);
      setNextTrains(response.data);
    } catch (error) {
      console.error('Error fetching next trains:', error);
    }
  };

  const filteredStations = stations.filter(station =>
    (station.trainNumber && station.trainNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (station.station && station.station.name && station.station.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <div className="min-h-screen bg-gray-100 py-4 sm:py-6 md:py-8">
        <div className="mx-auto px-3 sm:px-3 md:px-4">





          <div className="mb-4 sm:mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by train number or station name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 pl-10 sm:pl-12 pr-4 text-sm sm:text-base text-gray-700 bg-white border rounded-lg focus:border-orange-500 focus:outline-none focus:ring focus:ring-orange-200"
              />
              <FaSearch className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>









          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {filteredStations.length > 0 ? (
                filteredStations.map((station, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 sm:p-4">
                      <div className="flex items-center">
                        <FaTrain className="text-2xl sm:text-3xl text-white mr-2 sm:mr-3" />
                        <span className="text-base sm:text-lg md:text-xl font-bold text-white truncate">{station.station.name}</span>
                      </div>
                    </div>






                    <div className="p-3 sm:p-4 md:p-5 space-y-2 sm:space-y-3">
                      <div className="flex items-center text-gray-700 text-sm sm:text-base">
                        <FaTicketAlt className="mr-2 text-orange-500" />
                        <span className="font-semibold">Train Number:</span>
                        <span className="ml-2 truncate">{station.trainNumber}</span>
                      </div>
                      <div className="flex items-center text-gray-700 text-sm sm:text-base">
                        <FaTrain className="mr-2 text-orange-500" />
                        <span className="font-semibold">Train Name:</span>
                        <span className="ml-2 truncate">{station.trainName}</span>
                      </div>
                      <div className="flex items-center text-gray-700 text-sm sm:text-base">
                        <FaRupeeSign className="mr-2 text-green-500" />
                        <span className="font-semibold">Price:</span>
                        <span className="ml-2">₹{station.finalPrice}</span>
                      </div>
                      <div className="flex items-center text-gray-700 text-sm sm:text-base">
                        <FaClock className="mr-2 text-blue-500" />
                        <span className="font-semibold">Arrival:</span>
                        <span className="ml-2">{new Date(station.arrivalTime).toLocaleTimeString()}</span>
                      </div>
                      <div className="flex items-center text-gray-700 text-sm sm:text-base">
                        <FaCalendarAlt className="mr-2 text-purple-500" />
                        <span className="font-semibold">Date:</span>
                        <span className="ml-2">{new Date(station.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-gray-700 text-sm sm:text-base">
                        <FaUserFriends className="mr-2 text-indigo-500" />
                        <span className="font-semibold">Count:</span>
                        <span className="ml-2">{station.count}</span>
                      </div>
                      <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
                        {[station.coachGroup1, station.coachGroup2, station.coachGroup3, station.coachGroup4].map((group, idx) => (
                          group && <span key={idx} className="px-2 sm:px-3 py-0.5 sm:py-1 bg-orange-100 text-orange-600 rounded-full text-xs sm:text-sm font-medium">{group}</span>
                        ))}
                      </div>
                    </div>






























                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 sm:py-10 bg-white rounded-lg shadow">
                  <FaTrain className="text-4xl sm:text-5xl text-gray-300 mx-auto mb-3 sm:mb-4" />
                  <p className="text-gray-500 text-lg sm:text-xl">No stations available</p>
                </div>








              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TrainsPage;