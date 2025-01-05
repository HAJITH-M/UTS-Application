
// Create BoxPlotComponent.jsx in the FileUploadComponent.jsx folder
import React from 'react';
import Plot from 'react-plotly.js';

const BoxPlotComponent = ({ data }) => {
  if (!data) return null;

  const targets = [...new Set(data.map(item => item.Target))];
  const traces = targets.map(target => {
    const targetData = data.filter(item => item.Target === target);
    return {
      y: targetData.map(item => item.Count),
      type: 'box',
      name: `Target ${target}`,
    };
  });

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Box Plot Analysis</h3>
      <Plot
        data={traces}
        layout={{
          title: 'Distribution of Counts by Target',
          yaxis: { title: 'Count' },
          boxmode: 'group'
        }}
        style={{ width: '100%', height: '500px' }}
      />
    </div>
  );
};

export default BoxPlotComponent;