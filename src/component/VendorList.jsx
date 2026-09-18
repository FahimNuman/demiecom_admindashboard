import  { useState, useEffect } from "react";
import axios from "axios";

const VendorList = ({ openDetailsModal, closeModal }) => {
  const [vendors, setVendors] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/vendor/list");
        setVendors(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching vendors");
      }
    };

    fetchVendors();
  }, []);

  return (
    <div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {vendors.length === 0 ? (
        <p className="text-gray-600">No vendors found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Name</th>
                <th className="px-4 py-2 border-b">Company Name</th>
                <th className="px-4 py-2 border-b">Email</th>
                <th className="px-4 py-2 border-b">Phone Number</th>
                <th className="px-4 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor._id} className="text-center">
                  <td className="px-4 py-2 border-b">{vendor.name}</td>
                  <td className="px-4 py-2 border-b">{vendor.companyName}</td>
                  <td className="px-4 py-2 border-b">{vendor.email}</td>
                  <td className="px-4 py-2 border-b">{vendor.phoneNo}</td>
                  <td className="px-4 py-2 border-b">
                    <button
                      onClick={() => openDetailsModal(vendor._id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button
        onClick={closeModal}
        className="mt-4 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
      >
        Close
      </button>
    </div>
  );
};

export default VendorList;