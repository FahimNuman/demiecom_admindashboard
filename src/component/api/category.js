import axios from "axios";

import { backend_url } from "../../App";

const getCategories = async () => {
  try {
    const response = await axios.get(`${backend_url}/api/category/list`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export default getCategories;
