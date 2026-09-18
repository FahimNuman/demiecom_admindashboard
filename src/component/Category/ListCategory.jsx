import { useEffect, useState } from "react";
import axios from "axios";
import { backend_url } from "../../App.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SkeletonLoader = ({ rows = 5, columns = 4 }) => (
  <div className="animate-pulse">
    <table className="min-w-full border-collapse bg-white rounded-md text-xs">
      <thead>
        <tr className="bg-gray-100 border-b">
          {Array.from({ length: columns }).map((_, idx) => (
            <th key={idx} className="py-2 px-3 text-left font-semibold text-gray-500">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, idx) => (
          <tr key={idx} className="hover:bg-rose-50">
            {Array.from({ length: columns }).map((_, colIdx) => (
              <td key={colIdx} className="py-2 px-3 border-b">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ListCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true); // New loading state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });
  const [currentPage, setCurrentPage] = useState(1);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedSubCategories, setUpdatedSubCategories] = useState([]);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${backend_url}/api/category/list`);
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleDelete = async (categoryId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this category?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${backend_url}/api/category/${categoryId}`);
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category._id !== categoryId)
      );
      toast.success("Category deleted successfully!");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category. Please try again.");
    }
  };

  const handleUpdate = (category) => {
    setSelectedCategory(category);
    setUpdatedName(category.name);
    setUpdatedSubCategories(category.subCategories || []);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${backend_url}/api/category/${selectedCategory._id}`, {
        name: updatedName,
        subCategories: updatedSubCategories,
      });
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category._id === selectedCategory._id
            ? { ...category, name: updatedName, subCategories: updatedSubCategories }
            : category
        )
      );
      setIsUpdateModalOpen(false);
      toast.success("Category updated successfully!");
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category. Please try again.");
    }
  };

  const sortedCategories = [...categories].sort((a, b) => {
    if (sortConfig.key) {
      if (sortConfig.direction === "ascending") {
        return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
      } else {
        return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
      }
    }
    return 0;
  });

  const filteredCategories = sortedCategories.filter((category) =>
    (category.name && category.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (category.parentCategory && category.parentCategory.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (category.date && category.date.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  

  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  return (
    <div className="p-4 border bg-white shadow-sm rounded-md text-sm">
      <h1 className="text-lg font-bold mb-4">Category & SubCategory List</h1>

      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search categories..."
          className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>

      {loading ? (
        <SkeletonLoader rows={10} columns={4} />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse bg-white rounded-md text-xs">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th
                  className="py-2 px-3 text-left font-semibold text-gray-500 cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  Name
                </th>
                <th
                  className="py-2 px-3 text-left font-semibold text-gray-500 cursor-pointer"
                  onClick={() => handleSort("parentCategory")}
                >
                  Sub Category
                </th>
                {/* <th
                  className="py-2 px-3 text-left font-semibold text-gray-500 cursor-pointer"
                  onClick={() => handleSort("date")}
                >
                  Date
                </th> */}
                <th className="py-2 px-3 text-left font-semibold text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedCategories.map((category) => (
                <tr key={category._id} className="hover:bg-rose-50">
                  <td className="py-2 px-3 border-b border">{category.name}</td>
                  <td className="py-2 px-3 border-b border">
                    {category.subCategories && category.subCategories.length > 0 ? (
                      <ul className="list-disc pl-4">
                        {category.subCategories.map((sub, idx) => (
                          <li key={sub._id || idx} className="text-gray-500">
                            {sub.name}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  {/* <td className="py-2 px-3 border-b">{category.date || "N/A"}</td> */}
                  <td className="py-2 px-3 border-b">
                    <button
                      onClick={() => handleUpdate(category)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 text-xs"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="px-3 py-1 ml-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && (
        <div className="mt-4 flex justify-between items-center text-xs">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      )}

      {isUpdateModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-10">
          <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md mx-2">
            <h2 className="text-lg font-semibold mb-4">Update Category</h2>
            <form onSubmit={handleUpdateSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Name</label>
                <input
                  type="text"
                  value={updatedName}
                  onChange={(e) => setUpdatedName(e.target.value)}
                  className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Sub Categories</label>
                {updatedSubCategories.map((subCategory, idx) => (
                  <div key={idx} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={subCategory.name}
                      onChange={(e) =>
                        setUpdatedSubCategories((prevSubCategories) =>
                          prevSubCategories.map((sub, subIdx) =>
                            subIdx === idx ? { ...sub, name: e.target.value } : sub
                          )
                        )
                      }
                      className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setUpdatedSubCategories((prevSubCategories) =>
                          prevSubCategories.filter((_, subIdx) => subIdx !== idx)
                        )
                      }
                      className="ml-2 px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setUpdatedSubCategories((prevSubCategories) => [
                      ...prevSubCategories,
                      { name: "" },
                    ])
                  }
                  className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 mt-2"
                >
                  Add Sub Category
                </button>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default ListCategory;