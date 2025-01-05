import React from 'react';
import { Bar } from 'react-chartjs-2';

const HistogramComponent = ({ data, title, xLabel, yLabel }) => {
  if (!data) return null;
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: xLabel
        }
      },
      y: {
        title: {
          display: true,
          text: yLabel
        },
        beginAtZero: true
      }


    }
  };
  return (
      <div className="mt-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};


export default HistogramComponent;