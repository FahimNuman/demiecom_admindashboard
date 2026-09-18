import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { TbTrash } from "react-icons/tb";
import AddInventoryModal from "../modals/AddInventoryModal";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

const List = ({ token }) => {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false); // State for InvoiceItemModal
  const [selectedInvoice, setSelectedInvoice] = useState(null); // State for selected invoice
  const [supplierInfo, setSupplierInfo] = useState({});
  const [formData, setFormData] = useState([
    // { url: "", sku: "", variation: { size: "", color: "" }, quantity: 0, unit_cost: 0 },
  ]);
  const [suppliers, setSuppliers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const currency = "$"; // Adjust based on your currency preference

  const handleOpen = () => {
    console.log("Opening AddInventoryModal"); // Debugging log
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleModalOpen = (invoice) => {
    console.log("Opening InvoiceItemModal with invoice:", invoice); // Debugging log
    setSelectedInvoice(invoice);
    setModalOpen(true);
  };
  const handleModalClose = () => setModalOpen(false);

  const backend_url = import.meta.env.VITE_BACKEND_URL;

  console.log("invoice data", invoices);

  // Fetch invoices from API
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${backend_url}/api/invoice/list`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}, // Include token if provided
      });
      const data = await response.json();

      console.log("data", data);

      if (data.status == "success") {
        setInvoices(data.invoices);
      } else {
        setError("Failed to fetch invoices");
      }
    } catch (err) {
      setError("Error fetching invoices");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
    getSuppliers();
  }, []);

  const getSuppliers = async () => {
    try {
      const response = await fetch(`${backend_url}/api/vendor/list`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}, // Include token if provided
      });
      const data = await response.json();

      if (data[0]?._id) {
        setSuppliers(data);
      } else {
        setError("Failed to fetch suppliers");
      }
    } catch (err) {
      setError("Error fetching suppliers");
      console.error(err);
    }
  };

  // Placeholder for remove functionality
  const removeProduct = async (id) => {
    try {
      const response = await fetch(`${backend_url}/api/invoice/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setInvoices(invoices.filter((item) => item._id !== id));
      } else {
        setError("Failed to remove invoice");
      }
    } catch (err) {
      setError("Error removing invoice");
      console.error(err);
    }
  };

  console.log("invoices", invoices);

  return (
    <>
      <div className="container mx-auto py-2 px-4">
        <div className="text-gray-800 p-4 flex justify-between">
          <div>
            <Breadcrumbs aria-label="breadcrumb">
              <Typography underline="hover" color="inherit">
                Invoice
              </Typography>
              <Typography sx={{ color: "text.primary" }}>Invoice List</Typography>
            </Breadcrumbs>
          </div>
          <div>
            <button
              onClick={handleOpen}
              className="px-2 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
            >
              Add Inventory
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-cyan-900 text-white">
                <th className="p-3 text-sm text-left font-semibold">Supplier Name</th>
                <th className="p-3 text-sm text-left font-semibold">Invoice Number</th>
                <th className="p-3 text-sm text-left font-semibold">Total Price</th>
                {/* <th className="p-3 text-sm text-left font-semibold">Type</th> */}
                <th className="p-3 text-sm text-left font-semibold">Received Date</th>
                <th className="p-3 text-sm text-left font-semibold">Items</th>
                <th className="p-3 text-sm text-left font-semibold">Container Seal Number</th>
                <th className="p-3 text-sm text-left font-semibold">Remove</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <tr key={index}>
                    {Array.from({ length: 6 }).map((_, colIndex) => (
                      <td key={colIndex} className="p-3">
                        <Skeleton height={30} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan="6" className="p-3 text-center text-gray-500 text-sm">
                    {error}
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-3 text-center text-gray-500 text-sm">
                    No invoices available.
                  </td>
                </tr>
              ) : (
                invoices.map((item, index) => (
                  <tr
                    key={item._id}
                    className={`transition ${index % 2 === 0 ? "bg-white" : "bg-rose-50"} hover:bg-rose-400`}
                  >
                    <td className="p-3 text-sm border">{item?.supplierId?.name}</td>
                    <td className="p-3 text-sm border">{item.invoiceNumber}</td>
                    <td className="p-3 text-sm border">
                      {currency}
                      {item.totalPrice.toFixed(2)}
                    </td>
                    {/* <td className="p-3 text-sm border">{item.invoiceType}</td> */}
                    <td className="p-3 text-sm border">
                      {new Date(item.receivedDate).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-sm border">
                      <button
                        onClick={() => handleModalOpen(item)}
                        className="px-2 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                      >
                        View Items
                      </button>
                    </td>
                    <td className="p-3 text-sm border">
                      can be added seal number
                    </td>
                    <td className="p-3 text-sm">
                      <button
                        onClick={() => removeProduct(item._id)}
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
      </div>

      <AddInventoryModal
        open={open}
        handleClose={handleClose}
        formData={formData}
        setFormData={setFormData}
        suppliers={suppliers}
        supplierInfo={supplierInfo}
        setSupplierInfo={setSupplierInfo}
      />

      {/* Invoice Items Modal */}
      <Dialog open={modalOpen} onClose={handleModalClose} maxWidth="md" fullWidth>
        <DialogTitle>Invoice Items</DialogTitle>
        <DialogContent>
          {selectedInvoice?.items?.length === 0 ? (
            <p className="text-gray-500">No items available.</p>
          ) : (
            <div className="space-y-4">
              {selectedInvoice?.items?.map((item) => (
                <div key={item._id} className="border-b pb-2 mb-2">
                  <p>
                    <span className="font-semibold">Item ID:</span> {item._id}
                  </p>
                  <p>
                    <span className="font-semibold">Product ID:</span> {item.productId}
                  </p>
                  <p>
                    <span className="font-semibold">Color:</span> {item.colorName}
                  </p>
                  <p>
                    <span className="font-semibold">Size:</span> {item.sizeName}
                  </p>
                  <p>
                    <span className="font-semibold">Quantity:</span> {item.quantity}
                  </p>
                  <p>
                    <span className="font-semibold">Price:</span> {currency}
                    {item.price.toFixed(2)}
                  </p>
                  <p>
                    <span className="font-semibold">Created At:</span>{" "}
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-semibold">Updated At:</span>{" "}
                    {new Date(item.updatedAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <button
            onClick={handleModalClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Close
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default List;