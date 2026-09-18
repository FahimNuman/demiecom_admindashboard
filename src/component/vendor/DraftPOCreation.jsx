import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DraftPOCreation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate draft PO creation process with a 3-second delay
    const timer = setTimeout(() => {
      navigate('/purchaseOrderList');
    }, 3000);

    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, [navigate]);

  return (
    <div className="container mx-auto py-2 px-4">
      <div className="container mx-auto py-2 px-4">
        <div className="flex justify-between items-center bg-[#6b48ff] text-white p-4 rounded-t-xl">
          <h2 className="text-xl font-semibold flex items-center">
            <span className="mr-2">📋</span> Draft PO Creation
          </h2>
          <div className="bg-[#d3bfff] text-[#6b48ff] px-4 py-1 rounded-full">Step 2 of 4</div>
        </div>

        <div className="flex items-center justify-center my-4">
          <div className="flex items-center space-x-2 text-gray-500">
            <span>Workflow Progress:</span>
            <div className="flex space-x-1">
              <span className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">1</span>
              <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center">2</span>
              <span className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">3</span>
              <span className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">4</span>
              <span className="w-4 h-1 bg-gray-300"></span>
              <span className="w-4 h-1 bg-green-500"></span>
              <span className="w-4 h-1 bg-gray-300"></span>
              <span className="w-4 h-1 bg-gray-300"></span>
            </div>
            <span className="text-green-500">✔</span>
          </div>
        </div>

        <div className="bg-[#fff3cd] p-4 rounded-lg my-4">
          <p className="text-[#856404] text-sm">
            <span className="mr-2">💡</span> <strong>NEW:</strong> Auto-Draft Generation<br />
            System automatically creates vendor-specific draft POs based on selected items.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center py-10">
          <span className="text-yellow-500 text-4xl mb-4">⚡</span>
          <h3 className="text-lg font-semibold mb-4">Creating Draft Purchase Orders...</h3>
          <div className="text-gray-600 space-y-2">
            <p className="flex items-center"><span className="mr-2 text-green-500">✔</span> Analyzing selected items</p>
            <p className="flex items-center"><span className="mr-2 text-green-500">✔</span> Grouping by vendor</p>
            <p className="flex items-center"><span className="mr-2 text-yellow-500">⏳</span> Generating draft POs...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DraftPOCreation;