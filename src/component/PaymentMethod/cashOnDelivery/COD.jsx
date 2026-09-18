import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";

import { RxEyeOpen } from "react-icons/rx";
import { FaRegEyeSlash } from "react-icons/fa";


import { backend_url, currency } from "../../../App";
import Invoice from "../../OrderInvoice/Invoice";

const COD = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [readStatus, setReadStatus] = useState({});
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    const storedStatus = JSON.parse(localStorage.getItem("readStatus")) || {};
    setReadStatus(storedStatus);
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${backend_url}/api/orders/list`, {
        headers: { token },
      });
      if (response.data.success) {
        setOrders(response.data.orders);
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
    fetchOrders();
  }, []);

  // Filter orders with payment method "cod"
  const codOrders = orders.filter(order => order.paymentDetails?.method === "cod");

  // Pagination Logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = codOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(codOrders.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto py-2 px-4">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-sm font-semibold text-gray-800">Order List (COD Only)</h3>
        <h3 className="text-sm font-semibold text-gray-800">
          Total COD Orders: {codOrders.length}
        </h3>
      </div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gradient-to-r bg-cyan-900 text-white">
              <th className="p-3 text-sm text-left font-semibold">Order ID</th>
              <th className="p-3 text-sm text-left font-semibold">User ID</th>
              <th className="p-3 text-sm text-left font-semibold">Total</th>
              <th className="p-3 text-sm text-left font-semibold">Status</th>
              <th className="p-3 text-sm text-left font-semibold">Payment Method</th>
              <th className="p-3 text-sm text-left font-semibold">Address</th>
              <th className="p-3 text-sm text-left font-semibold">Created At</th>
              <th className="p-3 text-sm text-left font-semibold">Updated At</th>
              <th className="p-3 text-sm text-left font-semibold">Invoice</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 10 }).map((_, index) => (
                <tr key={index}>
                  {Array.from({ length: 9 }).map((_, index) => (
                    <td key={index} className="p-3">
                      <Skeleton height={30} />
                    </td>
                  ))}
                </tr>
              ))
            ) : currentOrders.length === 0 ? (
              <tr>
                <td
                  colSpan="9"
                  className="p-3 text-center text-gray-500 text-sm"
                >
                  No COD orders available.
                </td>
              </tr>
            ) : (
              currentOrders.map((order) => {
                const isRead = readStatus[order._id];
                return (
                  <tr
                    key={order._id}
                    className={`hover:bg-rose-100 transition ${
                      isRead ? "bg-white-100" : "bg-yellow-200"
                    }`}
                  >
                    <td className="p-3 text-sm border">{order._id}</td>
                    <td className="p-3 text-sm border">{order.user}</td>
                    <td className="p-3 text-sm border">
                      {currency} {order.total}
                    </td>
                    <td className="p-3 text-sm border">{order.status}</td>
                    <td className="p-3 text-sm border">
                      {order.paymentDetails.method}
                    </td>
                    <td className="p-3 text-sm border">
                      {order.address.street}, {order.address.city},{" "}
                      {order.address.state}, {order.address.zip},{" "}
                      {order.address.country}
                    </td>
                    <td className="p-3 text-sm border">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-sm border">
                      {new Date(order.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-sm text-gray-700">
                      <button
                        className={`px-4 py-2 rounded ${
                          isRead ? "bg-green-500" : "bg-blue-500"
                        } text-white text-sm hover:${
                          isRead ? "bg-green-600" : "bg-blue-600"
                        }`}
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowInvoice(true);
                          setReadStatus((prevStatus) => {
                            const updatedStatus = {
                              ...prevStatus,
                              [order._id]: true,
                            };
                            localStorage.setItem(
                              "readStatus",
                              JSON.stringify(updatedStatus)
                            );
                            return updatedStatus;
                          });
                        }}
                      >
                        {isRead ? <RxEyeOpen /> : <FaRegEyeSlash />}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => paginate(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {showInvoice && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 p-6 relative">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => setShowInvoice(false)}
              >
                ×
              </button>
              <Invoice order={selectedOrder} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default COD;