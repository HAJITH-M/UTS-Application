// src/components/FileUploadComponent.jsx/HistogramComponent.jsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const HistogramComponent = ({ data, title, xLabel, yLabel }) => {
  // Check if data is passed and exists
  if (!data) {
    return <p className="text-gray-600">Loading histogram data...</p>;
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <Bar
        data={data}
        options={{
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: title,
            },
            legend: {
              position: 'top',
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: xLabel,
              },
            },
            y: {
              title: {
                display: true,
                text: yLabel,
              },
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  );
};

export default HistogramComponent;
