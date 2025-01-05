// src/components/DataTable.jsx
import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';

import HistogramComponent from './FileUploadComponent.jsx/HistogramComponent';
import FileUploadComponent from './FileUploadComponent.jsx/FileUploadComponent';
import TableComponent from './FileUploadComponent.jsx/TableComponent';
import ChartComponent from './FileUploadComponent.jsx/ChartComponent';
import BoxPlotComponent from './FileUploadComponent.jsx/BoxPlotComponent';

const DataTable = () => {
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [crowdIntensityData, setCrowdIntensityData] = useState(null);
  const [boxPlotData, setBoxPlotData] = useState(null);
  const [arrivalTimeData, setArrivalTimeData] = useState(null);
  const [histogramData, setHistogramData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 100;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setData(jsonData);
      setCurrentPage(1);

      if (jsonData.length > 0) {
        prepareChartData(jsonData);
        prepareBoxPlotData(jsonData);
        prepareArrivalTimeData(jsonData);
        prepareHistogramData(jsonData);
      }
    };
    reader.readAsBinaryString(file);
  };

  const prepareHistogramData = (jsonData) => {
    try {




      const arrivalTimes = [];
      for (let i = 0; i < jsonData.length; i++) {
        const time = parseFloat(jsonData[i]['Arrival Time']);
        if (isFinite(time)) {
          arrivalTimes.push(time);
        }
      }
      
      if (arrivalTimes.length === 0) {
        setHistogramData(null);
        return;
      }




      let min = arrivalTimes[0];
      let max = arrivalTimes[0];
      for (let i = 1; i < arrivalTimes.length; i++) {
        if (arrivalTimes[i] < min) min = arrivalTimes[i];
        if (arrivalTimes[i] > max) max = arrivalTimes[i];
      }
      
      if (min === max) {
        setHistogramData(null);
        return;
      }


      const bins = 10;
      const binWidth = (max - min) / bins;
      const frequencies = new Array(bins).fill(0);



      for (let i = 0; i < arrivalTimes.length; i++) {
        const binIndex = Math.min(Math.floor((arrivalTimes[i] - min) / binWidth), bins - 1);
        if (binIndex >= 0 && binIndex < bins) {
          frequencies[binIndex]++;
        }

      }


      const binLabels = [];
      for (let i = 0; i < bins; i++) {
        const start = min + i * binWidth;
        const end = min + (i + 1) * binWidth;


        binLabels.push(`${start.toFixed(2)}-${end.toFixed(2)}`);
      }

      setHistogramData({
        labels: binLabels,
        datasets: [{
          label: 'Frequency',
          data: frequencies,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }]
      });
    } catch (error) {
      console.error('Error preparing histogram data:', error);
      setHistogramData(null);
    }
  };

  const prepareArrivalTimeData = (jsonData) => {
    const arrivalTimes = jsonData.map(row => row['Arrival Time']);
    setArrivalTimeData({
      data: arrivalTimes,
      labels: Array.from(new Set(arrivalTimes)).sort(),
      datasets: [{
        label: 'Arrival Time Distribution',
        data: arrivalTimes,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }]
    });
  };

  const prepareBoxPlotData = (jsonData) => {
    const processedData = jsonData.map(row => ({
      Target: row.Target,
      Count: row.Count
    }));
    
    setBoxPlotData(processedData);
  };

  const prepareChartData = (jsonData) => {
    const targetCounts = {};
    jsonData.forEach(row => {
      targetCounts[row.Target] = (targetCounts[row.Target] || 0) + 1;
    });

    setCrowdIntensityData({
      labels: Object.keys(targetCounts),
      datasets: [{
        label: 'Crowd Intensity Distribution',
        data: Object.values(targetCounts),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }]
    });

    const stationData = {};
    jsonData.forEach(row => {
      if (!stationData[row.Station]) {
        stationData[row.Station] = {};
      }
      stationData[row.Station][row.Target] = (stationData[row.Station][row.Target] || 0) + 1;
    });

    const stations = Object.keys(stationData);
    const targets = [...new Set(jsonData.map(row => row.Target))];

    setChartData({
      labels: stations,
      datasets: targets.map((target, index) => ({
        label: `Intensity ${target}`,
        data: stations.map(station => stationData[station][target] || 0),
        backgroundColor: `rgba(75, ${192 - index * 30}, 192, 0.2)`,
        borderColor: `rgba(75, ${192 - index * 30}, 192, 1)`,
        borderWidth: 1,
      }))
    });
  };

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return data.slice(startIndex, startIndex + rowsPerPage); 
  }, [data, currentPage]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Data Table with Visualization</h2>

      <FileUploadComponent handleFileUpload={handleFileUpload} />
      
      {data.length > 0 ? (
        <>
          <TableComponent 
            data={data}
            paginatedData={paginatedData}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
          
          <ChartComponent 
            crowdIntensityData={crowdIntensityData}
            chartData={chartData}
          />

          <BoxPlotComponent 
            data={boxPlotData}
          />

          {histogramData && (
            <HistogramComponent
              data={histogramData}
              title="Arrival Time Distribution"
              xLabel="Arrival Time"
              yLabel="Frequency"
            />
          )}
        </>
      ) : (
        <p className="text-gray-600">No data loaded. Please upload an Excel file.</p>
      )}
    </div>
  );
};

export default DataTable;