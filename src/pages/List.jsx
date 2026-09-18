import axios from "axios";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { toast } from "react-toastify";
import { TbEdit, TbTrash } from "react-icons/tb";
import { FaRegEyeSlash, FaRegSquareCheck, FaCopy, FaFileExport } from "react-icons/fa6";
import "react-toastify/dist/ReactToastify.css";
import { backend_url, currency } from "../App";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Cookies from "js-cookie";
import { Chip, Stack } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import * as XLSX from "xlsx";
import { useReactToPrint } from "react-to-print";
import { motion } from "framer-motion";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [costPriceShow, setCostPriceShow] = useState(false);
  const [otpShow, setOtpShow] = useState(false);
  const [eyeButtonShow, setEyeButtonShow] = useState(true);
  const [otp, setOtp] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [open, setOpen] = useState(false);
  const [openFirst, setOpenFirst] = useState(false);
  const [verifyPinModal, setVerifyPinModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [pinValue, setPinValue] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const itemsPerPage = 5;
  const [showVerifyInput, setShowVerifyInput] = useState(false);
  const [pin, setPin] = useState("");

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const [printAnchorEl, setPrintAnchorEl] = useState(null);
  const printMenuOpen = Boolean(printAnchorEl);

  const componentRef = useRef();

  const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text || "N/A";
    return `${text.substring(0, maxLength)}...`;
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handlePrintMenuClick = (event) => {
    setPrintAnchorEl(event.currentTarget);
  };

  const handlePrintMenuClose = () => {
    setPrintAnchorEl(null);
  };

  const handleViewDetails = () => {
    const selectedProduct = paginatedList.find((item) => selectedRows.includes(item._id));
    if (selectedProduct) {
      toast.info(`Viewing details for ${selectedProduct.name}`);
    }
    handleMenuClose();
  };

  const handleDuplicateProduct = () => {
    const selectedProduct = paginatedList.find((item) => selectedRows.includes(item._id));
    if (selectedProduct) {
      toast.info(`Duplicating product ${selectedProduct.name}`);
    }
    handleMenuClose();
  };

  const filteredList = useMemo(() => {
    return list.filter(
      (item) =>
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [list, searchQuery]);

  const totalItems = filteredList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedList = useMemo(() => {
    return filteredList.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredList, currentPage, itemsPerPage]);

  const handleExportExcel = () => {
    const exportData = paginatedList.map((item) => ({
      Image: item.colors?.[0]?.images?.[0]?.image || item.images?.[0]?.url || "N/A",
      Name: item.name || "N/A",
      Category: item.category || "N/A",
      SubCategory: item.subCategory || "N/A",
      CostPrice: costPriceShow && item.colors?.[0]?.sizes?.[0]?.costPrice != null
        ? `${currency} ${item.colors[0].sizes[0].costPrice.toFixed(2)}`
        : "N/A",
      Variations: item.colors?.length > 0
        ? item.colors
            .map((color) =>
              `${color.name || "Unknown Color"}: ${color.sizes
                ?.map(
                  (size) =>
                    `${size.name || "Unknown Size"} (${currency}${size.costPrice?.toFixed(2) || "0.00"}, Qty: ${
                      size.quantity || 0
                    })`
                )
                .join(", ") || "No sizes"}`
            )
            .join("; ")
        : "No variations",
      SKU: item.sku || "N/A",
      Brand: item.brand_name || "N/A",
      StyleID: item.style_id || "N/A",
      Popular: item.popular ? "Yes" : "No",
      Date: item.date ? new Date(item.date).toLocaleDateString() : "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    XLSX.writeFile(workbook, "products_list.xlsx");
    handlePrintMenuClose();
  };

  const handlePrintPDF = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Products_List",
    onAfterPrint: () => handlePrintMenuClose(),
  });

  const fetchList = useCallback(async () => {
    if (!token) {
      toast.error("Authentication token is missing");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`${backend_url}/api/product/list`, {
        headers: { token },
      });

      console.log("API Response:", JSON.stringify(response.data, null, 2));

      if (response.data.success) {
        setList(response.data.products || []);
        console.log("Updated list state:", JSON.stringify(response.data.products, null, 2));
      } else {
        toast.error(response.data.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error(error.response?.data?.message || "Error fetching products");
    } finally {
      setIsLoading(false);
      console.log("Loading state:", false);
    }
  }, [token]);

  const removeProduct = async (id) => {
    const confirmed = window.confirm("Are you sure you want to remove this product?");
    if (!confirmed) return;

    try {
      const response = await axios.delete(`${backend_url}/api/product/remove/${id}`, {
        headers: { token },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message || "Failed to remove product");
      }
    } catch (error) {
      console.error("Error removing product:", error);
      toast.error(error.response?.data?.message || "Error removing product");
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedList = [...list].sort((a, b) => {
      let aValue = a[key];
      let bValue = b[key];

      if (key === "costPrice") {
        aValue = a.colors?.[0]?.sizes?.[0]?.costPrice || 0;
        bValue = b.colors?.[0]?.sizes?.[0]?.costPrice || 0;
      }

      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setList(sortedList);
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "▲" : "▼";
    }
    return "";
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleShowModal = async () => {
    setOpenFirst(true);
  };

  const handleVerifyPin = async () => {
    setOpenFirst(false);
    setVerifyPinModal(true);
  };

  const handleShowCostPrice = async () => {
    setOpenFirst(false);
    setOpen(true);
    try {
      const response = await axios.post(`${backend_url}/api/product/sent-mail`);
      if (response?.data?.status === "success") {
        console.log("OTP email sent successfully");
        setOtpShow(true);
      } else {
        toast.error(response?.data?.message || "Failed to send OTP");
        setOpen(false);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error(error.response?.data?.message || "Error sending OTP");
      setOpen(false);
    }
  };

  const handleChange = (event) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      setOtp(value);
      setIsValid(value.length === 6);
    }
  };

  const handleSubmit = async () => {
    if (isValid) {
      try {
        const response = await axios.post(`${backend_url}/api/setting/otpVerify`, { otp });
        if (response.data.status === "success") {
          setEyeButtonShow(false);
          setOtpShow(false);
          setCostPriceShow(true);
          setTimeLeft(600);
          Cookies.set("code", "valid", { expires: 600 / (24 * 60 * 60) });
          setOpen(false);
        } else {
          toast.error("Enter Valid OTP!");
        }
      } catch (error) {
        console.error("Error verifying OTP:", error);
        toast.error(error.response?.data?.message || "Error verifying OTP");
      }
    }
  };

  const handlePinVerifySubmit = async () => {
    if (pinValue) {
      try {
        const response = await axios.post(`${backend_url}/api/setting/pinVerify`, { pin: pinValue });
        if (response.data.status === "success") {
          setPinValue("");
          setEyeButtonShow(false);
          setVerifyPinModal(false);
          setCostPriceShow(true);
          setTimeLeft(600);
          Cookies.set("code", "valid", { expires: 600 / (24 * 60 * 60) });
          setOpen(false);
        } else {
          toast.error("Enter Valid PIN!");
        }
      } catch (error) {
        console.error("Error verifying PIN:", error);
        toast.error(error.response?.data?.message || "Error verifying PIN");
      }
    } else {
      toast.error("Enter PIN Number!");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setOtpShow(false);
    setVerifyPinModal(false);
  };

  const formatTime = (seconds) => {
    if (seconds === null) return "00:00:00";
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setEyeButtonShow(true);
          setCostPriceShow(false);
          Cookies.remove("code");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (Cookies.get("code")) {
      setEyeButtonShow(false);
      setCostPriceShow(true);
      setTimeLeft(600);
    }

    const handleBeforeUnload = () => {
      Cookies.remove("code");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      Cookies.remove("code");
    };
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const handleEditOpen = (product) => {
    setEditProduct({
      id: product._id,
      name: product.name || "",
      price: product.price || "",
      sku: product.sku || "",
      category: product.category || "",
      subCategory: product.subCategory || "",
      brand_name: product.brand_name || "",
      style_id: product.style_id || "",
      popular: product.popular || false,
      colors: product.colors?.map((color) => ({
        _id: color._id,
        sizes: color.sizes?.map((size) => ({
          _id: size._id || size.size,
          name: size.name || "Unknown Size",
          price: size.price || 0,
          costPrice: size.costPrice || 0,
          quantity: size.quantity || 0,
          lowQuantity: size.lowQuantity || 0,
        })) || [],
      })) || [],
    });
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditProduct(null);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleColorSizeChange = (colorIndex, sizeIndex, field, value) => {
    setEditProduct((prev) => {
      const newColors = [...prev.colors];
      newColors[colorIndex].sizes[sizeIndex][field] = Number(value) || value;
      return { ...prev, colors: newColors };
    });
  };

  const handleEditSubmit = async () => {
    if (!editProduct) return;

    try {
      const response = await axios.put(
        `${backend_url}/api/product/update/${editProduct.id}`,
        editProduct,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
        handleEditClose();
      } else {
        toast.error(response.data.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(error.response?.data?.message || "Error updating product");
    }
  };

  const handleForgotPin = async () => {
    try {
      setShowVerifyInput(true);
      const response = await axios.post(`${backend_url}/api/setting/forgotpin`, { pin: pinValue });
      if (response.data.status === "success") {
        toast.success("PIN reset email sent successfully");
      } else {
        toast.error(response.data.message || "Failed to send PIN reset email");
      }
    } catch (error) {
      console.error("Error sending PIN reset email:", error);
      toast.error(error.response?.data?.message || "Error sending PIN reset email");
    }
  };

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === paginatedList.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedList.map((item) => item._id));
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success("Copied to clipboard!");
      })
      .catch((err) => {
        toast.error("Failed to copy text.");
        console.error("Copy failed:", err);
      });
  };

  return (
    <div className="container mx-auto py-2 px-4">
      <h3 className="text-xs font-semibold text-gray-800 mb-8">All Products List</h3>

      <div className="mb-6 flex items-center gap-4">
        <input
          type="text"
          placeholder="Search by name, category, or SKU"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1 w-full max-w-md shadow focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs"
        />
        {selectedRows.length > 0 && (
          <div className="flex items-center">
            <span className="text-gray-600 mr-3">{selectedRows.length} selected</span>
            <Tooltip title="Edit Selected Product(s)" placement="top">
              <button
                onClick={() =>
                  handleEditOpen(paginatedList.find((item) => selectedRows.includes(item._id)))
                }
                className="text-blue-600 hover:text-blue-900 focus:outline-none mx-1"
                aria-label="Edit selected product"
                disabled={selectedRows.length !== 1}
              >
                <TbEdit size={16} />
              </button>
            </Tooltip>
            <Tooltip title="Delete Selected Product(s)" placement="top">
              <motion.button
                onClick={() => removeProduct(selectedRows[0])}
                className="text-rose-600 hover:text-rose-900 focus:outline-none mx-1"
                aria-label="Delete selected product"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9, rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <TbTrash size={16} />
              </motion.button>
            </Tooltip>
            <Tooltip title="More Actions" placement="top">
              <IconButton
                onClick={handleMenuClick}
                className="text-gray-600 hover:text-gray-900 focus:outline-none mx-1"
                aria-label="More actions"
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem onClick={handleViewDetails}>View Details</MenuItem>
              <MenuItem onClick={handleDuplicateProduct}>Duplicate Product</MenuItem>
            </Menu>
          </div>
        )}
        <div className="flex items-end px-3 py-1">
          <Tooltip title="Export" placement="top">
            <IconButton
              onClick={handlePrintMenuClick}
              className="text-gray-600 hover:text-gray-900 focus:outline-none mx-1"
              aria-label="export"
            >
              <FaFileExport fontSize="small" className="mr-2 w-4 h-4 text-green-600" /> <p>Export</p>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={printAnchorEl}
            open={printMenuOpen}
            onClose={handlePrintMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={handleExportExcel}>Download as Excel</MenuItem>
            <MenuItem onClick={handlePrintPDF}>Download as PDF</MenuItem>
          </Menu>
        </div>
      </div>

      <div style={{ position: "absolute", visibility: "hidden" }}>
        <div ref={componentRef} className="p-4">
          <h3 className="text-lg font-semibold mb-4">All Products List</h3>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-cyan-900 to-cyan-700 text-white">
                <th className="p-2 text-xs text-left font-semibold">Image</th>
                <th className="p-2 text-xs text-left font-semibold">Name</th>
                <th className="p-2 text-xs text-left font-semibold">Category</th>
                <th className="p-2 text-xs text-left font-semibold">SubCategory</th>
                <th className="p-2 text-xs text-left font-semibold">Cost Price</th>
                <th className="p-2 text-xs text-left font-semibold">Variations</th>
                <th className="p-2 text-xs text-left font-semibold">SKU</th>
                <th className="p-2 text-xs text-left font-semibold">Brand</th>
                <th className="p-2 text-xs text-left font-semibold">Style ID</th>
                <th className="p-2 text-xs text-left font-semibold">Popular</th>
                <th className="p-2 text-xs text-left font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {paginatedList.length === 0 ? (
                <tr>
                  <td colSpan="11" className="p-2 text-center text-gray-500 text-xs">
                    No products available.
                  </td>
                </tr>
              ) : (
                paginatedList.map((item, index) => (
                  <tr
                    key={item._id}
                    className={index % 2 === 0 ? "bg-white" : "bg-rose-50"}
                  >
                    <td className="p-2 text-xs border">
                      {item.colors?.[0]?.images?.[0]?.image || item.images?.[0]?.url || "N/A"}
                    </td>
                    <td className="p-2 text-xs border">{item.name || "N/A"}</td>
                    <td className="p-2 text-xs border">{item.category || "N/A"}</td>
                    <td className="p-2 text-xs border">{item.subCategory || "N/A"}</td>
                    <td className="p-2 text-xs border">
                      {costPriceShow && item.colors?.[0]?.sizes?.[0]?.costPrice != null
                        ? `${currency} ${item.colors[0].sizes[0].costPrice.toFixed(2)}`
                        : "N/A"}
                    </td>
                    <td className="p-2 text-[10px] border">
                      {item.colors?.length === 0 ? (
                        <span className="text-gray-400 italic">No variations available</span>
                      ) : (
                        item.colors.map((color) => (
                          <div key={color._id || Math.random()} className="mb-1">
                            <div className="font-semibold">{color.name || "Unknown Color"}:</div>
                            {color.sizes?.length === 0 ? (
                              <span className="text-gray-400 italic">No sizes available</span>
                            ) : (
                              <span className="text-[10px]">
                                {color.sizes.map((size, index) => (
                                  <span key={size._id || index}>
                                    {size.name || "Unknown Size"} ({currency}
                                    {size.costPrice?.toFixed(2) || "0.00"}, Qty: {size.quantity || 0})
                                    {index < color.sizes.length - 1 && ", "}
                                  </span>
                                ))}
                              </span>
                            )}
                          </div>
                        ))
                      )}
                    </td>
                    <td className="p-2 text-xs border">{item.sku || "N/A"}</td>
                    <td className="p-2 text-xs border">{item.brand_name || "N/A"}</td>
                    <td className="p-2 text-xs border">{item.style_id || "N/A"}</td>
                    <td className="p-2 text-xs border">{item.popular ? "Yes" : "No"}</td>
                    <td className="p-2 text-xs border">
                      {item.date && !isNaN(new Date(item.date).getTime())
                        ? new Date(item.date).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-cyan-900 to-cyan-700 text-white">
              <th className="p-2 text-sm text-left font-semibold">
                <Tooltip title="Select All" placement="bottom">
                  <Checkbox
                    size="small"
                    checked={selectedRows.length === paginatedList.length && paginatedList.length > 0}
                    onChange={handleSelectAll}
                    sx={{ color: "white", "&.Mui-checked": { color: "white" } }}
                  />
                </Tooltip>
              </th>
              <th
                className="p-2 text-xs text-left font-semibold cursor-pointer"
                onClick={() => handleSort("image")}
              >
                Image {getSortIndicator("image")}
              </th>
              <th
                className="p-2 text-xs text-left font-semibold cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Name {getSortIndicator("name")}
              </th>
              <th
                className="p-2 text-xs text-left font-semibold cursor-pointer"
                onClick={() => handleSort("category")}
              >
                Category {getSortIndicator("category")}
              </th>
              <th
                className="p-2 text-xs text-left font-semibold cursor-pointer"
                onClick={() => handleSort("subCategory")}
              >
                SubCategory {getSortIndicator("subCategory")}
              </th>
              <th
                className="p-2 text-xs text-left font-semibold cursor-pointer"
                onClick={() => handleSort("costPrice")}
              >
                Cost Price {getSortIndicator("costPrice")} <br />
                {formatTime(timeLeft)}
              </th>
              <th className="p-2 text-xs text-left font-semibold">Variations</th>
              <th
                className="p-2 text-xs text-left font-semibold cursor-pointer"
                onClick={() => handleSort("sku")}
              >
                SKU {getSortIndicator("sku")}
              </th>
              <th
                className="p-2 text-xs text-left font-semibold cursor-pointer"
                onClick={() => handleSort("brand_name")}
              >
                Brand {getSortIndicator("brand_name")}
              </th>
              <th
                className="p-2 text-xs text-left font-semibold cursor-pointer"
                onClick={() => handleSort("style_id")}
              >
                Style ID {getSortIndicator("style_id")}
              </th>
              <th
                className="p-2 text-xs text-left font-semibold cursor-pointer"
                onClick={() => handleSort("popular")}
              >
                Popular {getSortIndicator("popular")}
              </th>
              <th
                className="p-2 text-xs text-left font-semibold cursor-pointer"
                onClick={() => handleSort("date")}
              >
                Date {getSortIndicator("date")}
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: itemsPerPage }).map((_, index) => (
                <tr key={index}>
                  {Array.from({ length: 12 }).map((_, cellIndex) => (
                    <td key={cellIndex} className="p-2">
                      <Skeleton height={20} />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedList.length === 0 ? (
              <tr>
                <td colSpan="12" className="p-2 text-center text-gray-500 text-xs">
                  No products available.
                </td>
              </tr>
            ) : (
              paginatedList.map((item, index) => (
                <tr
                  key={item._id}
                  className={`transition group ${
                    index % 2 === 0 ? "bg-white" : "bg-rose-50"
                  } hover:bg-rose-100`}
                >
                  <td className="p-2 text-xs border">
                    <Tooltip title="Select" placement="top">
                      <Checkbox
                        size="small"
                        checked={selectedRows.includes(item._id)}
                        onChange={() => handleRowSelect(item._id)}
                      />
                    </Tooltip>
                  </td>
                  <td className="p-2 text-xs border">
                    <img
                      src={
                        item.colors?.[0]?.images?.[0]?.image ||
                        item.images?.[0]?.url ||
                        "/default-image.jpg"
                      }
                      alt={item.name || "Product image"}
                      className="h-8 w-8 rounded-md object-cover"
                      onError={(e) => (e.target.src = "/default-image.jpg")}
                    />
                  </td>
                  <td className="p-2 text-xs border relative group">
                    <Tooltip title={item.name || "N/A"} placement="top">
                      <span>{truncateText(item.name, 20)}</span>
                    </Tooltip>
                    <Tooltip title="Copy Name" placement="top">
                      <button
                        onClick={() => handleCopy(item.name || "N/A")}
                        className="ml-2 text-gray-600 hover:text-gray-900 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Copy name"
                      >
                        <FaCopy size={14} />
                      </button>
                    </Tooltip>
                  </td>
                  <td className="p-2 text-xs border relative group">
                    <Tooltip title={item.category || "N/A"} placement="top">
                      <span>{truncateText(item.category, 20)}</span>
                    </Tooltip>
                    <Tooltip title="Copy Category" placement="top">
                      <button
                        onClick={() => handleCopy(item.category || "N/A")}
                        className="ml-2 text-gray-600 hover:text-gray-900 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Copy category"
                      >
                        <FaCopy size={14} />
                      </button>
                    </Tooltip>
                  </td>
                  <td className="p-2 text-xs border relative group">
                    <Tooltip title={item.subCategory || "N/A"} placement="top">
                      <span>{truncateText(item.subCategory, 20)}</span>
                    </Tooltip>
                    <Tooltip title="Copy SubCategory" placement="top">
                      <button
                        onClick={() => handleCopy(item.subCategory || "N/A")}
                        className="ml-2 text-gray-600 hover:text-gray-900 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Copy subcategory"
                      >
                        <FaCopy size={14} />
                      </button>
                    </Tooltip>
                  </td>
                  <td className="p-2 text-xs border">
                    {eyeButtonShow && <FaRegEyeSlash onClick={handleShowModal} />}
                    <p>retrieve cost</p>
                    {costPriceShow && (
                      <div>
                        <span>
                          {currency}{" "}
                          {item.colors?.[0]?.sizes?.[0]?.costPrice != null
                            ? item.colors[0].sizes[0].costPrice.toFixed(2)
                            : "N/A"}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="p-2 text-[10px] border">
                    {item.colors?.length === 0 ? (
                      <span className="text-gray-400 italic">No variations available</span>
                    ) : (
                      item.colors.map((color) => (
                        <div key={color._id || Math.random()} className="mb-1">
                          <div className="font-semibold">{color.name || "Unknown Color"}:</div>
                          {color.sizes?.length === 0 ? (
                            <span className="text-gray-400 italic">No sizes available</span>
                          ) : (
                            <span className="text-[10px]">
                              {color.sizes.map((size, sizeIndex) => (
                                <span key={size._id || sizeIndex}>
                                  {size.name || "Unknown Size"} ({currency}{size.price?.toFixed(2) || "0.00"},
                                  {size.costPrice?.toFixed(2) || "0.00"}, Qty: {size.quantity || 0})
                                  {sizeIndex < color.sizes.length - 1 && ", "}
                                </span>
                              ))}
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </td>
                  <td className="p-2 text-xs border relative group">
                    <Tooltip title={item.sku || "N/A"} placement="top">
                      <span>{truncateText(item.sku, 20)}</span>
                    </Tooltip>
                    <Tooltip title="Copy SKU" placement="top">
                      <button
                        onClick={() => handleCopy(item.sku || "N/A")}
                        className="ml-2 text-gray-600 hover:text-gray-900 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Copy SKU"
                      >
                        <FaCopy size={14} />
                      </button>
                    </Tooltip>
                  </td>
                  <td className="p-2 text-xs border relative group">
                    <Tooltip title={item.brand_name || "N/A"} placement="top">
                      <span>{truncateText(item.brand_name, 20)}</span>
                    </Tooltip>
                    <Tooltip title="Copy Brand" placement="top">
                      <button
                        onClick={() => handleCopy(item.brand_name || "N/A")}
                        className="ml-2 text-gray-600 hover:text-gray-900 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Copy brand"
                      >
                        <FaCopy size={14} />
                      </button>
                    </Tooltip>
                  </td>
                  <td className="p-2 text-xs border relative group">
                    <Tooltip title={item.style_id || "N/A"} placement="top">
                      <span>{truncateText(item.style_id, 20)}</span>
                    </Tooltip>
                    <Tooltip title="Copy Style ID" placement="top">
                      <button
                        onClick={() => handleCopy(item.style_id || "N/A")}
                        className="ml-2 text-gray-600 hover:text-gray-900 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Copy style ID"
                      >
                        <FaCopy size={14} />
                      </button>
                    </Tooltip>
                  </td>
                  <td className="p-2 text-xs border">{item.popular ? "Yes" : "No"}</td>
                  <td className="p-2 text-xs border relative group">
                    <Tooltip
                      title={
                        item.date && !isNaN(new Date(item.date).getTime())
                          ? new Date(item.date).toLocaleDateString()
                          : "N/A"
                      }
                      placement="top"
                    >
                      <span>
                        {truncateText(
                          item.date && !isNaN(new Date(item.date).getTime())
                            ? new Date(item.date).toLocaleDateString()
                            : "N/A",
                          20
                        )}
                      </span>
                    </Tooltip>
                    <Tooltip title="Copy Date" placement="top">
                      <button
                        onClick={() =>
                          handleCopy(
                            item.date && !isNaN(new Date(item.date).getTime())
                              ? new Date(item.date).toLocaleDateString()
                              : "N/A"
                          )
                        }
                        className="ml-2 text-gray-600 hover:text-gray-900 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Copy date"
                      >
                        <FaCopy size={14} />
                      </button>
                    </Tooltip>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-center">
        {totalPages > 1 &&
          Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`mx-1 px-3 py-1 text-xs border rounded-md ${
                currentPage === index + 1
                  ? "bg-gradient-to-r from-cyan-900 to-cyan-700 text-white"
                  : "bg-white text-rose-600 border-rose-300 hover:bg-rose-100"
              }`}
              aria-label={`Go to page ${index + 1}`}
            >
              {index + 1}
            </button>
          ))}
      </div>

      <Modal open={verifyPinModal} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <h2 className="text-lg font-semibold mb-4">Verify with PIN</h2>
          <hr />
          <div className="mt-3">
            <FormControl sx={{ width: "100%" }}>
              <input
                type="text"
                onChange={(e) => setPinValue(e.target.value)}
                value={pinValue}
                placeholder="Enter your pin"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="mt-2 text-right">
                {!showVerifyInput ? (
                  <button
                    type="button"
                    onClick={handleForgotPin}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Forgot PIN?
                  </button>
                ) : (
                  <div className="text-left mt-2">
                    <p>Check email for PIN in Super Admin Email</p>
                  </div>
                )}
              </div>
            </FormControl>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button onClick={() => setVerifyPinModal(false)} variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={handlePinVerifySubmit}
              variant="contained"
              color="primary"
              disabled={!pinValue}
            >
              Submit
            </Button>
          </div>
        </Box>
      </Modal>

      <Modal open={openFirst} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <h2 className="text-lg font-semibold mb-4">Select verify option</h2>
          <hr />
          <div className="mt-3">
            <Stack direction="column" spacing={1}>
              <div onClick={handleShowCostPrice} className="w-full cursor-pointer">
                <Chip
                  label="Verify with email"
                  variant="outlined"
                  className="w-full justify-start border-b-2 border-b-blue-500"
                />
              </div>
              <div onClick={handleVerifyPin} className="w-full cursor-pointer">
                <Chip
                  label="Verify with pin"
                  variant="outlined"
                  className="w-full justify-start"
                />
              </div>
            </Stack>
          </div>
          <hr />
          <div className="mt-4 flex justify-end gap-2">
            <Button onClick={() => setOpenFirst(false)} variant="outlined">
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <h2 className="text-lg font-semibold mb-4">Enter OTP</h2>
          {otpShow && (
            <FormControl
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#cbd5e0",
                    borderRadius: "12px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#90cdf4",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#fff",
                    boxShadow: "0 0 0 1px #4299e1",
                  },
                },
              }}
              variant="outlined"
            >
              <InputLabel
                sx={{
                  color: "#718096",
                  "&.Mui-focused": {
                    color: "#4299e1",
                  },
                }}
              >
                OTP Code
              </InputLabel>
              <OutlinedInput
                type="text"
                value={otp}
                onChange={handleChange}
                inputProps={{
                  maxLength: 6,
                  style: {
                    textAlign: "center",
                    letterSpacing: "8px",
                    fontSize: "1.2rem",
                    padding: "12px 14px",
                  },
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={handleSubmit}
                      sx={{
                        color: "green.500",
                        "&:hover": {
                          backgroundColor: "transparent",
                          color: "green.600",
                        },
                      }}
                    >
                      <FaRegSquareCheck size={24} />
                    </IconButton>
                  </InputAdornment>
                }
                label="OTP Code"
                sx={{
                  backgroundColor: "#f7fafc",
                  "& .MuiOutlinedInput-input": {
                    paddingRight: "40px",
                  },
                }}
              />
            </FormControl>
          )}
          <div className="mt-4 flex justify-end gap-2">
            <Button onClick={handleClose} variant="outlined">
              Cancel
            </Button>
            {otpShow && (
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                disabled={!isValid}
              >
                Submit
              </Button>
            )}
          </div>
        </Box>
      </Modal>

      <Modal open={editOpen} onClose={handleEditClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <h2 className="text-lg font-semibold mb-4">Edit Product</h2>
          {editProduct && (
            <form>
              <TextField
                label="Name"
                name="name"
                value={editProduct.name}
                onChange={handleEditChange}
                fullWidth
                margin="normal"
                size="small"
              />
              <TextField
                label="Price"
                name="price"
                type="number"
                value={editProduct.price}
                onChange={handleEditChange}
                fullWidth
                margin="normal"
                size="small"
              />
              <TextField
                label="SKU"
                name="sku"
                value={editProduct.sku}
                onChange={handleEditChange}
                fullWidth
                margin="normal"
                size="small"
              />
              <TextField
                label="Category"
                name="category"
                value={editProduct.category}
                onChange={handleEditChange}
                fullWidth
                margin="normal"
                size="small"
              />
              <TextField
                label="SubCategory"
                name="subCategory"
                value={editProduct.subCategory}
                onChange={handleEditChange}
                fullWidth
                margin="normal"
                size="small"
              />
              <TextField
                label="Brand Name"
                name="brand_name"
                value={editProduct.brand_name}
                onChange={handleEditChange}
                fullWidth
                margin="normal"
                size="small"
              />
              <TextField
                label="Style ID"
                name="style_id"
                value={editProduct.style_id}
                onChange={handleEditChange}
                fullWidth
                margin="normal"
                size="small"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={editProduct.popular}
                    onChange={handleEditChange}
                    name="popular"
                  />
                }
                label="Popular"
              />
              {editProduct.colors?.map((color, colorIndex) => (
                <div key={color._id || colorIndex} className="mt-4">
                  <h3 className="text-sm font-semibold">
                    Color {colorIndex + 1} ({color.name || "Unknown Color"})
                  </h3>
                  {color.sizes?.map((size, sizeIndex) => (
                    <div key={size._id || sizeIndex} className="ml-4 mt-2 flex gap-2">
                      <TextField
                        label="Size"
                        value={size.name || "Unknown Size"}
                        disabled
                        size="small"
                        margin="normal"
                        sx={{ width: 100 }}
                      />
                      <TextField
                        label="Price"
                        type="number"
                        value={size.price || 0}
                        onChange={(e) =>
                          handleColorSizeChange(colorIndex, sizeIndex, "price", e.target.value)
                        }
                        size="small"
                        margin="normal"
                        sx={{ width: 100 }}
                      />
                      <TextField
                        label="Cost Price"
                        type="number"
                        value={size.costPrice || 0}
                        onChange={(e) =>
                          handleColorSizeChange(colorIndex, sizeIndex, "costPrice", e.target.value)
                        }
                        size="small"
                        margin="normal"
                        sx={{ width: 100 }}
                      />
                      <TextField
                        label="Quantity"
                        type="number"
                        value={size.quantity || 0}
                        onChange={(e) =>
                          handleColorSizeChange(colorIndex, sizeIndex, "quantity", e.target.value)
                        }
                        size="small"
                        margin="normal"
                        sx={{ width: 100 }}
                      />
                      <TextField
                        label="Low Quantity"
                        type="number"
                        value={size.lowQuantity || 0}
                        onChange={(e) =>
                          handleColorSizeChange(colorIndex, sizeIndex, "lowQuantity", e.target.value)
                        }
                        size="small"
                        margin="normal"
                        sx={{ width: 100 }}
                      />
                    </div>
                  ))}
                </div>
              ))}
              <div className="mt-6 flex justify-end gap-2">
                <Button onClick={handleEditClose} variant="outlined">
                  Cancel
                </Button>
                <Button onClick={handleEditSubmit} variant="contained" color="primary">
                  Save
                </Button>
              </div>
            </form>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default List;