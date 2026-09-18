import { useEffect, useState } from "react";
import axios from "axios";
import { backend_url } from "../../App.jsx";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ListSize = () => {
  const [sizes, setSizes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchSizes = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${backend_url}/api/size/list`);
        setSizes(response.data.sizes);
      } catch (error) {
        console.error("Error fetching sizes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSizes();
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this size?")) {
      try {
        await axios.delete(`${backend_url}/api/size/${id}`);
        setSizes((prevSizes) => prevSizes.filter((size) => size._id !== id));
        alert("Size deleted successfully.");
      } catch (error) {
        console.error("Error deleting size:", error);
        alert("Failed to delete size.");
      }
    }
  };

  const sortedSizes = sizes.sort((a, b) => {
    if (sortConfig.key) {
      if (sortConfig.direction === "ascending") {
        return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
      } else {
        return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
      }
    }
    return 0;
  });

  const filteredSizes = sortedSizes.filter((size) =>
    size.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    size.size_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    size.date.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedSizes = filteredSizes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredSizes.length / itemsPerPage);

  return (
    <div className="p-4 border rounded-lg px-5 py-5 bg-slate-50">
      <h1 className="text-xl font-bold mb-4">Size List</h1>

      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search..."
          className="px-4 py-2 border border-gray-300 rounded"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th
                className="py-2 px-4 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Name
              </th>
              <th
                className="py-2 px-4 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("size_id")}
              >
                ID
              </th>
              {/* <th
                className="py-2 px-4 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("date")}
              >
                Date
              </th> */}
              {/* <th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th> */}
              <th className="py-2 px-4 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array(itemsPerPage)
                .fill()
                .map((_, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b border-gray-200">
                      <Skeleton />
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      <Skeleton />
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      <Skeleton />
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      <Skeleton />
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      <Skeleton width={80} />
                    </td>
                  </tr>
                ))
            ) : (
              paginatedSizes.map((size) => (
                <tr key={size._id}>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700">
                    {size.name}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700">
                    {size.size_id}
                  </td>
                  {/* <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700">
                    {size.date}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700">
                    {size.size}
                  </td> */}
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700">
                    <button
                      onClick={() => handleDelete(size._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ListSize;
