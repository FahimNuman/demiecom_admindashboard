import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { TbTrash } from "react-icons/tb";
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { backend_url } from "../../App";

const ExcelImage = ({ token }) => {
  const [images, setImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 5;
  const maxPageButtons = 5;

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${backend_url}/api/getAllImages`, {
        headers: { token },
      });
      console.log("Raw API Response:", response.data);
      if (response.data.success) {
        console.log("Images:", response.data.images);
        const formattedImages = (response.data.images || [])
          .map((image) => ({
            _id: image._id,
            url: image.url,
          }))
          .sort((a, b) => b._id.localeCompare(a._id)); // Sort in descending order

        setImages(formattedImages);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = async (id) => {
    const confirmed = window.confirm("Are you sure you want to remove this image?");
    if (!confirmed) return;

    try {
      const response = await axios.post(
        `${backend_url}/api/product/remove`,
        { id },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchImages();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const filteredImages = images.filter((image) =>
    image._id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalItems = filteredImages.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedImages = filteredImages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
  const adjustedStartPage = Math.max(1, endPage - maxPageButtons + 1);

  useEffect(() => {
    if (!token) {
      toast.error("No authentication token provided");
      return;
    }
    fetchImages();
  }, [token]);

  return (
    <div className="w-full p-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-8">
        Product Image List
      </h3>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by image ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-md shadow focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
        />
      </div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-cyan-900 to-gray-600 text-white">
              <th className="p-3 text-sm text-left font-semibold w-1/4">Image</th>
              <th className="p-3 text-sm text-left font-semibold w-1/2">Image ID</th>
              <th className="p-3 text-sm text-left font-semibold w-1/4">Remove</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <td key={idx} className="p-3">
                      <Skeleton height={30} />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedImages.length === 0 ? (
              <tr>
                <td
                  colSpan="3"
                  className="p-3 text-center text-gray-500 text-sm"
                >
                  No images available.
                </td>
              </tr>
            ) : (
              paginatedImages.map((image, index) => (
                <tr
                  key={image._id}
                  className={`transition ${
                    index % 2 === 0 ? "bg-white" : "bg-rose-50"
                  } hover:bg-rose-400`}
                >
                  <td className="p-3 text-sm border w-1/4">
                    <img
                      src={image.url || "/default-image.jpg"}
                      alt={`Image ${image._id}`}
                      className="h-12 w-12 rounded-md object-cover"
                    />
                  </td>
                  <td className="p-3 text-sm border w-1/2">{image._id}</td>
                  <td className="p-3 text-sm border w-1/4">
                    <button
                      onClick={() => removeImage(image._id)}
                      className="text-rose-600 hover:text-rose-900 focus:outline-none"
                    >
                      <TbTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-center items-center space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 text-sm border rounded-md ${
            currentPage === 1
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-white text-rose-600 border-rose-300 hover:bg-rose-100"
          }`}
        >
          Previous
        </button>

        {Array.from(
          { length: endPage - adjustedStartPage + 1 },
          (_, index) => adjustedStartPage + index
        ).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-4 py-2 text-sm border rounded-md ${
              currentPage === page
                ? "bg-gradient-to-r from-cyan-900 to-gray-600 text-white"
                : "bg-white text-rose-600 border-rose-300 hover:bg-rose-100"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 text-sm border rounded-md ${
            currentPage === totalPages
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-white text-rose-600 border-rose-300 hover:bg-rose-100"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ExcelImage;
