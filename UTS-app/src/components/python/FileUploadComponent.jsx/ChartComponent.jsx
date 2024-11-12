

// src/components/ChartComponent.jsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartComponent = ({ crowdIntensityData, chartData }) => {
  return (
    <>
      {crowdIntensityData && (
        <div className="mb-6" style={{ height: '400px' }}>
          <h3 className="text-xl font-semibold mb-4">Crowd Intensity Distribution</h3>
          <Bar 
            data={crowdIntensityData} 
            options={{ 
              responsive: true, 
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: 'Distribution of Crowd Intensity (target)'
                }
              }
            }} 
          />
        </div>
      )}

      {chartData && (
        <div className="mb-6" style={{ height: '400px' }}>
          <h3 className="text-xl font-semibold mb-4">Crowd Intensity by Station</h3>
          <Bar 
            data={chartData} 
            options={{ 
              responsive: true, 
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: 'Crowd Intensity by Station'
                }
              },
              scales: {
                x: {
                  ticks: {
                    rotation: 45
                  }







                }
              }
            }} 
          />
        </div>
      )}

    </>
  );
};


export default ChartComponent;