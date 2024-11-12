
// src/components/TableComponent.jsx
import React from 'react';

const TableComponent = ({ data, paginatedData, currentPage, totalPages, setCurrentPage }) => {
  return (
    <>
      <div className="mb-4">
        <span className="mr-4">Total Rows: {data.length}</span>
        <span>Page {currentPage} of {totalPages}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 mb-6">
          <thead className="bg-gray-200 sticky top-0">
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th key={key} className="py-2 px-4 border-b border-gray-300 text-left font-semibold">
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr key={index} className="even:bg-gray-50">
                {Object.values(row).map((value, i) => (
                  <td key={i} className="py-2 px-4 border-b border-gray-300">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-4 flex justify-center gap-2">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </>
  );
};

export default TableComponent;
