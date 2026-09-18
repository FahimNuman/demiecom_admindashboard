import { useEffect, useState } from "react";
import { backend_url } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import { FaShoppingCart, FaUsers, FaThList, FaBox } from "react-icons/fa"; // Import icons

const Dashboard = () => {
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${backend_url}/api/category/list`);
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${backend_url}/api/orders/list`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setOrders(response.data.orders);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch orders.");
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, [token]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${backend_url}/api/users/list`);
        if (response.data.success) {
          setUsers(response.data.users);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users.");
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  const fetchProductlist = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${backend_url}/api/product/list`);
      if (response.data.success) {
        setList(response.data.products);
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

  useEffect(() => {
    fetchProductlist();
  }, []);

  const data = [
    {
      title: "Orders",
      value: (
        <div className="flex flex-col items-center justify-center">
          <span className="text-xl font-semibold text-white">
            {loadingOrders ? "Loading..." : orders.length}
          </span>
          {!loadingOrders && orders.length > 0 && (
            <button
              onClick={() => (window.location.href = "/orders")}
              className=" px-4 py-1 text-sm font-medium text-white bg-blue-300 rounded-lg shadow hover:bg-blue-400 transition-transform transform hover:scale-105"
            >
              View Orders
            </button>
          )}
        </div>
      ),
      bgColor: "bg-gradient-to-r from-blue-500 to-blue-700",
      icon: <FaShoppingCart className="text-white text-3xl mb-3" />, // Add icon
    },
    {
      title: "Users",
      value: (
        <div className="flex flex-col items-center justify-center">
          <span className="text-xl font-semibold text-white">
            {loadingUsers ? "Loading..." : users.length}
          </span>
          {!loadingUsers && users.length > 0 && (
            <button
              onClick={() => (window.location.href = "/users")}
              className=" px-4 py-1 text-sm font-medium text-white bg-green-300 rounded-lg shadow hover:bg-green-400 transition-transform transform hover:scale-105"
            >
              View Users
            </button>
          )}
        </div>
      ),
      bgColor: "bg-gradient-to-r from-green-500 to-green-700",
      icon: <FaUsers className="text-white text-3xl mb-3" />, // Add icon
    },
    {
      title: "Categories",
      value: (
        <div className="flex flex-col items-center justify-center">
          <span className="text-xl font-semibold text-white">
            {loading ? "Loading..." : categories.length}
          </span>
          {!loading && categories.length > 0 && (
            <button
              onClick={() => (window.location.href = "/category")}
              className=" px-4 py-1 text-sm font-medium text-white bg-yellow-400 rounded-lg shadow hover:bg-yellow-500 transition-transform transform hover:scale-105"
            >
              View Categories
            </button>
          )}
        </div>
      ),
      bgColor: "bg-gradient-to-r from-yellow-500 to-yellow-700",
      icon: <FaThList className="text-white text-3xl mb-3" />, // Add icon
    },
    {
      title: "Products",
      value: (
        <div className="flex flex-col items-center justify-center">
          <span className="text-xl font-semibold text-white">
            {isLoading ? "Loading..." : list.length}
          </span>
          {!isLoading && list.length > 0 && (
            <button
              onClick={() => (window.location.href = "/list")}
              className=" px-4 py-1 text-sm font-medium text-white bg-purple-400 rounded-lg shadow hover:bg-purple-500 transition-transform transform hover:scale-105"
            >
              View Products
            </button>
          )}
        </div>
      ),
      bgColor: "bg-gradient-to-r from-purple-500 to-purple-700",
      icon: <FaBox className="text-white text-3xl mb-3" />, // Add icon
    },
  ];

  return (
    <div className="container mx-auto py-4 px-4">
      <h1 className="text-lg font-bold text-gray-700 mb-4">Dashboard</h1>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
      >
        {data.map((item, index) => (
          <div
            key={index}
            className={`p-3 sm:p-4 lg:p-2 xl:p-1 rounded-lg shadow-lg ${item.bgColor} text-center`}
          >
            <div>{item.icon}</div>
            <h3 className="text-sm md:text-md font-medium mb-2 text-white">
              {item.title}
            </h3>
            <div>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
