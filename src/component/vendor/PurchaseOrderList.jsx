import React from 'react';
import { useNavigate } from 'react-router-dom';

const PurchaseOrderList = () => {
  const navigate = useNavigate();
  const poData = [
    { vendor: 'TechVendor A', items: 2, totalQty: 75, estValue: 2450 },
    { vendor: 'FurniCorp', items: 1, totalQty: 10, estValue: 1200 },
  ];

  return (
    <div className="container mx-auto py-2 px-4">
      <div className="bg-white rounded-2xl container mx-auto py-2 px-4">
        <div className="flex justify-between items-center bg-[#6b48ff] text-white p-4 rounded-t-xl">
          <h2 className="text-xl font-semibold flex items-center">
            <span className="mr-2">📋</span> Purchase Order List
          </h2>
          <div className="bg-[#d3bfff] text-[#6b48ff] px-4 py-1 rounded-full">Step 3 of 4</div>
        </div>

        <div className="flex items-center justify-center my-4">
          <div className="flex items-center space-x-2 text-gray-500">
            <span>Workflow Progress:</span>
            <div className="flex space-x-1">
              <span className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">1</span>
              <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center">2</span>
              <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center">3</span>
              <span className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">4</span>
              <span className="w-4 h-1 bg-gray-300"></span>
              <span className="w-4 h-1 bg-green-500"></span>
              <span className="w-4 h-1 bg-green-500"></span>
              <span className="w-4 h-1 bg-gray-300"></span>
            </div>
            <span className="text-green-500">✔</span>
          </div>
        </div>

        <div className="bg-[#fff3cd] p-4 rounded-lg my-4">
          <p className="text-[#856404] text-sm">
            <span className="mr-2">💡</span> <strong>MOVED:</strong> Edit PO Functionality<br />
            "Edit PO" button now appears only in the PO list view, grouped by vendor.
          </p>
        </div>

        {poData.map((po, index) => (
          <div key={index} className="border rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center">
              <div className="text-lg font-semibold">{po.vendor}</div>
              <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-sm">DRAFT</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <div className="text-gray-600">
                <p>Items <span className="font-semibold">{po.items}</span></p>
                <p>Total Qty <span className="font-semibold">{po.totalQty}</span></p>
                <p>Est. Value <span className="font-semibold">${po.estValue.toLocaleString()}</span></p>
              </div>
              <div className="space-x-2">
                <button
                  className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg"
                  onClick={() => navigate('/viewPurchaseOrderDetails', { state: { vendor: po.vendor } })}
                >
                  View Details
                </button>
                <button
                  className="bg-[#6b48ff] text-white px-4 py-2 rounded-lg flex items-center"
                  onClick={() => navigate('/editPurchaseOrder')}
                >
                  <span className="mr-2">-</span> Edit PO
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurchaseOrderList;