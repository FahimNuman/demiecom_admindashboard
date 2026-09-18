import { useState, useEffect } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { backend_url } from "../../../App";

const AuthorizeNetSetting = () => {  
  const [apiLoginId, setApiLoginId] = useState("");
  const [transactionKey, setTransactionKey] = useState("");
  const [sandboxMode, setSandboxMode] = useState("true"); // Default to "true" as string
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showApiLoginId, setShowApiLoginId] = useState(false);
  const [showTransactionKey, setShowTransactionKey] = useState(false);

  useEffect(() => {
    const fetchAuthorizeNetKeys = async () => {
      try {
        const response = await axios.get(`${backend_url}/api/authorize-net/keys`); 
        if (response.data) {
          setApiLoginId(response.data.apiLoginId);
          setTransactionKey(response.data.transactionKey);
          setSandboxMode(response.data.sandboxMode || "true"); // Default to "true" if not provided
        }
      } catch (error) {
        console.error("Error fetching Authorize.net keys:", error);
        setMessage("Failed to load Authorize.net keys. Please try again.");
      }
    };

    fetchAuthorizeNetKeys(); // Fetch data when the component loads
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.post(`${backend_url}/api/authorize-net/keys`, {
        apiLoginId: apiLoginId,
        transactionKey: transactionKey,
        sandboxMode: sandboxMode,
      });

      setMessage("Authorize.net keys updated successfully!");
    } catch (error) {
      setMessage("Error updating Authorize.net keys. Please try again.");
      console.error("Error updating Authorize.net keys:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-2 px-4">
      <h2 className="text-xl font-bold mb-4">Edit Authorize.net Keys</h2>

      {message && (
        <div className={`mb-4 p-2 rounded-lg text-white ${message.includes("Error") ? "bg-red-500" : "bg-green-500"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4 relative">
          <label className="block text-gray-700">Authorize.net API Login ID</label>
          <div className="relative">
            <input
              type={showApiLoginId ? "text" : "password"}
              value={apiLoginId}
              onChange={(e) => setApiLoginId(e.target.value)}
              className="w-full p-2 border rounded-lg pr-10"
              required
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-gray-600"
              onClick={() => setShowApiLoginId(!showApiLoginId)}
            >
              {showApiLoginId ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        <div className="mb-4 relative">
          <label className="block text-gray-700">Authorize.net Transaction Key</label>
          <div className="relative">
            <input
              type={showTransactionKey ? "text" : "password"}
              value={transactionKey}
              onChange={(e) => setTransactionKey(e.target.value)}
              className="w-full p-2 border rounded-lg pr-10"
              required
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-gray-600"
              onClick={() => setShowTransactionKey(!showTransactionKey)}
            >
              {showTransactionKey ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Sandbox Mode</label>
          <select
            value={sandboxMode}
            onChange={(e) => setSandboxMode(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
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

export default AuthorizeNetSetting;