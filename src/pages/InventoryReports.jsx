import "react-loading-skeleton/dist/skeleton.css";
import { use, useState, useEffect } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

const InventoryReports = ({ token }) => {
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="container mx-auto py-2 px-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-8">
        All Products List
      </h3>

      {/* Search Bar */}
      {/* Top Horizontal Tabs */}
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Export Product Reports" value="1" />
              <Tab label="Inventory Reports" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <div className="container mx-auto py-2 px-4">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <select className="w-full p-2 border border-gray-50 rounded">
                    <option value="">Select Status</option>
                    <option value="option2">Active</option>
                    <option value="option3">Pending</option>
                  </select>
                </div>
                 <div>
                  <select className="w-full p-2 border border-gray-50 rounded">
                    <option value="option1">Select Category</option>
                    <option value="option2">T-Shirt</option>
                    <option value="option3">Shirt</option>
                  </select>
                </div>

                <div>
                  <select className="w-full p-2 border border-gray-50 rounded">
                    <option value="option1">Select Availability</option>
                    <option value="option2">In Stock</option>
                    <option value="option3">Out Of Stock</option>
                  </select>
                </div>

                <div>
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Export</button>
                </div>
              </div>
            </div>
          </TabPanel>
          <TabPanel value="2">Inventory Reports</TabPanel>
        </TabContext>
      </Box>
    </div>
  );
};

export default InventoryReports;
