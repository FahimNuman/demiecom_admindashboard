import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backend_url } from "../App";
import MultiProduct from "./multiProduct";

const BulkAddProduct = ({ token }) => {
  const [forms, setForms] = useState(Array.from({ length: 15 }, (_, i) => ({ id: i + 1 })));
  const [allProducts, setAllProducts] = useState([]);
  const [uploadedImagesByForm, setUploadedImagesByForm] = useState({});

  console.log("BulkAddProduct rendered with uploadedImagesByForm:", uploadedImagesByForm); // Debug

  const addMoreForms = () => {
    if (forms.length < 150) {
      const newForms = Array.from({ length: 15 }, (_, i) => ({ id: forms.length + i + 1 }));
      setForms([...forms, ...newForms]);
    } else {
      toast.warning("Maximum 150 forms allowed.");
    }
  };

  const handleBulkSubmit = async () => {
    if (allProducts.length === 0) {
      toast.error("No products to submit.");
      return;
    }

    console.log("Submitting allProducts:", allProducts);

    try {
      const response = await axios.post(
        `${backend_url}/api/product/bulk-add`,
        { products: allProducts },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setAllProducts([]);
        setUploadedImagesByForm({});
      } else {
        console.error("Bulk add response error:", response.data);
        toast.error(response.data.message || "Error submitting bulk products");
      }
    } catch (error) {
      console.error("Error submitting bulk products:", error);
      toast.error("Error submitting bulk products");
    }
  };

  const updateProductData = (id, productData) => {
    const updatedProducts = allProducts.filter((product) => product.id !== id);
    const imagesForForm = uploadedImagesByForm[id] || [];
    const imageIds = Array.isArray(imagesForForm)
      ? imagesForForm.map((img) => img.public_id || img.url || (typeof img === 'string' ? img : null)).filter(Boolean)
      : [];
    console.log(`Updating product for form ${id}, images:`, imageIds);
    setAllProducts([...updatedProducts, { id, ...productData, images: imageIds }]);
  };

  const updateUploadedImages = (formId, images) => {
    setUploadedImagesByForm((prev) => {
      const newImages = Array.isArray(images) ? images : (images ? [images] : []);
      console.log(`Updating images for form ${formId}:`, newImages);
      return {
        ...prev,
        [formId]: newImages,
      };
    });
  };

  return (
    <div className="container mx-auto py-2 px-2 max-w-7xl">
      <div className="overflow-y-auto max-h-[70vh] border-r-4 rounded-lg shadow-sm">
        <div className="grid grid-cols-10 text-xs text-white font-medium bg-orange-500 p-2 rounded">
          <div>Image</div>
          <div>Product Name</div>
          <div>Description</div>
          <div>SKU</div>
          <div>SKU ID</div>
          <div>Brand Name</div>
          <div>Style ID</div>
          <div>Price</div>
          <div>Category</div>
          <div>Subcategory</div>
        </div>

        <div>
          {forms.map((form) => (
            <MultiProduct
              key={form.id}
              token={token}
              formId={form.id}
              onUpdate={(data) => updateProductData(form.id, data)}
              uploadedImages={uploadedImagesByForm[form.id] || []}
              setUploadedImages={(images) => updateUploadedImages(form.id, images)}
            />
          ))}

          <button
            type="button"
            onClick={addMoreForms}
            className="w-full py-1 bg-green-500 text-white rounded shadow-md hover:bg-green-600 transition duration-300 ease-in-out text-xs"
          >
            Add Another 15 Products
          </button>

          <button
            type="button"
            onClick={handleBulkSubmit}
            className="w-full py-1 bg-blue-500 text-white rounded shadow-md hover:bg-blue-600 transition duration-300 ease-in-out text-xs"
          >
            Submit All Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkAddProduct;