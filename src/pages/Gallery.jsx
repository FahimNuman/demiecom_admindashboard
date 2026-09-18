import axios from "axios";
import { useState } from "react";
import { backend_url } from "../App";
import { toast } from "react-toastify";
import loadingImage from "../assets/loading.gif";
import { Upload } from "lucide-react";
import ExcelImage from "../component/ExcelLIst/ExcelImage";

const Gallery = ({ token }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleImageChange = (event) => {
    const files = event.target.files;
    const newFiles = Array.from(files);

    setSelectedImages((prevImages) => [...prevImages, ...newFiles]);
  };

  const handleDeleteImage = (imageToDelete) => {
    setSelectedImages((prevImages) => prevImages.filter((image) => image !== imageToDelete));
  };

  // Validation logic
  const validateForm = () => {
    const newErrors = {};
    if (selectedImages.length === 0) {
      newErrors.image = "Image is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const formData = new FormData();
    selectedImages.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await axios.post(
        `${backend_url}/api/upload/gallery-images`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.status === "success") {
        toast.success("Images uploaded successfully");
        setSelectedImages([]);
      }
    } catch (error) {
      console.error("Error uploading images:", error.response?.data || error.message);
      toast.error("Failed to upload images.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-wrap gap-4">
      {/* Left Side: Upload Section */}
      <div className="w-full md:w-1/2">
        <div className="w-full bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Upload Images</h2>

          {loading && (
            <div className="flex justify-center">
              <img src={loadingImage} alt="Loading" width="100" height="100" />
            </div>
          )}

          <form className="flex flex-col items-center space-y-4" onSubmit={handleSubmit}>
            <label className="flex flex-col items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <Upload className="w-10 h-10 text-gray-500" />
              <span className="mt-2 text-sm text-gray-600">Click to upload images</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>

          {/* Image Preview */}
          {selectedImages.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Image Preview</h2>
              <div className="flex flex-wrap justify-center gap-4">
                {selectedImages.map((image, index) => (
                  <div key={index} className="relative w-32 h-32 bg-gray-200 rounded-lg overflow-hidden">
                    <img src={URL.createObjectURL(image)} alt={`Preview ${index}`} className="object-cover w-full h-full" />
                    <button
                      onClick={() => handleDeleteImage(image)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Side: ExcelImage Component */}
      <div className="w-full md:w-1/2">
      <div className="w-full md:w-2/3 bg-white shadow-lg rounded-lg p-6">
          <ExcelImage token={token} />
        </div>
      </div>
    </div>
  );
};

export default Gallery;
