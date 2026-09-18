import axios from "axios";
import { backend_url } from "../../App";
import { toast } from "react-toastify";
import upload_icon from "../../assets/upload_icon.png";

const ImageUpload = ({ uploadedImages, setUploadedImages, token }) => {
  const handleImageUpload = async (files) => {
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("images", file); // Match the key "images" as in Postman
    });

    try {
      const response = await axios.post(
        `${backend_url}/api/upload/multiple`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Ensure correct content type
            token,
          },
        }
      );

      if (response.data.success) {
        // Assuming the backend returns an array of uploaded image IDs

        setUploadedImages((prev) => [...prev, ...response.data.images]);
        console.log("Upload success", response.data);

        toast.success("Images uploaded successfully");
      } else {
        toast.error("Image upload failed");
        console.log("Upload failed response", response);
      }
    } catch (error) {
      console.error("Error uploading images", error);
      toast.error(
        error.response.data.error ||
          "Error uploading images, please try uploading with less file size."
      );
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Upload Images</h3>
      <div className="flex items-center gap-4">
        <label htmlFor="image_upload" className="cursor-pointer">
          <img
            src={upload_icon}
            alt="Upload"
            className="w-16 h-16 object-cover ring-1 ring-gray-300 rounded-lg"
          />
          <input
            type="file"
            id="image_upload"
            onChange={(e) => handleImageUpload(e.target.files)}
            hidden
            multiple // Enable multiple file selection
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {uploadedImages.map((img, idx) => (
            // <span
            //   key={idx}
            //   className="text-sm bg-gray-200 px-2 py-1 rounded-md shadow-sm"
            // >
            //   {img.url}
            // </span>
            <img
              key={idx}
              src={img.url}
              alt="Uploaded Images"
              className="w-16 h-16 object-cover ring-1 ring-gray-300 rounded-lg"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
