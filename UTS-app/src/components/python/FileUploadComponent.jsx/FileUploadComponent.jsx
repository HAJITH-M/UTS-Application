// src/components/FileUploadComponent.jsx
import React from 'react';

const FileUploadComponent = ({ handleFileUpload }) => {
  return (
    <input
      type="file"
      onChange={handleFileUpload}
      accept=".xlsx, .xls"
      className="mb-4 p-2 border border-gray-300 rounded"
    />
  );
};

export default FileUploadComponent;
