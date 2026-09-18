import CloseIcon from "@mui/icons-material/Close";
import {
  Backdrop,
  Box,
  Button,
  Divider,
  Fade,
  Grid,
  IconButton,
  Modal,
  Typography,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// Adjusted modal style with flex to position submit button at bottom-right
const lightStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 400, md: 1200 },
  height: { xs: "60vh", md: "70vh" },
  bgcolor: "#fff",
  border: "2px solid #1f1f1f",
  borderRadius: 2,
  p: 3,
  display: "flex",
  flexDirection: "column",
  overflowY: "auto",
};

const AddInventoryModal = ({ open, handleClose, formData, setFormData, suppliers, supplierInfo, setSupplierInfo }) => {
  const [searchSKU, setSearchSKU] = useState("");
  const [productItem, setProductItem] = useState([]);
  const [allProduct, setAllProduct] = useState([]);
  const [productData, setProductData] = useState({});
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [activeGlobalSearchOpen, setActiveGlobalSearchOpen] = useState({});
  const [loading, setLoading] = useState(false);
  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const globalSearchButtonRef = useRef(null);

  const fetchProductBySKU = async (sku) => {
    try {
      const response = await fetch(`${backend_url}/api/product/list`);
      const data = await response.json();

      if (data.success) {
        const product = data.products.find((p) => p.sku === sku);

        if (product) {
          setProductData(product);
          const newRows = [];
          product.colors.forEach((color) => {
            color.sizes.forEach((size) => {
              newRows.push({
                id: formData.length + newRows.length,
                url: color.images[0]?.image || product.images[0]?.url || "",
                sku: product.sku,
                variation: {
                  size: size.name,
                  sizeId: size._id,
                  color: color.name,
                  colorId: color._id,
                },
                quantity: 1,
                unit_cost: size?.costPrice || 0,
              });
            });
          });
          setAllProduct((prev) => [...prev, ...newRows]);
        } else {
          toast.error("Product not found");
        }
      } else {
        toast.error("Failed to fetch products");
      }
    } catch (error) {
      toast.error("Error fetching product");
    }
  };

  const handleSearch = () => {
    setAllProduct([]);
    setFormData([]);
    if (searchSKU) {
      fetchProductBySKU(searchSKU);
      setSearchSKU("");
    } else {
      toast.warn("Please enter a SKU to search");
    }
  };

  const removeRow = (rowIndex) => {
    setFormData((prevFormData) => {
      const removedItem = prevFormData[rowIndex];
      
      if (removedItem.sku && removedItem.variation.size && removedItem.variation.color) {
        setAllProduct((prevAllProduct) => [...prevAllProduct, removedItem]);
      }
      
      return prevFormData.filter((_, i) => i !== rowIndex);
    });
  };

  const handleVariationChange = (index) => {
    const selectedProduct = allProduct[index];

    if (selectedProduct) {
      setFormData((prev) => [...prev, selectedProduct]);
      setAllProduct((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSelectAll = () => {
    setFormData((prevFormData) => [...prevFormData, ...allProduct]);
    setAllProduct([]);
  };

  const handleSubmit = async () => {
    if (!supplierInfo.invoiceNumber || !supplierInfo.supplierId || !formData.length) {
      toast.error("Please fill all required fields");
      return;
    }

    const data = {
      productId: productData._id,
      invoiceNumber: supplierInfo.invoiceNumber,
      supplierId: supplierInfo.supplierId,
      items: formData,
    };

    try {
      const response = await axios.post(`${backend_url}/api/product/addInventory`, data);
      
      if (response.data.status === 'success') {
        toast.success(response.data.message);
        setFormData([]);
        setSupplierInfo({});
        setAllProduct([]);
        setProductData({});
        handleClose();
      } else {
        toast.error(response.data.message || "Failed to add inventory");
      }
    } catch (error) {
      console.error("Error submitting inventory:", error);
      toast.error("Error submitting inventory");
    }
  };

  useEffect(() => {
    return () => {
      setAllProduct([]);
      setProductData({});
    };
  }, []);

  const handleGlobalSearch = async () => {
    setGlobalSearchOpen(!globalSearchOpen);
    if (!globalSearchOpen) {
      setLoading(true);
      try {
        const response = await axios.get(`${backend_url}/api/product/list`);
  
        if (response?.data?.success) {
          const newProducts = response.data.products;
  
          setProductItem(prevData => {
            const filtered = newProducts.filter(
              newProduct => !prevData.some(existing => existing.id === newProduct.id)
            );
  
            if (filtered.length === 0) {
              return prevData;
            }
  
            return [...prevData, ...filtered];
          });
        }
      } catch (error) {
        toast.error("Error fetching products");
      } finally {
        setLoading(false);
      }
    }
  };

  const options = productItem.map(item => ({
    label: item.name,
    id: item.sku,
    image: item.colors[0]?.images[0]?.image || item.images[0]?.url || "",
    brand: item.brand_name,
    price: item.price || 0,
    variations: item.colors.flatMap(color =>
      color.sizes.map(size => `${color.name} - ${size.name}`)
    ).join(', ')
  }));

  const handleSelect = (event, value) => {
    setAllProduct([]);
    setFormData([]);

    const product = productItem.find((p) => p.sku === value?.id);

    if (product) {
      setProductData(product);
      const newRows = [];
      product.colors.forEach((color) => {
        color.sizes.forEach((size) => {
          newRows.push({
            id: formData.length + newRows.length,
            url: color.images[0]?.image || product.images[0]?.url || "",
            sku: product.sku,
            variation: {
              size: size.name,
              sizeId: size._id,
              color: color.name,
              colorId: color._id,
            },
            quantity: 1,
            unit_cost: size?.costPrice || 0,
          });
        });
      });
      setAllProduct((prev) => [...prev, ...newRows]);
      setGlobalSearchOpen(false);
    } else {
      toast.error("Product not found");
    }
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          sx: {
            backdropFilter: "blur(5px)",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          },
        },
      }}
    >
      <Fade in={open}>
        <Box sx={lightStyle}>
          {/* Modal Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6">Add Inventory</Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ marginY: 2 }} />

          {/* Modal Body */}
          <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
            <Grid container spacing={2}>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Invoice Number"
                  variant="outlined"
                  size="small"
                  value={supplierInfo.invoiceNumber || ""}
                  onChange={(e) => setSupplierInfo({ ...supplierInfo, invoiceNumber: e.target.value })}
                />
              </Grid>

              <Grid size={12}>
                <FormControl fullWidth size="small">
                  <InputLabel>Vendor</InputLabel>
                  <Select
                    label="Vendor"
                    value={supplierInfo.supplierId || ""}
                    onChange={(e) => setSupplierInfo({ ...supplierInfo, supplierId: e.target.value })}
                  >
                    {suppliers?.map((supplier) => (
                      <MenuItem key={supplier._id} value={supplier._id}>
                        {supplier.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={12}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={8} md={10}>
                    <TextField
                      fullWidth
                      label="Search by product SKU"
                      variant="outlined"
                      size="small"
                      value={searchSKU}
                      onChange={(e) => setSearchSKU(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={2} md={1}>
                    <Button fullWidth variant="contained" color="primary" size="medium" onClick={handleSearch}>
                      Search
                    </Button>
                  </Grid>
                  <Grid item xs={2} md={1}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="success"
                      size="medium"
                      onClick={handleGlobalSearch}
                      ref={globalSearchButtonRef}
                    >
                      Global Search
                    </Button>
                  </Grid>
                </Grid>
              </Grid>

              {/* Global Search Dropdown */}
              {globalSearchOpen && (
                <Grid size={12} sx={{ position: "relative", mt: 1 }}>
                  <Box
                    sx={{
                      width: "100%",
                      bgcolor: "#fff",
                      border: "1px solid #1f1f1f",
                      borderRadius: 1,
                      boxShadow: 3,
                      zIndex: 1300,
                      p: 1,
                    }}
                  >
                    {loading ? (
                      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100px" }}>
                        <CircularProgress />
                      </Box>
                    ) : (
                      <Autocomplete
                        open
                        disablePortal
                        options={options}
                        getOptionLabel={(option) => option.label}
                        onChange={handleSelect}
                        onClose={() => setGlobalSearchOpen(false)}
                        PaperProps={{
                          style: {
                            maxHeight: options.length > 4 ? 240 : "auto",
                            overflowY: options.length > 4 ? "auto" : "visible",
                            width: "100%",
                            borderRadius: "4px",
                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                          },
                        }}
                        renderOption={(props, option) => (
                          <li {...props} style={{ display: "flex", alignItems: "center", padding: "8px" }}>
                            <img
                              src={option.image}
                              alt={option.label}
                              style={{ width: "40px", height: "40px", marginRight: "10px", objectFit: "contain" }}
                            />
                            <div>
                              <Typography variant="body2">{option.label}</Typography>
                              <Typography variant="caption" color="textSecondary">
                                Brand: {option.brand} | Price: ${option.price} | Variations: {option.variations}
                              </Typography>
                            </div>
                          </li>
                        )}
                        renderInput={(params) => <TextField {...params} label="Search" />}
                      />
                    )}
                  </Box>
                </Grid>
              )}

              {allProduct?.length > 0 && (
  <div className="bg-gray-100 h-40 w-full">
    <div className="grid grid-cols-5 gap-4 h-40 overflow-y-auto p-2">
      {allProduct.map((data, index) => (
        <div
          key={index}
          className="p-2 h-auto bg-white flex items-center gap-2 rounded-md cursor-pointer border border-gray-200 shadow-sm"
          style={{ minHeight: '40px' }}
        >
          <div className="flex items-center">
            <input
              type="checkbox"
              className="w-4 h-4"
              onChange={() => handleVariationChange(index)}
            />
          </div>
          <div
            className="w-12 h-12 rounded"
            style={{ backgroundColor: data.variation.color.toLowerCase() === 'red' ? '#ff0000' : '#ccc' }}
          ></div>
          <div>
            <Typography variant="caption" color="textSecondary">
              SELECTED OPTIONS
            </Typography>
            <Typography variant="body2">
              Size: {data.variation.size} • Color:{' '}
              <span style={{ color: data.variation.color.toLowerCase() === 'red' ? '#ff0000' : '#000' }}>
                {data.variation.color}
              </span>
            </Typography>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
            </Grid>

            <TableContainer sx={{ marginTop: 2 }} component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Variation</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Unit Cost</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.map((data, index) => (
                    <TableRow key={data.id}>
                      <TableCell>
                        <Avatar alt="Product Image" src={data.url || "/static/images/avatar/1.jpg"} />
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">Size → {data.variation.size || "N/A"}</Typography>
                          <Typography variant="body2">Colour → {data.variation.color || "N/A"}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          size="small"
                          value={data.quantity || 0}
                          sx={{ width: 80 }}
                          inputProps={{ min: 0 }}
                          onChange={(e) => {
                            const newFormData = [...formData];
                            newFormData[index].quantity = parseInt(e.target.value) || 0;
                            setFormData(newFormData);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          size="small"
                          value={data.unit_cost || 0}
                          inputProps={{ min: 0, step: 0.01 }}
                          sx={{ width: 80 }}
                          onChange={(e) => {
                            const newFormData = [...formData];
                            newFormData[index].unit_cost = parseFloat(e.target.value) || 0;
                            setFormData(newFormData);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => removeRow(index)}
                          style={{
                            color: "white",
                            padding: "7px 5px",
                            float: "right",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            backgroundColor: "red",
                            opacity: 1,
                          }}
                        >
                          <CloseIcon />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
              <Button variant="outlined" onClick={handleSelectAll} disabled={allProduct.length === 0}>
                Apply ({allProduct.length})
              </Button>
            </Box>
          </Box>

          <Divider sx={{ marginY: 2 }} />
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: "auto" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={formData.length === 0} // Changed from <= 1 to === 0
              sx={{
                ...(formData.length === 0 && { opacity: 0.5, cursor: "not-allowed" }),
              }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default AddInventoryModal;