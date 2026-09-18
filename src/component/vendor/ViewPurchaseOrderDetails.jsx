import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ViewPurchaseOrderDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { vendor } = location.state || { vendor: 'TechVendor A' }; // Default vendor if state is not passed

  const poDetails = {
    poNumber: 'PO-2024-001',
    vendor: vendor,
    paymentTerms: 'Net 30',
    deliveryDate: '12/15/2024',
    items: [
      { product: 'Wireless Headphones', sku: 'WH-001', quantity: 25, unitCost: 85.00, total: 2125.00 },
      { product: 'USB-C Cables', sku: 'CB-205', quantity: 50, unitCost: 12.50, total: 625.00 },
    ],
  };

  const total = poDetails.items.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="container mx-auto py-2 px-4">
      <div className="bg-white rounded-2xl container mx-auto py-2 px-4">
        {/* Header */}
        <div className="flex justify-between items-center bg-[#6b48ff] text-white p-4 rounded-t-xl">
          <h2 className="text-xl font-semibold flex items-center">
            <span className="mr-2">📋</span> Purchase Order Details - {poDetails.vendor}
          </h2>
          <div className="bg-[#d3bfff] text-[#6b48ff] px-4 py-1 rounded-full">Step 3 of 4</div>
        </div>

        {/* Workflow Progress */}
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

        {/* PO Details */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Purchase Order Details</h3>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-gray-600">PO Number</label>
              <p className="border rounded-lg p-2">{poDetails.poNumber}</p>
            </div>
            <div>
              <label className="block text-gray-600">Vendor</label>
              <p className="border rounded-lg p-2">{poDetails.vendor}</p>
            </div>
            <div>
              <label className="block text-gray-600">Payment Terms</label>
              <p className="border rounded-lg p-2">{poDetails.paymentTerms}</p>
            </div>
            <div>
              <label className="block text-gray-600">Delivery Date</label>
              <p className="border rounded-lg p-2">{poDetails.deliveryDate}</p>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Line Items</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">SKU</th>
                <th className="p-3 text-left">Quantity</th>
                <th className="p-3 text-left">Unit Cost</th>
                <th className="p-3 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              {poDetails.items.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="p-3">{item.product}</td>
                  <td className="p-3">{item.sku}</td>
                  <td className="p-3">{item.quantity}</td>
                  <td className="p-3">${item.unitCost.toFixed(2)}</td>
                  <td className="p-3">${item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total and Button */}
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold">TOTAL: ${total.toFixed(2)}</div>
          <button
            className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg flex items-center"
            onClick={() => navigate('/purchaseOrderList')}
          >
            <span className="mr-2">←</span> Back to PO List
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewPurchaseOrderDetails;