    import React, { useState } from 'react';
    import { FaMapMarkerAlt, FaExchangeAlt, FaTrain, FaTicketAlt, FaPrint, FaMobileAlt, FaBan } from 'react-icons/fa';
    import { MdGpsFixed } from 'react-icons/md';

    const NormalBooking = () => {
      const [selectedOption, setSelectedOption] = useState(null);
      const [departureStation, setDepartureStation] = useState('STN');
      const [arrivalStation, setArrivalStation] = useState('STN');
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [modalType, setModalType] = useState(''); 
      const [searchTerm, setSearchTerm] = useState('');

      const stations = {
        "STN": "London Stansted",
        "MAN": "Manchester",
        "BHX": "Birmingham",
        "EDI": "Edinburgh",
        "GLA": "Glasgow", 
        "LPL": "Liverpool"
      };

      const handleStationSearch = (type) => {
        setModalType(type);
        setIsModalOpen(true);
        setSearchTerm('');
      };

      const handleStationSelect = (station) => {
        if (modalType === 'departure') {
          setDepartureStation(station);
        } else {
          setArrivalStation(station);
        }
        setIsModalOpen(false);
      };

      const filteredStations = Object.entries(stations).filter(([code, name]) =>
        code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      return (
        <>
          <h1 className=" mx-2 text-xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-red-500 text-white p-2 rounded">NORMAL BOOKING</h1>

          <div className=" mx-auto mb-10">
            <div className="flex gap-4 mb-4 justify-center">
              <label className="flex items-center text-xs md:text-lg font-semibold">
                <input
                  type="radio"
                  name="bookingOption"
                  value="paperless"
                  checked={selectedOption === 'paperless'}
                  onChange={() => setSelectedOption('paperless')}
                  className="mr-2"
                />
                <FaMobileAlt className="mr-1" />
                Book & Travel (Paperless)
              </label>
              <label className="flex items-center text-xs md:text-lg font-medium">
                <input
                  type="radio"
                  name="bookingOption"
                  value="paper"
                  checked={selectedOption === 'paper'}
                  onChange={() => setSelectedOption('paper')}
                  className="mr-2"
                />
                <FaPrint className="mr-1" />
                Book & Print (Paper)
              </label>
            </div>

            {selectedOption === 'paperless' && (
              <div className="  p-4 rounded-lg text-black">
                <h3 className="text-base font-bold mb-2">Paperless Ticket Information:</h3>
                <ul className="list-disc list-inside mb-4 text-sm">
                  <li>Use this option if you are outside station premises/Railway track.</li>
                  <li>Use show ticket option on mobile is the travel authority.</li>
                  <li>Set your phone GPS to high accuracy mode.</li>
                  <li>No cancellation is allowed for paperless ticket.</li>
                </ul>

                <h3 className="text-base font-bold text-red-500 mb-2">Important Information:</h3>
                <ul className="list-disc list-inside text-sm">
                  <li className="flex items-center"><MdGpsFixed className="mr-2" /> Set your phone GPS to high accuracy mode</li>
                  <li className="flex items-center"><FaBan className="mr-2" /> No cancellation allowed for paperless tickets</li>
                </ul>
              </div>
            )}
            {selectedOption === 'paper' && (
              <div className=" p-4 rounded-lg text-black">
                <h3 className="text-base font-bold mb-2">Paper Ticket Information:</h3>
                <ul className="list-disc list-inside mb-4 text-sm">
                  <li>Use this option if you prefer a physical ticket.</li>
                  <li>You need to print the ticket before boarding.</li>
                  <li>Cancellation is allowed as per railway rules.</li>
                </ul>
              </div>
            )}
            <div className="mt-6 flex space-x-4">
              <div className="flex-1">
                <div className="flex flex-col mb-4 justify-center items-center">
                  <div className="text-sm text-gray-600 mb-1">Depart from</div>
                  <div className="flex items-center justify-center">
                    <FaMapMarkerAlt className="mr-2 text-orange-500" />
                    <div className="flex-grow">
                      <div className="text-lg font-semibold cursor-pointer" onClick={() => handleStationSearch('departure')}>{departureStation}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">{stations[departureStation]}</div>
                </div>


                
              </div>

              <div className="flex-1">
                <div className="flex flex-col mb-4 justify-center items-center">
                  <div className="text-sm text-gray-600 mb-1">Going to</div>
                  <div className="flex items-center justify-center">
                    <FaMapMarkerAlt className="mr-2 text-orange-500" />
                    <div className="flex-grow">
                      <div className="text-lg font-semibold cursor-pointer" onClick={() => handleStationSearch('arrival')}>{arrivalStation}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">{stations[arrivalStation]}</div>
                </div>


                
              </div>
            </div>


            <div className='flex gap-4 px-2'>
            <button className="bg-orange-500 text-white px-4 py-2 rounded flex items-center justify-center w-full">
                  <FaTrain className="mr-1" /> NEXT TRAINS
                </button>


                <button className="bg-red-500 text-white px-4 py-2 rounded flex justify-center items-center w-full">
                  <FaTicketAlt className="mr-1" /> GET FARE
                </button>
            </div>



            {/* <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Important Information:</h3>
              <ul className="list-disc list-inside">
                <li className="flex items-center"><MdGpsFixed className="mr-2" /> Set your phone GPS to high accuracy mode</li>
                <li className="flex items-center"><FaBan className="mr-2" /> No cancellation allowed for paperless tickets</li>
              </ul>
            </div> */}
          </div>

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-4 rounded-lg">
                <h2 className="text-lg font-bold mb-4">Select a Station</h2>
                <input
                  type="text"
                  placeholder="Search stations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 mb-4 border border-gray-300 rounded"
                />
                <ul>
                  {filteredStations.map(([code, name]) => (
                    <li
                      key={code}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleStationSelect(code)}
                    >
                      {code} - {name}
                    </li>
                  ))}
                </ul>
                <button
                  className="mt-4 bg-gray-300 text-black px-4 py-2 rounded"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </>
      );
    };

    export default NormalBooking;