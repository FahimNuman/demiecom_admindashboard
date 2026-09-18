import { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Typography,
  Divider,
  Grid,
  IconButton,
  Backdrop,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import axios from "axios";
import { backend_url } from "../App";

const lightStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 350, md: 600 },
  bgcolor: "#fff",
  border: "2px solid #1f1f1f",
  borderRadius: 2,
  p: 2,
  maxHeight: "80vh",
  overflowY: "auto",
};

const EditProductModal = ({ open, onClose, product, token, onSuccess }) => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    sku: "",
    sku_id: "",
    price: "",
    category: "",
    subCategory: "",
    brand_name: "",
    style_id: "",
    popular: false,
    colors: [],
  });
  const [colorImages, setColorImages] = useState({});

  // Initialize formData when product changes
  useEffect(() => {
    if (product) {
      console.log("Initializing formData with product:", product);
      setFormData({
        id: product.id || "",
        name: product.name || "",
        description: product.description || "",
        sku: product.sku || "",
        sku_id: product.sku_id || "",
        price: product.price || "",
        category: product.category || "",
        subCategory: product.subCategory || "",
        brand_name: product.brand_name || "",
        style_id: product.style_id || "",
        popular: product.popular || false,
        colors: product.colors?.map(color => ({
          _id: color._id || "",
          images: color.images || [],
          sizes: color.sizes?.map(size => ({
            size: size.size || "",
            name: size.name || "",
            price: size.price || 0,
            costPrice: size.costPrice || 0,
            quantity: size.quantity || 0,
            lowQuantity: size.lowQuantity || 0,
          })) || [],
        })) || [],
      });
      setColorImages(
        product.colors?.reduce((acc, color) => ({
          ...acc,
          [color._id]: [],
        }), {}) || {}
      );
    }
  }, [product]);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle color/size changes
  const handleColorSizeChange = (colorIndex, sizeIndex, field, value) => {
    setFormData(prev => {
      const newColors = [...prev.colors];
      newColors[colorIndex].sizes[sizeIndex][field] = Number(value) || value;
      return { ...prev, colors: newColors };
    });
  };

  // Handle image changes
  const handleImageChange = (colorId, e) => {
    const files = Array.from(e.target.files);
    setColorImages(prev => ({
      ...prev,
      [colorId]: files,
    }));
  };

  // Submit updated product
  const handleSubmit = async () => {
    if (!formData.id) {
      toast.error("Product ID is missing");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name || "");
    formDataToSend.append("description", formData.description || "");
    formDataToSend.append("sku", formData.sku || "");
    formDataToSend.append("sku_id", formData.sku_id || "");
    formDataToSend.append("price", formData.price || "");
    formDataToSend.append("category", formData.category || "");
    formDataToSend.append("subCategory", formData.subCategory || "");
    formDataToSend.append("brand_name", formData.brand_name || "");
    formDataToSend.append("style_id", formData.style_id || "");
    formDataToSend.append("popular", formData.popular ? "true" : "false");

    // Stringify colors
    const colors = formData.colors.map(color => ({
      _id: color._id,
      sizes: color.sizes.map(size => ({
        size: size.size,
        price: Number(size.price) || 0,
        costPrice: Number(size.costPrice) || 0,
        quantity: Number(size.quantity) || 0,
        lowQuantity: Number(size.lowQuantity) || 0,
      })),
    }));
    formDataToSend.append("colors", JSON.stringify(colors));

    // Append images
    Object.keys(colorImages).forEach(colorId => {
      colorImages[colorId].forEach(file => {
        formDataToSend.append(`images_${colorId}`, file);
      });
    });

    try {
      const response = await axios.put(
        `${backend_url}/api/product/update/${formData.id}`,
        formDataToSend,
        {
          headers: {
            token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Product updated successfully");
        onSuccess();
      } else {
        toast.error(response.data.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(error.response?.data?.message || "Error updating product");
    }
  };

  if (!open || !product) {
    return null;
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
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
      <Box sx={lightStyle}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">Edit Product</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ marginY: 2 }} />
        <form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                size="small"
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="SKU"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="SKU ID"
                name="sku_id"
                value={formData.sku_id}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="SubCategory"
                name="subCategory"
                value={formData.subCategory}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Brand Name"
                name="brand_name"
                value={formData.brand_name}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Style ID"
                name="style_id"
                value={formData.style_id}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.popular}
                    onChange={handleChange}
                    name="popular"
                  />
                }
                label="Popular"
              />
            </Grid>
            {formData.colors?.map((color, colorIndex) => (
              <Grid item xs={12} key={color._id}>
                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                  Color {colorIndex + 1}
                </Typography>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageChange(color._id, e)}
                  style={{ margin: "10px 0" }}
                />
                <Grid container spacing={1}>
                  {color.sizes?.map((size, sizeIndex) => (
                    <Grid item xs={12} key={size.size}>
                      <Grid container spacing={1} alignItems="center">
                        <Grid item xs={3}>
                          <TextField
                            label="Size"
                            value={size.name}
                            disabled
                            size="small"
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <TextField
                            label="Price"
                            type="number"
                            value={size.price}
                            onChange={(e) =>
                              handleColorSizeChange(colorIndex, sizeIndex, "price", e.target.value)
                            }
                            size="small"
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <TextField
                            label="Cost Price"
                            type="number"
                            value={size.costPrice}
                            onChange={(e) =>
                              handleColorSizeChange(colorIndex, sizeIndex, "costPrice", e.target.value)
                            }
                            size="small"
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <TextField
                            label="Quantity"
                            type="number"
                            value={size.quantity}
                            onChange={(e) =>
                              handleColorSizeChange(colorIndex, sizeIndex, "quantity", e.target.value)
                            }
                            size="small"
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <TextField
                            label="Low Quantity"
                            type="number"
                            value={size.lowQuantity}
                            onChange={(e) =>
                              handleColorSizeChange(colorIndex, sizeIndex, "lowQuantity", e.target.value)
                            }
                            size="small"
                            fullWidth
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            ))}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                <Button variant="outlined" onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                  Save
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
};

export default EditProductModal;