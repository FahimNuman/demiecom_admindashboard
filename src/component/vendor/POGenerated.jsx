import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const POGenerated = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { poNumber, vendor } = location.state || { poNumber: 'PO-2024-001', vendor: 'TechVendor A' }; // Default values if state is not passed

  const handleDownload = () => {
    // Simulate downloading a PDF (you can replace this with actual download logic)
    alert(`Downloading PO ${poNumber} for ${vendor} as a PDF...`);
    // Optionally navigate back to the PO list after download
    navigate('/purchase-order-list');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#6b48ff] to-[#1a0d5e] p-4 container">
      <div className="bg-green-500 rounded-2xl p-6 w-full max-w-4xl shadow-lg text-white">
        {/* Workflow Progress */}
        <div className="flex items-center justify-center my-4">
          <div className="flex items-center space-x-2">
            <span>Workflow Progress:</span>
            <div className="flex space-x-1">
              <span className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">1</span>
              <span className="w-6 h-6 bg-green-700 text-white rounded-full flex items-center justify-center">2</span>
              <span className="w-6 h-6 bg-green-700 text-white rounded-full flex items-center justify-center">3</span>
              <span className="w-6 h-6 bg-green-700 text-white rounded-full flex items-center justify-center">4</span>
              <span className="w-4 h-1 bg-gray-300"></span>
              <span className="w-4 h-1 bg-green-700"></span>
              <span className="w-4 h-1 bg-green-700"></span>
              <span className="w-4 h-1 bg-green-700"></span>
            </div>
            <span className="text-white">✔</span>
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center py-10">
          <span className="text-4xl mb-4 block">✅</span>
          <h2 className="text-2xl font-semibold mb-2">Purchase Order Generated Successfully!</h2>
          <p className="mb-6">
            {poNumber} for {vendor} has been finalized and is ready for download.
          </p>

          {/* Update Notification */}
          <div className="bg-[#fff3cd] p-4 rounded-lg inline-block mb-6">
            <p className="text-[#856404] text-sm">
              <span className="mr-2">💡</span> <strong>UPDATED:</strong> Download Only<br />
              No social media/email sharing. Download option only.
            </p>
          </div>

          {/* Download Button */}
          <button
            className="bg-white text-gray-600 px-6 py-3 rounded-lg flex items-center mx-auto"
            onClick={handleDownload}
          >
            <span className="mr-2">📄</span> Download PO Document
          </button>

          {/* PO Details */}
          <div className="text-sm mt-6 space-y-1">
            <p className="flex items-center"><span className="mr-2">✔</span> PO STATUS: Finalized</p>
            <p className="flex items-center"><span className="mr-2">✔</span> VENDOR NOTIFICATION: PENDING</p>
            <p className="flex items-center"><span className="mr-2">✔</span> DOCUMENT FORMAT: PDF</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POGenerated;