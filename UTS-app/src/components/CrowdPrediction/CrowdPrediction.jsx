import React, { useState } from 'react';

const StationCrowdPrediction = () => {
  const [stationName, setStationName] = useState('');
  const [crowdData, setCrowdData] = useState([]);
  const [error, setError] = useState('');

  const handleFetchCrowdPrediction = async () => {
    if (!stationName) {
      setError('Please provide a station name');
      return;
    }

    // Normalize station name (Title Case)
    const formattedStationName = formatStationName(stationName);

    try {
      const controller = new AbortController();
      const signal = controller.signal;
      
      const response = await fetch(`http://localhost:5000/crowd-prediction?stationName=${formattedStationName}`, {
        signal: signal,
        headers: {
          'Content-Type': 'application/json'
        }
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
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div>
      <h1>Station Crowd Prediction</h1>
      <input
        type="text"
        value={stationName}
        onChange={(e) => setStationName(e.target.value)}
        placeholder="Enter Station Name"
      />
      <button onClick={handleFetchCrowdPrediction}>Get Prediction</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {crowdData.length > 0 && (
        <div>
          <h2>Train Crowd Levels for Station: {stationName}</h2>
          <ul>
            {crowdData.map((train, index) => (
              <li key={index}>
                <p>Train Number: {train.trainNumber}</p>
                <p>Crowd Level: {train.crowdLevel}</p>
                <p>Crowd Percentage: {train.crowdPercentage}%</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StationCrowdPrediction;
