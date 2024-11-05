import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function TrainCrowdPrediction() {
  const [crowdLevel, setCrowdLevel] = useState('');
  const [crowdPercentage, setCrowdPercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get the trainId from URL search params
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const trainId = queryParams.get('trainId'); // Get the trainId from query string

  useEffect(() => {
    async function fetchCrowdPrediction() {
      setLoading(true);
      setError(null);
      if (!trainId) {
        setError('Train ID is required.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/crowd-prediction?trainId=${trainId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'An error occurred while fetching the crowd prediction');
        }

        const data = await response.json();
        setCrowdLevel(data.crowdLevel);
        setCrowdPercentage(data.crowdPercentage);
      } catch (err) {
        console.error('Error fetching crowd prediction:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCrowdPrediction();
  }, [trainId]);

  return (
    <div>
      {loading ? (
        <p>Loading crowd prediction...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>Error: {error}</p>
      ) : (
        <div>
          <h3>Crowd Prediction</h3>
          <p>{`Crowd level: ${crowdLevel}`}</p>
          <p>{`Crowd percentage: ${crowdPercentage}%`}</p>
          <progress value={crowdPercentage} max="100"></progress>
        </div>
      )}
    </div>
  );
}

export default TrainCrowdPrediction;
