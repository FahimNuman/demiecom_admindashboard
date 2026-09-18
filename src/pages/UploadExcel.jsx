import { useState } from "react";
import axios from "axios";
import ExcelImage from "../component/ExcelLIst/ExcelImage";


const UploadExcel = ({ token }) => { // Ensure token prop is received
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const backend_url = import.meta.env.VITE_BACKEND_URL;

  // const backend_url = "https://api.rsikdercorporation.com"; // Adjust as needed  VITE_BACKEND_URL=https://api.rsikdercorporation.com 

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (
      selectedFile &&
      (selectedFile.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        selectedFile.type === "application/vnd.ms-excel")
    ) {
      setFile(selectedFile);
      setUploadMessage("");
    } else {
      setUploadMessage("Please select a valid Excel file (.xlsx or .xls).");
      setFile(null);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      setUploadMessage("No file selected. Please select a file first.");
      return;
    }

    try {
      setIsUploading(true);
      const fileBuffer = await file.arrayBuffer();

      const response = await axios.post(
        `${backend_url}/api/excel/upload`,
        fileBuffer,
        {
          headers: {
            "Content-Type": "application/octet-stream",
          },
        }
      );

      console.log("response", response);

      setUploadMessage(response.data.message || "File uploaded successfully!");
      setFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadMessage("Error uploading file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col md:flex-row gap-4">
      {/* Left Side: Upload Form */}
      <div className="w-full md:w-6/6 bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Upload Excel File
        </h2>
        <form className="flex flex-col items-center space-y-4">
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button" // Changed to type="button" to prevent form submission issues
            onClick={handleUpload}
            disabled={isUploading}
            className={`w-full px-4 py-2 font-semibold text-white rounded-md transition duration-300 ease-in-out focus:outline-none shadow-md ${
              isUploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            }`}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </form>
        {uploadMessage && (
          <p
            className={`mt-4 text-sm text-center ${
              uploadMessage.includes("Error")
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {uploadMessage}
          </p>
        )}
      </div>

      {/* Right Side: ExcelImage Component */}
      <div className="w-full md:w-2/3 bg-white shadow-lg rounded-lg p-6">
        <ExcelImage token={token} />
      </div>
    </div>
  );
};

export default UploadExcel;