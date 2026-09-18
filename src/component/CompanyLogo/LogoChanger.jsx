import { useState } from "react";
import { FaUpload, FaTrash, FaCheck } from "react-icons/fa";

const LogoChanger = () => {
  const defaultLogo = "/default-logo.png"; // Change this to your default logo path
  const [logo, setLogo] = useState(defaultLogo);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const processFile = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (preview) {
      setLogo(preview);
      setPreview(null);
    }
  };

  const handleReset = () => {
    setLogo(defaultLogo);
    setPreview(null);
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-2xl p-6 text-center border">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Update Company Logo</h2>

      <div 
        className={`flex justify-center items-center mb-4 p-4 border-2 border-dashed rounded-lg 
        ${dragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <img
          src={preview || logo}
          alt="Company Logo"
          className="w-32 h-32 object-cover rounded-full border shadow-md"
        />
      </div>

      <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg flex items-center gap-2 justify-center transition duration-300">
        <FaUpload />
        <span>Upload Logo</span>
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleLogoChange}
        />
      </label>

      {preview && (
        <div className="mt-5 flex gap-3 justify-center">
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg flex items-center gap-2 transition duration-300"
          >
            <FaCheck />
            Save
          </button>
          <button
            onClick={handleReset}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg flex items-center gap-2 transition duration-300"
          >
            <FaTrash />
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

export default LogoChanger;
