import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { backend_url, currency } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import { FaEye } from "react-icons/fa";
import { RxEyeOpen } from "react-icons/rx";
import { FaRegEyeSlash } from "react-icons/fa";
import OrderItemModal from '../component/modals/OrderItemModal';
import { Box, Chip, Checkbox, FormControl, InputLabel, MenuItem, Select, Tooltip } from '@mui/material';

const Orders = ({ token }) => {
  const { status } = useParams();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectOrder, setSelectOrder] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [users, setUsers] = useState([]);

  console.log("status", status);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${backend_url}/api/orders/list`, {
        headers: { token },
        params: { status }, 
      });

      if (response.data.success) {
        setOrders(response?.data?.orders || []);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrdersOld = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${backend_url}/api/orders/list`, {
        headers: { token },
      });

      if (response.data.success) {
        setOrders(response?.data?.orders || []);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => setOpen(false);

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === orders.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(orders.map((item) => item._id));
    }
  };


  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${backend_url}/api/users/list`);
      if (response.data.success) {
        setUsers(response.data.users); // Updated to users
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

  const [selectedUser, setSelectedUser] = useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedUser(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  console.log("selectedUser", selectedUser);

  const handleDelete = (userIdToDelete) => {
    setSelectedUser((users) => users.filter((userId) => userId !== userIdToDelete));
  };


  const handleAssign = async () => {
    if (selectedRows.length === 0) return toast.error("Please select at least one order to assign");
    if (selectedUser.length === 0) return toast.error("Please select a user to assign");

    const formData = {
      orderIds: selectedRows,
      userId: selectedUser,
    };

    console.log("formData", formData);


    try {
      setIsLoading(true);
      const response = await axios.post(`${backend_url}/api/orders/assign`, formData);



      console.log("response", response?.data);

      if (response?.data?.success) {
        setOrders(response?.data?.orders || []);
        toast.success(response?.data?.message || "Orders assigned successfully");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };



  useEffect(() => {
    fetchOrders();
    fetchUsers();
  }, [status]);

  // console.log("Users::", users);

  return (
    <div className="flex flex-col min-h-screen w-full justify-between px-6">
      <main className="mx-auto bg-white rounded-lg shadow-lg border border-gray-200 p-6 my-6 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <h2 className="text-xl text-gray-800">Order List</h2>
        </div>

        {/* Search Filter */}
        {/* <TableFilter searchTerm={searchTerm} setSearchTerm={handleSearchChange} /> */}

        <div className='flex justify-between w-1/4 gap-4'>
          <FormControl fullWidth>
            <InputLabel id="user-select-label">User</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              multiple
              value={selectedUser}
              label="User"
              onChange={handleChange}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const user = users.find((user) => user.id === value);
                    return <Chip
                      key={value}
                      label={user ? user.name : ''}
                      onDelete={() => handleDelete(value)}
                      onMouseDown={(event) => {
                        event.stopPropagation();
                      }}
                    />;
                  })}
                </Box>
              )}
            >
              {
                users && users.length > 0 &&
                users.map((user, index) => (
                  <MenuItem value={user.id} key={index}>
                    {user.name}
                  </MenuItem>
                ))
              }
            </Select>
          </FormControl>
          <button
            onClick={handleAssign}
            className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-300"
          >
            Assign
          </button>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto rounded-md border border-gray-300 mt-4">



          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-cyan-900 to-cyan-700 text-white">
                <th className="p-2 text-sm text-left font-semibold">
                  <Tooltip title="Select All" placement="bottom">
                    <Checkbox
                      size="small"
                      checked={selectedRows.length === orders.length && orders.length > 0}
                      onChange={handleSelectAll}
                      sx={{ color: "white", "&.Mui-checked": { color: "white" } }}
                    />
                  </Tooltip>
                </th>
                <th className="p-2 text-xs text-left font-semibold">Order Number</th>
                <th className="p-2 text-xs text-left font-semibold">Invoice Number</th>
                <th className="p-2 text-xs text-left font-semibold">Product Name</th>
                {/* <th className="p-2 text-xs text-left font-semibold">Date</th> */}
                <th className="p-2 text-xs text-left font-semibold">Customer Name</th>
                <th className="p-2 text-xs text-left font-semibold">Customer Email</th>
                <th className="p-2 text-xs text-left font-semibold">Customer Mobile</th>
                <th className="p-2 text-xs text-left font-semibold">Address</th>
                <th className="p-2 text-xs text-left font-semibold">SKU</th>
                <th className="p-2 text-xs text-left font-semibold">Category</th>
                <th className="p-2 text-xs text-left font-semibold">Brand</th>
                <th className="p-2 text-xs text-left font-semibold">Payment Mode</th>
                <th className="p-2 text-xs text-left font-semibold">Total Amount</th>
                <th className="p-2 text-xs text-left font-semibold">Status</th>
                <th className="p-2 text-xs text-left font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="10">
                    <Skeleton count={10} height={40} />
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => (
                  <tr
                    className=" bg-white cursor-pointer"
                    key={index}
                    onClick={() => {
                      setSelectOrder(order);
                      setOpen(true);
                    }}
                  >
                    <td className="p-2 text-xs border" onClick={(e) => e.stopPropagation()}>
                      <Tooltip title="Select" placement="top">
                        <Checkbox
                          size="small"
                          checked={selectedRows.includes(order._id)}
                          onChange={() => handleRowSelect(order._id)}
                        />
                      </Tooltip>
                    </td>
                    <td className="p-2 text-xs border">
                      {order?._id}
                    </td>
                    <td className="p-2 text-xs border" onClick={(e) => e.stopPropagation()}>{order?.invoiceNumber}</td>
                    <td className="p-2 text-xs border">{order?.productId?.name}</td>
                    <td className="p-2 text-xs border">{order?.customerName}</td>
                    <td className="p-2 text-xs border">{order?.email}</td>
                    <td className="p-2 text-xs text-[10px] border">{order?.mobile}</td>
                    <td className="p-2 text-xs border">Dhaka</td>
                    <td className="p-2 text-xs border">{order?.productId?.sku}</td>
                    <td className="p-2 text-xs border">{order?.productId?.category}</td>
                    <td className="p-2 text-xs border">{order?.productId?.brand_name}</td>
                    <td className="p-2 text-xs border">{order?.paymentDetails?.method}</td>
                    <td className="p-2 text-xs border">{order?.totalAmount}</td>
                    <td className="p-2 text-xs border">{order?.status}</td>
                    <td className="p-2 text-xs border" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectOrder(order);
                          setOpen(true);
                        }}
                        aria-label="View Details"
                        className="p-2 rounded hover:bg-gray-100 transition"
                      >
                        <FaEye className="h-4 w-4 text-gray-700" />
                      </button>
                    </td>
                  </tr>
                ))
              )}



            </tbody>
          </table>
        </div>

        <OrderItemModal open={open} handleClose={handleClose} selectOrder={selectOrder} />
      </main>

    </div>
  )
}

export default Orders