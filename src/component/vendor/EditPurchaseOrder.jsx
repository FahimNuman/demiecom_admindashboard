import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EditPurchaseOrder = () => {
  const navigate = useNavigate();
  const [poDetails, setPoDetails] = useState({
    poNumber: 'PO-2024-001',
    vendor: 'TechVendor A',
    paymentTerms: 'Net 30',
    deliveryDate: '2025-06-15', // Updated to a future date in YYYY-MM-DD format
    items: [
      { product: 'Wireless Headphones', sku: 'WH-001', quantity: 25, unitCost: 85.00, total: 2125.00 },
      { product: 'USB-C Cables', sku: 'CB-205', quantity: 50, unitCost: 12.50, total: 625.00 },
    ],
  });

  const handleQuantityChange = (index, newQuantity) => {
    const updatedItems = [...poDetails.items];
    updatedItems[index].quantity = parseInt(newQuantity) || 0;
    updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].unitCost;
    setPoDetails({ ...poDetails, items: updatedItems });
  };

  const handleCostChange = (index, newCost) => {
    const updatedItems = [...poDetails.items];
    updatedItems[index].unitCost = parseFloat(newCost) || 0;
    updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].unitCost;
    setPoDetails({ ...poDetails, items: updatedItems });
  };

  const total = poDetails.items.reduce  ((sum, item) => sum + (item.total || 0), 0);

  const handleGeneratePO = () => {
    navigate('/po-generated', {
      state: { poNumber: poDetails.poNumber, vendor: poDetails.vendor },
    });
  };

  return (
    <div className="container mx-auto py-2 px-4">
      <div className="bg-white rounded-2xl container mx-auto py-2 px-4">
        <div className="flex justify-between items-center bg-[#6b48ff] text-white p-4 rounded-t-xl">
          <h2 className="text-xl font-semibold flex items-center">
            <span className="mr-2">-</span> Edit Purchase Order - {poDetails.vendor}
          </h2>
          <div className="bg-[#d3bfff] text-[#6b48ff] px-4 py-1 rounded-full">Step 4 of 4</div>
        </div>

        <div className="flex items-center justify-center my-4">
          <div className="flex items-center space-x-2 text-gray-500">
            <span>Workflow Progress:</span>
            <div className="flex space-x-1">
              <span className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">1</span>
              <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center">2</span>
              <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center">3</span>
              <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center">4</span>
              <span className="w-4 h-1 bg-gray-300"></span>
              <span className="w-4 h-1 bg-green-500"></span>
              <span className="w-4 h-1 bg-green-500"></span>
              <span className="w-4 h-1 bg-green-500"></span>
            </div>
            <span className="text-green-500">✔</span>
          </div>
        </div>

        <div className="bg-[#fff3cd] p-4 rounded-lg my-4">
          <p className="text-[#856404] text-sm">
            <span className="mr-2">💡</span> <strong>UPDATED:</strong> Edit Then Generate<br />
            Edit PO details first, then "Generate PO" creates the final document for download ONLY.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Purchase Order Details</h3>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-gray-600">PO Number</label>
              <input
                type="text"
                value={poDetails.poNumber}
                readOnly
                className="w-full border rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-gray-600">Vendor</label>
              <input
                type="text"
                value={poDetails.vendor}
                readOnly
                className="w-full border rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-gray-600">Payment Terms</label>
              <div className="relative">
                <select
                  value={poDetails.paymentTerms}
                  onChange={(e) => setPoDetails({ ...poDetails, paymentTerms: e.target.value })}
                  className="w-full border rounded-lg p-2 appearance-none"
                >
                  <option>Net 30</option>
                  <option>Net 60</option>
                  <option>Due on Receipt</option>
                </select>
                <span className="absolute right-3 top-3 text-gray-500">▼</span>
              </div>
            </div>
            <div>
              <label className="block text-gray-600">Delivery Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={poDetails.deliveryDate}
                  onChange={(e) => setPoDetails({ ...poDetails, deliveryDate: e.target.value })}
                  className="w-full border rounded-lg p-2"
                />
                <span className="absolute right-3 top-3 text-gray-500">📅</span>
              </div>
            </div>
          </div>
        </div>

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
                  <td className="p-3">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(index, e.target.value)}
                      className="w-20 border rounded-lg p-2"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      step="0.01"
                      value={item.unitCost.toFixed(2)}
                      onChange={(e) => handleCostChange(index, e.target.value)}
                      className="w-24 border rounded-lg p-2"
                    />
                  </td>
                  <td className="p-3">${item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold">TOTAL: ${total.toFixed(2)}</div>
          <div className="space-x-2">
            <button
              className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg flex items-center"
              onClick={() => navigate('/purchaseOrderList')}
            >
              <span className="mr-2">←</span> Back to PO List
            </button>
            <button
              className="bg-[#6b48ff] text-white px-4 py-2 Kristen is the bestrounded-lg flex items-center"
              onClick={handleGeneratePO}
            >
              <span className="mr-2">📋</span> Generate PO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPurchaseOrder;