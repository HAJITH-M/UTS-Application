import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registering chart components (required by Chart.js)
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StationCrowdPrediction = () => {
  const [stations, setStations] = useState([]); // Store station list
  const [filteredStations, setFilteredStations] = useState([]); // Store filtered station list based on search
  const [selectedStation, setSelectedStation] = useState(''); // Store selected station
  const [trainNumbers, setTrainNumbers] = useState([]); // Store train numbers for the selected station
  const [crowdData, setCrowdData] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // Track search term
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false); // Track suggestion visibility

  // Fetch stations and their train numbers when component mounts
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/stations');
        if (!response.ok) {
          throw new Error('Failed to fetch stations');
        }
        const data = await response.json();
        setStations(data);
        setFilteredStations(data); // Initially, no filter
      } catch (error) {
        setError('Failed to fetch stations');
        console.error(error);
      }
    };

    fetchStations();
  }, []);

  // Handle station selection and update train numbers
  const handleStationChange = (event) => {
    const stationName = event.target.value;
    setSelectedStation(stationName);

    const selectedStationData = stations.find(station => station.name === stationName);
    setTrainNumbers(selectedStationData ? selectedStationData.trains : []);
  };

  // Handle the search input change
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value) {
      // Filter stations based on search term (case-insensitive)
      const filtered = stations.filter(station =>
        station.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredStations(filtered);
      setIsSuggestionsVisible(true); // Show suggestions
    } else {
      setFilteredStations(stations); // If search is cleared, show all stations
      setIsSuggestionsVisible(false); // Hide suggestions
    }
  };

  // Handle selection of a station from the suggestion list
  const handleStationSelect = (stationName) => {
    setSelectedStation(stationName);
    setSearchTerm(stationName); // Set the input to the selected station
    setIsSuggestionsVisible(false); // Hide suggestions once a station is selected

    const selectedStationData = stations.find(station => station.name === stationName);
    setTrainNumbers(selectedStationData ? selectedStationData.trains : []);
  };

  const handleFetchCrowdPrediction = async () => {
    if (!selectedStation) {
      setError('Please select a station');
      return;
    }

    // Normalize station name (Title Case)
    const formattedStationName = formatStationName(selectedStation);

    try {
      const controller = new AbortController();
      const signal = controller.signal;

      const response = await fetch(`http://localhost:5000/crowd-prediction?stationName=${formattedStationName}`, {
        signal: signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCrowdData(data);
      setError('');

      return () => controller.abort();
    } catch (error) {
      if (error.name === 'AbortError') {
        setError('Request was cancelled');
      } else {
        setError('Failed to fetch crowd prediction');
      }
    }
  };

  // Function to format station name to Title Case
  const formatStationName = (name) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Prepare chart data
  const getChartData = () => {
    const trainNumbersList = crowdData.map(train => train.trainNumber);
    const crowdPercentages = crowdData.map(train => train.crowdPercentage);

    return {
      labels: trainNumbersList,
      datasets: [
        {
          label: 'Crowd Percentage',
          data: crowdPercentages,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div>
      <h1>Station Crowd Prediction</h1>

      {/* Search input for manual station search */}
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search for a station"
        style={{ marginBottom: '10px' }}
      />

      {/* Suggestions dropdown */}
      {isSuggestionsVisible && filteredStations.length > 0 && (
        <ul style={{ border: '1px solid #ccc', maxHeight: '200px', overflowY: 'auto', padding: '0', margin: '0' }}>
          {filteredStations.map((station) => (
            <li
              key={station.id || station.name}
              style={{ padding: '10px', cursor: 'pointer' }}
              onClick={() => handleStationSelect(station.name)} // Select station from suggestion
            >
              {station.name}
            </li>
          ))}
        </ul>
      )}

      {/* Dropdown to select station (fallback if no suggestions) */}
      {!isSuggestionsVisible && (
        <select value={selectedStation} onChange={handleStationChange}>
          <option value="">Select a Station</option>
          {stations.map((station) => (
            <option key={station.id || station.name} value={station.name}>
              {station.name}
            </option>
          ))}
        </select>
      )}

      {/* Display train numbers for the selected station */}
      {selectedStation && trainNumbers.length > 0 && (
        <div>
          <h2>Trains from {selectedStation}</h2>
          <ul>
            {trainNumbers.map((trainNumber, index) => (
              <li key={trainNumber || index}>{trainNumber}</li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={handleFetchCrowdPrediction}>Get Prediction</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display graph with predictions if data exists */}
      {crowdData.length > 0 && (
        <div>
          <h2>Train Crowd Levels for Station: {selectedStation}</h2>
          <Bar
            data={getChartData()}
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: 'Crowd Percentage per Train',
                },
                tooltip: {
                  callbacks: {
                    label: (context) => `${context.raw}%`,
                  },
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Train Number',
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Crowd Percentage',
                  },
                  min: 0,
                  max: 100,
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default StationCrowdPrediction;
