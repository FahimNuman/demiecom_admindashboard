import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { backend_url } from "../App";
import ListSize from "../component/SizeList/ListSize";


const Size = ({ token }) => {
  const [name, setName] = useState("");
  const [size_id, setColor_id] = useState("");
  const [date, setDate] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        name,
        size_id,
        date
      };

      const response = await axios.post(`${backend_url}/api/size/add`, formData, { headers: { token } });

      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setColor_id("");
        setDate("");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="container mx-auto py-6 flex">
      
      <form onSubmit={onSubmitHandler} className="w-1/2 pl-8 ">
        <div>
          <h5 className="h5">Size Name</h5>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Color name"
            className="px-3 py-1.5 ring-1 ring-slate-900/10 rounded bg-white mt-1 w-[333px] sm:w-full"
          />
        </div>

        <div>
          <h5 className="h5">Size Id</h5>
          <input
            onChange={(e) => setColor_id(e.target.value)}
            value={size_id}
            type="text"
            placeholder="Color ID"
            className="px-3 py-1.5 ring-1 ring-slate-900/10 rounded bg-white mt-1 w-[333px] sm:w-full"
          />
        </div>

        <div>
          <h5 className="h5">Date</h5>
          <input
            onChange={(e) => setDate(e.target.value)}
            value={date}
            type="date"
            className="px-3 py-1.5 ring-1 ring-slate-900/10 rounded bg-white mt-1 w-[333px] sm:w-full"
          />
        </div>

        {/* Submit */}
        <div className="py-8">
          <button
            type="submit"
            className="primary-btn bg-red-500 text-white rounded-lg py-2 px-6 transition-all duration-300 transform hover:bg-red-600 hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 bg-cyan-900 focus:ring-opacity-50"
          >
            Add Size
          </button>
        </div>
      </form>
      <div className="w-1/2 px-4">
       <ListSize/>
      </div>
    </div>
  );
};

export default Size;
