// AddProduct.jsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { backend_url } from "../App";
import ImageUpload from "../component/product/ImageUpload";
import ColorSelector from "../component/product/ColorSelector";
import SizeSelector from "../component/product/SizeSelector";
import getCategories from "../component/api/category";

const AddProduct = ({ token }) => {
  const { register, handleSubmit, reset, control, setValue } = useForm(); // Add setValue
  const [uploadedImages, setUploadedImages] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [colorImages, setColorImages] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const {
    data: categoryList,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  console.log("uploadedImages", uploadedImages);

  // Fetch colors and sizes
  useEffect(() => {
    fetchColorsAndSizes();
    getSuppliers();
  }, []);

  const getSuppliers = async () => {
    try {
      const response = await fetch(`${backend_url}/api/vendor/list`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
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

  const fetchColorsAndSizes = async () => {
    try {
      const [colorResponse, sizeResponse] = await Promise.all([
        axios.get(`${backend_url}/api/color/list`),
        axios.get(`${backend_url}/api/size/list`),
      ]);

      if (colorResponse.data.success && sizeResponse.data.success) {
        setColors(colorResponse.data.colors);
        setSizes(sizeResponse.data.sizes);
      }
    } catch (error) {
      toast.error("Error fetching colors or sizes");
    }
  };

  const imageIds = uploadedImages.map((image) => image._id);

  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append("name", data.name || "");
    formData.append("description", data.description || "");
    formData.append("sku", data.sku || "");
    formData.append("sku_id", data.sku_id);
    formData.append("brand_name", data.brand_name);
    formData.append("style_id", data.style_id);
    formData.append("price", data.price || 0);
    formData.append("category", data.category || "");
    formData.append("subCategory", data.subCategory || "");
    formData.append("popular", data.popular || false);
    formData.append("supplierId", data.supplierId || "");

    // Append color images as files
    Object.keys(colorImages).forEach((colorId) => {
      colorImages[colorId].forEach((file) => {
        formData.append(`images_${colorId}[]`, file);
      });
    });

    // Convert colors array to JSON and append
    const colorsData = selectedColors.map((colorId) => ({
      _id: colorId,
      sizes: sizes
        .filter((size) => Array.isArray(data[`sizes_${colorId}`]) && data[`sizes_${colorId}`].includes(size._id))
        .map((size) => ({
          size: size._id,
          price: data[`price_${colorId}_${size._id}`] || 0,
          costPrice: data[`costPrice_${colorId}_${size._id}`] || 0,
          quantity: data[`quantity_${colorId}_${size._id}`] || 0,
          lowQuantity: data[`lowQuantity_${colorId}_${size._id}`] || 0,
        })),
    }));

    formData.append("colors", JSON.stringify(colorsData));

    try {
      const response = await axios.post(`${backend_url}/api/product/add`, formData, {
        headers: {
          token,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        reset();
        setUploadedImages([]);
        setSelectedColors([]);
        setColorImages([]);
        setColors([]);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error adding product");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    toast.error("Error fetching categories");
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-3xl">
      <h1 className="text-3xl font-semibold text-center mb-6">Add Product</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col gap-4">
          <select
            {...register("supplierId")}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">Select Vendor</option>
            {suppliers?.map((supplier) => (
              <option key={supplier._id} value={supplier._id}>
                {supplier.name}
              </option>
            ))}
          </select>

          <input
            {...register("name")}
            placeholder="Product Name"
            className="px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <textarea
            {...register("description")}
            placeholder="Product Description"
            className="px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              {...register("sku")}
              placeholder="SKU"
              className="px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <input
              {...register("sku_id")}
              placeholder="SKU ID"
              className="px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              {...register("brand_name")}
              placeholder="Brand Name"
              className="px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <input
              {...register("style_id")}
              placeholder="Style ID"
              className="px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <select
            {...register("category")}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 text-sm"
            onChange={(e) => {
              const selectedCategory = categoryList?.categories?.find(
                (cat) => cat.name === e.target.value
              );
              setSelectedSubcategories(selectedCategory?.subCategories || []);
            }}
          >
            <option value="">Select Category</option>
            {categoryList?.categories?.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            {...register("subCategory")}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">Select Subcategory</option>
            {selectedSubcategories?.map((subCategory) => (
              <option key={subCategory._id} value={subCategory.name}>
                {subCategory.name}
              </option>
            ))}
          </select>
        </div>

        <ColorSelector
          colors={colors}
          selectedColors={selectedColors}
          setSelectedColors={setSelectedColors}
        />
        {
          console.log("colors", colors)
          // console.log("colorImages", colorImages)
          // console.log("colorImages", colorImages),
          // console.log("colorImages", colorImages),
          // console.log("colorImages", colorImages)
        }

        <SizeSelector
          selectedColors={selectedColors}
          sizes={sizes}
          colors={colors}
          register={register}
          setValue={setValue} // Pass setValue to SizeSelector
          colorImages={colorImages}
          setColorImages={setColorImages}
        />

        <div className="flex items-center gap-2">
          <input {...register("popular")} type="checkbox" className="w-4 h-4" />
          <label className="text-sm">Popular</label>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition duration-300 ease-in-out text-sm"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;