import axios from "axios";
import { backend_url } from "../App";

export const fetchProducts = async (token) => {
  try {
    const response = await axios.get(`${backend_url}/api/product/list`, {
      headers: { token },
    });
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to fetch products");
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching products");
  }
};

export const removeProduct = async (id, token) => {
  try {
    const response = await axios.delete(`${backend_url}/api/product/remove/${id}`, {
      headers: { token },
    });
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to remove product");
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error removing product");
  }
};

export const updateProduct = async (id, data, token) => {
  try {
    const response = await axios.put(`${backend_url}/api/product/update/${id}`, data, {
      headers: { token },
    });
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to update product");
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error updating product");
  }
};