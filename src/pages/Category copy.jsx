import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { backend_url } from "../App";
import ListCategory from "../component/Category/ListCategory";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";

const Category = ({ token }) => {
  const [name, setName] = useState("");
  const [subCategories, setSubCategories] = useState([{ name: "" }]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        name,
        subCategories,
        date: new Date().toISOString(), // Set the current date and time
      };

      const response = await axios.post(
        `${backend_url}/api/category/add`,
        formData,
        { headers: { token } }
      );

      if (response.status === 201) {
        toast.success("Category added successfully");
        setName("");
        setSubCategories([{ name: "" }]);
      } else {
        toast.error("Failed to add category");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const handleSubCategoryChange = (index, value) => {
    const newSubCategories = subCategories.map((subCategory, i) =>
      i === index ? { ...subCategory, name: value } : subCategory
    );
    setSubCategories(newSubCategories);
  };

  const addSubCategoryField = () => {
    setSubCategories([...subCategories, { name: "" }]);
  };

  const removeSubCategoryField = (index) => {
    const newSubCategories = subCategories.filter((_, i) => i !== index);
    setSubCategories(newSubCategories);
  };

  return (
    <div className="container mx-auto py-6 flex">
     
      <form onSubmit={onSubmitHandler} className="w-1/2 pl-8">
        {/* Category Name */}
        <div>
          <h5 className="h5">Category Name</h5>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Category name"
            className="px-3 py-1.5 ring-1 ring-slate-900/10 rounded bg-white mt-1 w-[333px] sm:w-full"
          />
        </div>

        {/* Subcategory Names */}
        <div>
          <h5 className="h5">Subcategory Names</h5>
          {subCategories.map((subCategory, index) => (
            <div key={index} className="mt-2 flex items-center">
              <input
                onChange={(e) => handleSubCategoryChange(index, e.target.value)}
                value={subCategory.name}
                type="text"
                placeholder={`Subcategory ${index + 1} name`}
                className="px-3 py-1.5 ring-1 ring-slate-900/10 rounded bg-white mt-1 w-[300px] sm:w-full"
              />
              <button
                type="button"
                onClick={() => removeSubCategoryField(index)}
                className="ml-2 text-red-500 transition-all duration-300 transform hover:scale-110"
              >
                <AiOutlineClose />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSubCategoryField}
            className="mt-2 bg-gradient-to-r from-rose-600 to-rose-600 text-white rounded-full py-2 px-6 transition-all duration-300 transform hover:from-rose-500 hover:to-rose-700 hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 flex items-center justify-center"
          >
            <AiOutlinePlus className="mr-2" />
            Add Subcategory
          </button>
        </div>

        {/* Submit */}
        <div className="py-8">
          <button
            type="submit"
            className="primary-btn bg-blue-500 text-white rounded-lg py-2 px-6 transition-all duration-300 transform hover:bg-blue-600 hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          >
            Add Category
          </button>
        </div>
      </form>
      <div className="w-1/2 px-4">
        <ListCategory />
      </div>
    </div>
  );
};

export default Category;