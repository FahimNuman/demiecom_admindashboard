import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { TbTrash } from "react-icons/tb";
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "react-loading-skeleton"; // Import the Skeleton component
import "react-loading-skeleton/dist/skeleton.css"; // Import the CSS for skeleton loading
import { backend_url } from "../App";

const Customer = ({ token }) => {
  const [list, setList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 5;

  // Fetch User List
  const fetchList = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${backend_url}/api/users/list`);
      if (response.data.success) {
        setList(response.data.users); // Updated to users
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Remove User
  const removeUser = async (id) => {
    const confirmed = window.confirm("Are you sure you want to remove this user?");
    if (!confirmed) return;

    try {
      const response = await axios.post(
        `${backend_url}/api/users/remove`, // Updated endpoint
        { id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  // Sorting functionality
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedList = [...list].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setList(sortedList);
  };

  // Get sort indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "▲" : "▼";
    }
    return "";
  };

  // Filter user list
  const filteredList = list.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) // Search by email too
  );

  const totalItems = filteredList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedList = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="container mx-auto py-2 px-4">
      <h3 className="text-1xl font-bold text-gray-800 mb-8">All User List</h3>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-md shadow focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gradient-to-r bg-cyan-900 text-white">
              <th
                className="p-3 text-left font-semibold cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Name {getSortIndicator("name")}
              </th>
              <th
                className="p-3 text-left font-semibold cursor-pointer"
                onClick={() => handleSort("email")}
              >
                Email {getSortIndicator("email")}
              </th>
              <th className="p-3 text-left font-semibold">Remove</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <tr key={index}>
                  <td className="p-3">
                    <Skeleton height={40} />
                  </td>
                  <td className="p-3">
                    <Skeleton height={40} />
                  </td>
                  <td className="p-3">
                    <Skeleton circle width={40} height={40} />
                  </td>
                </tr>
              ))
            ) : paginatedList.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-3 text-center text-gray-500">
                  No users available.
                </td>
              </tr>
            ) : (
              paginatedList.map((item, index) => (
                <tr
                  key={item._id}
                  className={`hover:bg-rose-400 transition ${
                    index % 2 === 0 ? "bg-white" : "bg-rose-50"
                  }`}
                >
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">{item.email}</td>
                  <td className="p-3">
                    <button
                      onClick={() => removeUser(item._id)}
                      className="text-rose-600 hover:text-rose-900 focus:outline-none"
                    >
                      <TbTrash size={24} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`mx-1 px-4 py-2 border rounded-md ${
              currentPage === index + 1
                ? "bg-gradient-to-r from-rose-400 to-rose-600 text-white"
                : "bg-white text-rose-600 border-rose-600"
            } hover:bg-gradient-to-r hover:from-rose-400 hover:to-rose-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-rose-500`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Customer;
