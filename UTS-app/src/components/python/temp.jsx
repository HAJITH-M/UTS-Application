import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import FileUploadComponent from './FileUploadComponent.jsx/FileUploadComponent';
import TableComponent from './FileUploadComponent.jsx/TableComponent';
import ChartComponent from './FileUploadComponent.jsx/ChartComponent';

const DataTable = () => {
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [crowdIntensityData, setCrowdIntensityData] = useState(null);
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
      }
    };
    reader.readAsBinaryString(file);
  };

  const prepareChartData = (jsonData) => {
    // Prepare crowd intensity distribution data
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

    // Prepare station-wise crowd intensity data
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
        </>
      ) : (
        <p className="text-gray-600">No data loaded. Please upload an Excel file.</p>
      )}
    </div>
  );
};

export default DataTable;