import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { FaSearch, FaTrain, FaChartBar } from 'react-icons/fa';
import { IoMdWarning } from 'react-icons/io';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StationCrowdPrediction = () => {
  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState('');
  const [trainNumbers, setTrainNumbers] = useState([]);
  const [crowdData, setCrowdData] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/stations');
        if (!response.ok) throw new Error('Failed to fetch stations');
        const data = await response.json();
        setStations(data);
        setFilteredStations(data);
      } catch (error) {
        setError('Failed to fetch stations');
        console.error(error);
      }
    };

    fetchStations();
  }, []);

  const handleStationChange = (event) => {
    const stationName = event.target.value;
    setSelectedStation(stationName);
    setSearchTerm(stationName);
    const selectedStationData = stations.find(station => station.name === stationName);
    setTrainNumbers(selectedStationData ? selectedStationData.trains : []);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setSelectedStation(value);
    if (value) {
      const filtered = stations.filter(station =>
        station.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredStations(filtered);
      setIsSuggestionsVisible(true);
    } else {
      setFilteredStations(stations);
      setIsSuggestionsVisible(false);
    }
  };

  const handleStationSelect = (stationName) => {
    setSelectedStation(stationName);
    setSearchTerm(stationName);
    setIsSuggestionsVisible(false);
    const selectedStationData = stations.find(station => station.name === stationName);
    setTrainNumbers(selectedStationData ? selectedStationData.trains : []);
  };

  const handleFetchCrowdPrediction = async () => {
    if (!selectedStation) {
      setError('Please select a station');
      return;
    }

    const formattedStationName = formatStationName(selectedStation);

    try {
      const controller = new AbortController();
      const signal = controller.signal;

      const response = await fetch(`http://localhost:5000/crowd-prediction?stationName=${formattedStationName}`, {
        signal: signal,
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setCrowdData(data);
      setError('');

      return () => controller.abort();
    } catch (error) {
      setError(error.name === 'AbortError' ? 'Request was cancelled' : 'Failed to fetch crowd prediction');
    }
  };

  const formatStationName = (name) => {
    return name.split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  const groupDataByDate = (data) => {
    return data.reduce((acc, { date, crowdPercentage }) => {
      if (!acc[date]) acc[date] = [];
      acc[date].push(crowdPercentage);
      return acc;
    }, {});
  };


  const calculateAverageCrowdPercentage = () => {

    if (crowdData.length === 0) return null;
    const total = crowdData.reduce((sum, { crowdPercentage }) => sum + crowdPercentage, 0);
    const average = total / crowdData.length;

    return average.toFixed(2);
  };

  const getChartData = () => {
    const groupedData = groupDataByDate(crowdData);

    const dates = Object.keys(groupedData);
    const crowdPercentages = dates.map(date => {
      const totalCrowdPercentage = groupedData[date].reduce((sum, percentage) => sum + percentage, 0);
      return totalCrowdPercentage / groupedData[date].length;
    });

    return {
      labels: dates,
      datasets: [{
        label: 'Average Crowd Percentage',
        data: crowdPercentages,


        backgroundColor: 'rgba(255, 140, 0, 0.5)',
        borderColor: 'rgba(255, 69, 0, 1)',
        borderWidth: 2,
        borderRadius: 8,

        hoverBackgroundColor: 'rgba(255, 140, 0, 0.7)',
      }],
    };
  };

  return (


    <div className="min-h-screen bg-orange-50 p-8">
      <h1 className="text-4xl font-bold text-red-800 mb-8 text-center">Station Crowd Prediction</h1>

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">

            <FaSearch className="text-orange-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search for a station"

            className="pl-10 w-full py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
          {isSuggestionsVisible && filteredStations.length > 0 && (

            <ul className="absolute z-10 w-full mt-1 bg-white border border-orange-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredStations.map((station) => (
                <li
                  key={station.id || station.name}

                  className="px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors"
                  onClick={() => handleStationSelect(station.name)}
                >
                  {station.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <select
          value={selectedStation}
          onChange={handleStationChange}

          className="w-full mb-6 py-3 px-4 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        >
          <option value="">Select a Station</option>
          {stations.map((station) => (
            <option key={station.id || station.name} value={station.name}>
              {station.name}
            </option>
          ))}
        </select>

        {selectedStation && trainNumbers.length > 0 && (

          <div className="mb-6 p-4 bg-orange-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">

              <FaTrain className="text-red-600" />
              Trains from {selectedStation}
            </h2>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {trainNumbers.map((trainNumber, index) => (
                <li key={trainNumber || index} className="bg-white p-2 rounded-md shadow-sm">
                  {trainNumber}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={handleFetchCrowdPrediction}

          className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
        >
          <FaChartBar />
          Get Prediction
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
            <IoMdWarning className="text-xl" />
            {error}
          </div>
        )}


        {crowdData.length > 0 ? (

          <div className="mt-4 text-center text-lg font-semibold text-red-600">
            <p>Average Crowd Percentage: {calculateAverageCrowdPercentage()}%</p>
          </div>
        ) : (
          <div className="mt-4 text-center text-lg font-semibold text-gray-600">
            <p>No crowd data available till now</p>
          </div>
        )}

        {crowdData.length > 0 && (
          <div className="mt-8">

            <h2 className="text-2xl font-semibold mb-4 text-center text-red-800">
              Average Crowd Levels for {selectedStation}
            </h2>
            <div className="p-4 bg-white rounded-lg shadow">
              <Bar
                data={getChartData()}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: {
                        font: {
                          size: 14,
                          weight: 'bold'
                        }
                      }
                    },
                    title: {
                      display: true,
                      text: 'Average Crowd Percentage per Day',
                      font: {
                        size: 16,
                        weight: 'bold'
                      }
                    },
                    tooltip: {
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      padding: 12,
                      titleFont: {
                        size: 14,
                        weight: 'bold'
                      },
                      bodyFont: {
                        size: 13
                      },
                      callbacks: {
                        label: (context) => `${context.raw.toFixed(1)}%`,
                      },
                    },
                  },
                  scales: {
                    x: {
                      grid: {
                        display: false
                      },
                      title: {
                        display: true,
                        text: 'Date',
                        font: {
                          size: 14,
                          weight: 'bold'
                        }
                      }
                    },
                    y: {
                      grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                      },
                      title: {
                        display: true,
                        text: 'Crowd Percentage',
                        font: {
                          size: 14,
                          weight: 'bold'
                        }
                      },
                      min: 0,
                      max: 100,
                      ticks: {
                        callback: function(value) {
                          return value + '%';
                        }
                      }
                    }
                  }
                }}
                height={300}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default StationCrowdPrediction;