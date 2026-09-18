import React, { useState } from "react";
import axios from "axios";

const RegisterVendor = ({ closeModal, onRegister }) => {
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    email: "",
    phoneNo: "",
    address: "",
    website: "",
    country: "",
    city: "",
    state: "",
    postcode: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("http://localhost:4000/api/vendor/register", formData);
      setSuccess("Vendor registered successfully!");
      setFormData({
        name: "",
        companyName: "",
        email: "",
        phoneNo: "",
        address: "",
        website: "",
        country: "",
        city: "",
        state: "",
        postcode: "",
      });
      if (onRegister) onRegister(); // Trigger refresh of the vendor list
    } catch (err) {
      setError(err.response?.data?.message || "Error registering vendor");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="text"
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Website (Optional)</label>
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Country (Optional)</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City (Optional)</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">State (Optional)</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Postcode (Optional)</label>
          <input
            type="text"
            name="postcode"
            value={formData.postcode}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <div className="md:col-span-3 flex justify-end space-x-3 mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Register
          </button>
          <button
            type="button"
            onClick={closeModal}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterVendor;