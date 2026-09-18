import { useState, useEffect } from "react";
import axios from "axios";

const VendorDetails = ({ vendorId, closeModal }) => {
  const [vendor, setVendor] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        // Update the URL to use a URL parameter instead of a query parameter
        const response = await axios.get(
          `http://localhost:4000/api/vendor/${vendorId}`
        );
        setVendor(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching vendor details");
      }
    };

    if (vendorId) {
      fetchVendorDetails();
    }
  }, [vendorId]);

  if (error) {
    return (
      <div>
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={closeModal}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
        >
          Close
        </button>
      </div>
    );
  }

  if (!vendor) {
    return <p className="text-gray-600">Loading...</p>;
  }

  return (
    <div>
      <div className="space-y-12">
        <p>
          <strong>Name:</strong> {vendor.name}
        </p>
        <p>
          <strong>Company Name:</strong> {vendor.companyName}
        </p>
        <p>
          <strong>Email:</strong> {vendor.email}
        </p>
        <p>
          <strong>Phone Number:</strong> {vendor.phoneNo}
        </p>
        <p>
          <strong>Address:</strong> {vendor.address}
        </p>
        <p>
          <strong>Website:</strong> {vendor.website || "N/A"}
        </p>
        <p>
          <strong>Country:</strong> {vendor.country || "N/A"}
        </p>
        <p>
          <strong>City:</strong> {vendor.city || "N/A"}
        </p>
        <p>
          <strong>State:</strong> {vendor.state || "N/A"}
        </p>
        <p>
          <strong>Postcode:</strong> {vendor.postcode || "N/A"}
        </p>
      </div>
      <button
        onClick={closeModal}
        className="mt-4 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
      >
        Close
      </button>
    </div>
  );
};

export default VendorDetails;