import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { backend_url } from "../App";
import ImageUpload from "../component/product/ImageUpload";
import getCategories from "../component/api/category";

const MultiProduct = ({ token, formId, onUpdate, uploadedImages, setUploadedImages }) => {
  const { register, handleSubmit, reset } = useForm();
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [isColorSizeDropdownOpen, setIsColorSizeDropdownOpen] = useState(false);

  const {
    data: categoryList,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  useEffect(() => {
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

    fetchColorsAndSizes();
  }, []);

  // Extract image IDs or URLs
  const imageIds = Array.isArray(uploadedImages)
    ? uploadedImages.map((image) => image._id || image.url || image).filter(Boolean)
    : [];

  const updateParent = async (data) => {
    const productData = {
      name: data.name || "",
      description: data.description || "",
      sku: data.sku || "",
      sku_id: data.sku_id || "",
      brand_name: data.brand_name || "",
      style_id: data.style_id || "",
      price: data.price || 0,
      category: data.category || "",
      subCategory: data.subCategory || "",
      images: imageIds, // Pass image IDs or URLs
      colors: selectedColors.map((colorId) => ({
        _id: colorId,
        sizes: sizes
          .filter((size) => data[`sizes_${colorId}`]?.includes(size._id))
          .map((size) => ({
            size: size._id,
            price: data[`price_${colorId}_${size._id}`] || 0,
          })),
      })),
      popular: data.popular || false,
    };

    console.log(`Form ${formId} - Product Data:`, productData);

    if (onUpdate) {
      onUpdate(productData);
      toast.success(`Product ${formId} added to bulk list`);
    } else {
      try {
        const response = await axios.post(
          `${backend_url}/api/product/add`,
          productData,
          { headers: { token } }
        );

        if (response.data.success) {
          toast.success(response.data.message);
          reset();
          setUploadedImages([]); // Reset images
          setSelectedColors([]);
        } else {
          toast.error(response.data.message || "Error adding product");
        }
      } catch (error) {
        toast.error("Error adding product");
      }
    }
  };

  const onSubmit = async (data) => {
    updateParent(data);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) toast.error("Error fetching categories");

  return (
    <div className="container mx-auto max-w-7xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 border rounded-lg p-2">
        <div className="grid grid-cols-10 text-xs gap-2">
          <div className="flex items-center">
            <ImageUpload
              uploadedImages={uploadedImages}
              setUploadedImages={setUploadedImages}
              token={token}
            />
          </div>

          <input
            {...register("name")}
            placeholder="Enter name"
            className="w-full px-2 py-1 border rounded shadow-sm focus:ring-1 focus:ring-blue-500"
          />
          <input
            {...register("description")}
            placeholder="Enter description"
            className="w-full px-2 py-1 border rounded shadow-sm focus:ring-1 focus:ring-blue-500"
          />
          <input
            {...register("sku")}
            placeholder="Enter SKU"
            className="w-full px-2 py-1 border rounded shadow-sm focus:ring-1 focus:ring-blue-500"
          />
          <input
            {...register("sku_id")}
            placeholder="Enter SKU ID"
            className="w-full px-2 py-1 border rounded shadow-sm focus:ring-1 focus:ring-blue-500"
          />
          <input
            {...register("brand_name")}
            placeholder="Enter brand"
            className="w-full px-2 py-1 border rounded shadow-sm focus:ring-1 focus:ring-blue-500"
          />
          <input
            {...register("style_id")}
            placeholder="Enter style ID"
            className="w-full px-2 py-1 border rounded shadow-sm focus:ring-1 focus:ring-blue-500"
          />
          <input
            {...register("price")}
            type="number"
            placeholder="Enter price"
            className="w-full px-2 py-1 border rounded shadow-sm focus:ring-1 focus:ring-blue-500"
          />
          <select
            {...register("category")}
            className="w-full px-2 py-1 border rounded shadow-sm focus:ring-1 focus:ring-blue-500"
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
            className="w-full px-2 py-1 border rounded shadow-sm focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select Subcategory</option>
            {selectedSubcategories?.map((subCategory) => (
              <option key={subCategory._id} value={subCategory.name}>
                {subCategory.name}
              </option>
            ))}
          </select>
        </div>

        {/* Color and Size Dropdown */}
        <div className="mt-6">
          <div
            className="flex items-center justify-between p-2 bg-gray-100 rounded cursor-pointer"
            onClick={() => setIsColorSizeDropdownOpen(!isColorSizeDropdownOpen)}
          >
            <h3 className="text-sm font-medium">Select Colors and Sizes</h3>
            <svg
              className={`w-4 h-4 transition-transform ${
                isColorSizeDropdownOpen ? "transform rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {isColorSizeDropdownOpen && (
            <div className="mt-2 bg-white p-2">
              {colors.map((color) => (
                <div key={color._id} className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`color-${color._id}`}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedColors([...selectedColors, color._id]);
                        } else {
                          setSelectedColors(selectedColors.filter((id) => id !== color._id));
                        }
                      }}
                    />
                    <label htmlFor={`color-${color._id}`} className="text-xs">
                      {color.name}
                    </label>
                  </div>

                  {selectedColors.includes(color._id) && (
                    <div className="flex flex-wrap gap-2 text-xs">
                      {sizes.map((size) => (
                        <div key={size._id} className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            id={`size-${color._id}-${size._id}`}
                            {...register(`sizes_${color._id}`)}
                            value={size._id}
                          />
                          <label htmlFor={`size-${color._id}-${size._id}`} className="text-xs">
                            {size.name}
                          </label>
                          <input
                            type="number"
                            placeholder="Price"
                            {...register(`price_${color._id}_${size._id}`)}
                            className="w-16 px-1 py-1 border rounded shadow-sm focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs mt-4">
          <div className="flex items-center gap-2">
            <input {...register("popular")} type="checkbox" className="w-3 h-3" />
            <label className="font-medium">Popular</label>
          </div>
          <button
            type="submit"
            className="px-2 py-1 bg-blue-500 text-white rounded shadow-sm hover:bg-blue-600 text-xs"
          >
            {onUpdate ? "Add to Bulk List" : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MultiProduct;