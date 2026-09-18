import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const InventoryDashboard = () => {
  const [selectedItems, setSelectedItems] = useState([true, true, true, false]);
  const navigate = useNavigate();

  const inventoryData = [
    { productName: 'Wireless Headphones', sku: 'WH-001', quantity: 25, vendor: 'TechVendor A', status: 'Low Stock', statusColor: 'text-red-500' },
    { productName: 'USB-C Cables', sku: 'CB-205', quantity: 50, vendor: 'TechVendor A', status: 'Reorder', statusColor: 'text-red-500' },
    { productName: 'Office Chairs', sku: 'OC-101', quantity: 10, vendor: 'FurniCorp', status: 'Low Stock', statusColor: 'text-red-500' },
    { productName: 'Desk Lamps', sku: 'DL-301', quantity: 15, vendor: 'LightCo', status: 'In Stock', statusColor: 'text-green-500' },
  ];

  const handleSelect = (index) => {
    const updatedSelection = [...selectedItems];
    updatedSelection[index] = !updatedSelection[index];
    setSelectedItems(updatedSelection);
  };

  const selectedCount = selectedItems.filter(Boolean).length;
  const vendorCount = new Set(inventoryData.filter((_, index) => selectedItems[index]).map(item => item.vendor)).size;

  const handleEnlist = () => {
    if (selectedCount > 0) {
      navigate('/draftPOCreation');
    } else {
      alert('Please select at least one item.');
    }
  };

  return (
    <div className="container mx-auto py-2 px-4">
      <div className="bg-white rounded-2xl container mx-auto py-2 px-4">
        <div className="flex justify-between items-center bg-[#6b48ff] text-white p-4 rounded-t-xl">
          <h2 className="text-xl font-semibold flex items-center">
            <span className="mr-2">📦</span> Inventory Dashboard
          </h2>
          <div className="bg-[#d3bfff] text-[#6b48ff] px-4 py-1 rounded-full">Step 1 of 4</div>
        </div>

        <div className="bg-[#fff3cd] p-4 rounded-lg my-4">
          <p className="text-[#856404] text-sm">
            <span className="mr-2">💡</span> <strong>UPDATED:</strong> Selection-Based Workflow<br />
            Removed "Edit PO" and "Generate Document" buttons. Added item selection with bulk actions.
          </p>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left"><input type="checkbox" className="w-5 h-5" /></th>
              <th className="p-3 text-left">Product Name</th>
              <th className="p-3 text-left">SKU</th>
              <th className="p-3 text-left">Quantity</th>
              <th className="p-3 text-left">Vendor</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {inventoryData.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="p-3">
                  <input
                    type="checkbox"
                    className="w-5 h-5"
                    checked={selectedItems[index]}
                    onChange={() => handleSelect(index)}
                  />
                </td>
                <td className="p-3">{item.productName}</td>
                <td className="p-3">{item.sku}</td>
                <td className="p-3">{item.quantity}</td>
                <td className="p-3">
                  <span className="bg-gray-200 px-3 py-1 rounded-full">{item.vendor}</span>
                </td>
                <td className={`p-3 ${item.statusColor}`}>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center mt-4">
          <div className="text-gray-500 text-sm">
            {selectedCount} items selected from {vendorCount} vendors
          </div>
          <button
            className="bg-[#6b48ff] text-white px-6 py-2 rounded-lg flex items-center"
            onClick={handleEnlist}
          >
            <span className="mr-2">📋</span> Enlist to Vendor PO
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryDashboard;