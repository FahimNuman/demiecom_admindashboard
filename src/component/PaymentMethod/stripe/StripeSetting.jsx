import { useState, useEffect } from "react";
import axios from "axios";

import { FaEye, FaEyeSlash } from "react-icons/fa";

import { backend_url } from "../../../App";

const StripeSetting = () => {  
  const [stripeSecretKey, setStripeSecretKey] = useState("");
  const [stripePublicKey, setStripePublicKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [showPublicKey, setShowPublicKey] = useState(false);

  useEffect(() => {
    const fetchStripeKeys = async () => {
      try {
        const response = await axios.get(`${backend_url}/api/stripe/keys`);
        if (response.data) {
          setStripePublicKey(response.data.publicKey);
          setStripeSecretKey(response.data.secretKey);
        }
      } catch (error) {
        console.error("Error fetching Stripe keys:", error);
        setMessage("Failed to load Stripe keys. Please try again.");
      }
    };

    fetchStripeKeys(); // Fetch data when the component loads
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.post(`${backend_url}/api/stripe/keys`, {
        publicKey: stripePublicKey,
        secretKey: stripeSecretKey,
      });

      setMessage("Stripe keys updated successfully!");
    } catch (error) {
      setMessage("Error updating Stripe keys. Please try again.");
      console.error("Error updating Stripe keys:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-2 px-4">
      <h2 className="text-xl font-bold mb-4">Edit Stripe Keys</h2>

      {message && (
        <div className={`mb-4 p-2 rounded-lg text-white ${message.includes("Error") ? "bg-red-500" : "bg-green-500"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4 relative">
          <label className="block text-gray-700">Stripe Secret Key</label>
          <div className="relative">
            <input
              type={showSecretKey ? "text" : "password"}
              value={stripeSecretKey}
              onChange={(e) => setStripeSecretKey(e.target.value)}
              className="w-full p-2 border rounded-lg pr-10"
              required
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-gray-600"
              onClick={() => setShowSecretKey(!showSecretKey)}
            >
              {showSecretKey ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        <div className="mb-4 relative">
          <label className="block text-gray-700">Stripe Public Key</label>
          <div className="relative">
            <input
              type={showPublicKey ? "text" : "password"}
              value={stripePublicKey}
              onChange={(e) => setStripePublicKey(e.target.value)}
              className="w-full p-2 border rounded-lg pr-10"
              required
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-gray-600"
              onClick={() => setShowPublicKey(!showPublicKey)}
            >
              {showPublicKey ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="bg-cyan-900 text-white px-4 py-2 rounded-lg w-full"
          disabled={loading}
        >
          {loading ? "Saving..." : "Submit"}
        </button>

      
      </form>
    </div>
  );
};

export default StripeSetting;
