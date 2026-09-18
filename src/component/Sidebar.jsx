import { useEffect, useState } from "react";
import { BiLogOut } from "react-icons/bi";
import { FaListAlt } from "react-icons/fa";
import { FaSquarePlus, FaPalette } from "react-icons/fa6";
import { MdFactCheck } from "react-icons/md";
import { NavLink } from "react-router-dom";
import Cookies from "js-cookie";

const Sidebar = ({ token, setToken }) => {
  const [isItemsDropdownOpen, setIsItemsDropdownOpen] = useState(false);
  const [isCatalogDropdownOpen, setIsCatalogDropdownOpen] = useState(false);
  const [isBulkUploadDropdownOpen, setIsBulkUploadDropdownOpen] = useState(false);
  const [isInventoryDropdownOpen, setIsInventoryDropdownOpen] = useState(false); // New state for Inventory dropdown
  const [isTaskDropdownOpen, setIsTaskDropdownOpen] = useState(false);
  const [loginUser, setLoginUser] = useState({});
  // Function to toggle Items dropdown and close other dropdowns if open
  const toggleItemsDropdown = () => {
    setIsItemsDropdownOpen((prev) => !prev);
    if (isCatalogDropdownOpen) setIsCatalogDropdownOpen(false);
    if (isBulkUploadDropdownOpen) setIsBulkUploadDropdownOpen(false);
    if (isInventoryDropdownOpen) setIsInventoryDropdownOpen(false); // Close Inventory dropdown
  };

  // Function to toggle Catalog dropdown and close other dropdowns if open
  const toggleCatalogDropdown = () => {
    setIsCatalogDropdownOpen((prev) => !prev);
    if (isItemsDropdownOpen) setIsItemsDropdownOpen(false);
    if (isBulkUploadDropdownOpen) setIsBulkUploadDropdownOpen(false);
    if (isInventoryDropdownOpen) setIsInventoryDropdownOpen(false); // Close Inventory dropdown
  };

  // Function to toggle Bulk Upload dropdown and close other dropdowns if open
  const toggleBulkUploadDropdown = () => {
    setIsBulkUploadDropdownOpen((prev) => !prev);
    if (isItemsDropdownOpen) setIsItemsDropdownOpen(false);
    if (isCatalogDropdownOpen) setIsCatalogDropdownOpen(false);
    if (isInventoryDropdownOpen) setIsInventoryDropdownOpen(false); // Close Inventory dropdown
  };

  // Function to toggle Inventory dropdown and close other dropdowns if open
  const toggleInventoryDropdown = () => {
    setIsInventoryDropdownOpen((prev) => !prev);
    if (isItemsDropdownOpen) setIsItemsDropdownOpen(false);
    if (isCatalogDropdownOpen) setIsCatalogDropdownOpen(false);
    if (isBulkUploadDropdownOpen) setIsBulkUploadDropdownOpen(false);
  };

  const toggleTaskDropdown = () => {
    setIsTaskDropdownOpen((prev) => !prev);
    if (isItemsDropdownOpen) setIsItemsDropdownOpen(false);
    if (isCatalogDropdownOpen) setIsCatalogDropdownOpen(false);
    if (isBulkUploadDropdownOpen) setIsBulkUploadDropdownOpen(false);
    if (isInventoryDropdownOpen) setIsInventoryDropdownOpen(false);
  };

  useEffect(() => {
    const adminInfo = Cookies.get("adminInfo");

    if (adminInfo) {
      const parsedAdminInfo = JSON.parse(adminInfo);
      setLoginUser(parsedAdminInfo);
    }
  }, []);


  // console.log("Token in Sidebar:", token);

  return (
    <div className="flex flex-col sm:w-1/5 sm:min-h-screen bg-cyan-900 rounded-xl shadow-md p-4 sm:pr-6 mb-4 border sm:mt-0.5 ml-0.5">
      {/* Dashboard */}
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          isActive
            ? "flex items-center gap-2 p-3 font-medium text-white bg-blue-500 rounded-lg shadow-sm hover:bg-blue-600 border"
            : "flex items-center gap-2 p-3 font-medium text-white hover:text-gray-900 hover:bg-gray-100 rounded-lg border"
        }
      >
        <MdFactCheck className="text-xl" />
        <span>Dashboard</span>
      </NavLink>

      {/* Navigation Links */}
      <div className="flex flex-col gap-y-6 pt-6">
        {/* Dropdown for Add Items and List Items */}
        <div>
          <button
            onClick={toggleItemsDropdown}
            className="flex items-center gap-2 p-3 font-medium text-white hover:text-gray-900 hover:bg-gray-100 rounded-lg w-full text-left border"
          >
            <FaSquarePlus className="text-xl" />
            <span>Campain</span>
          </button>
          {isItemsDropdownOpen && (
            <div className="ml-6 border border-gray-200 border-y-4 p-3">

              <NavLink
                to="/add"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-2 p-3 font-medium text-white bg-blue-500 rounded-lg shadow-sm hover:bg-blue-600 border"
                    : "flex items-center gap-2 p-3 font-medium text-white hover:text-gray-900 hover:bg-gray-100 rounded-lg border"
                }
              >
                <FaSquarePlus className="text-xl" />
                <span>Add Items</span>
              </NavLink>

              <NavLink
                to="/promomanager"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-2 p-3 font-medium text-white bg-blue-500 rounded-lg shadow-sm hover:bg-blue-600 border"
                    : "flex items-center gap-2 p-3 font-medium text-white hover:text-gray-900 hover:bg-gray-100 rounded-lg border"
                }
              >
                <FaSquarePlus className="text-xl" />
                <span>Promo Manager</span>
              </NavLink>

              <NavLink
                to="/list"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-2 p-3 font-medium text-white bg-blue-500 rounded-lg shadow-sm hover:bg-blue-600 border"
                    : "flex items-center gap-2 p-3 font-medium text-white hover:text-gray-900 hover:bg-gray-100 rounded-lg border"
                }
              >
                <FaListAlt className="text-xl" />
                <span>Your Listings</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Dropdown for Variants */}
        {
          loginUser && loginUser?.role?.name === 'Admin' && (
            <div>
              <button
                onClick={toggleCatalogDropdown}
                className="flex items-center gap-2 p-3 font-medium text-white hover:text-gray-900 hover:bg-gray-100 rounded-lg w-full text-left border"
              >
                <FaPalette className="text-xl" />
                <span>Variants</span>
              </button>
              {isCatalogDropdownOpen && (
                <div className="ml-6 border border-gray-200 border-y-4 p-3">
                  <NavLink
                    to="/colors"
                    className={({ isActive }) =>
                      isActive
                        ? "flex items-center gap-2 p-3 font-medium text-white bg-blue-500 rounded-lg shadow-sm hover:bg-blue-600 border"
                        : "flex items-center gap-2 p-3 font-medium text-white hover:text-gray-900 hover:bg-gray-100 rounded-lg border"
                    }
                  >
                    <FaPalette className="text-xl" />
                    <span>Colors</span>
                  </NavLink>

                  <NavLink
                    to="/sizes"
                    className={({ isActive }) =>
                      isActive
                        ? "flex items-center gap-2 p-3 font-medium text-white bg-blue-500 rounded-lg shadow-sm hover:bg-blue-600 border"
                        : "flex items-center gap-2 p-3 font-medium text-white hover:text-gray-900 hover:bg-gray-100 rounded-lg border"
                    }
                  >
                    <FaListAlt className="text-xl" />
                    <span>Sizes</span>
                  </NavLink>

                  {/* Category */}
                  <NavLink
                    to="/category"
                    className={({ isActive }) =>
                      isActive
                        ? "flex items-center gap-2 p-3 font-medium text-white bg-blue-500 rounded-lg shadow-sm hover:bg-blue-600 border"
                        : "flex items-center gap-2 p-3 font-medium text-white hover:text-gray-900 hover:bg-gray-100 rounded-lg border"
                    }
                  >
                    <MdFactCheck className="text-xl" />
                    <span>Category</span>
                  </NavLink>
                </div>
              )}
            </div>
          )
        }


        {/* Bulk Upload Dropdown */}
        <div>
          <button
            onClick={toggleBulkUploadDropdown}
            className="flex items-center gap-2 p-3 font-medium text-white hover:text-gray-900 hover:bg-gray-100 rounded-lg w-full text-left border"
          >
            <FaSquarePlus className="text-xl" />
            <span>Bulk Upload</span>
          </button>
          {isBulkUploadDropdownOpen && (
            <div className="ml-6 border border-gray-200 border-y-4 p-3">
              <NavLink
                to="/uploadExcel"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-2 p-3 font-medium text-white bg-blue-500 rounded-lg shadow-sm hover:bg-blue-600 border"
                    : "flex items-center gap-2 p-3 font-medium text-white hover:text-gray-900 hover:bg-gray-100 rounded-lg border"
                }
              >
                <MdFactCheck className="text-xl" />
                <span>Excel Upload</span>
              </NavLink>

              <NavLink
                to="/gallery"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-2 p-3 font-medium text-white bg-blue-500 rounded-lg shadow-sm hover:bg-blue-600 border"
                    : "flex items-center gap-2 p-3 font-medium text-white hover:text-gray-900 hover:bg-gray-100 rounded-lg border"
                }
              >
                <MdFactCheck className="text-xl" />
                <span>Gallery</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Orders */}
        {/* <NavLink
          to="/orders"
          className={({ isActive }) =>
            isActive
              ? "flex items-center gap-2 p-3 font-medium text-white bg-blue-500 rounded-lg shadow-sm hover:bg-blue-600 border"
              : "flex items-center gap-2 p-3 font-medium text-white hover:text-gray-900 hover:bg-gray-100 rounded-lg border"
          }
        >
          <MdFactCheck className="text-xl" />
          <span>Orders</span>
        </NavLink> */}

        <div>
          <button
            onClick={toggleItemsDropdown}
            className="flex items-center gap-2 p-3 font-medium text-white hover:text-gray-900 hover:bg-gray-100 rounded-lg w-full text-left border"
          >
            <FaSquarePlus className="text-xl" />
            <span>Orders</span>
          </button>
          {isItemsDropdownOpen && (
            <div className="ml-6 border border-gray-200 border-y-4 p-3">


              <NavLink
                to="/orders/awaiting"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-2 p-3 font-medium text-white bg-blue-500 rounded-lg shadow-sm hover:bg-blue-600 border"
                    : "flex items-center gap-2 p-3 font-medium text-white hover:text-gray-900 hover:bg-gray-100 rounded-lg border"
                }
              >
                <FaListAlt className="text-xl" />
                <span>Awaiting Order</span>
              </NavLink>


              <NavLink
                to="/orders/assigned"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-2 p-3 font-medium text-white bg-blue-500 rounded-lg shadow-sm hover:bg-blue-600 border"
                    : "flex items-center gap-2 p-3 font-medium text-white hover:text-gray-900 hover:bg-gray-100 rounded-lg border"
                }
              >
                <FaListAlt className="text-xl" />
                <span>Assigned Order</span>
              </NavLink>


              <NavLink
                to="/orders/all"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-2 p-3 font-medium text-white bg-blue-500 rounded-lg shadow-sm hover:bg-blue-600 border"
                    : "flex items-center gap-2 p-3 font-medium text-white hover:text-gray-900 hover:bg-gray-100 rounded-lg border"
                }
              >
                <FaListAlt className="text-xl" />
                <span>All Order</span>
              </NavLink>

              <NavLink
                to="/orders/dispatched"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-2 p-3 font-medium text-white bg-blue-500 rounded-lg shadow-sm hover:bg-blue-600 border"
                    : "flex items-center gap-2 p-3 font-medium text-white hover:text-gray-900 hover:bg-gray-100 rounded-lg border"
                }
              >
                <FaListAlt className="text-xl" />
                <span>Dispatched Order</span>
              </NavLink>


              <NavLink
                to="/orders/hold"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-2 p-3 font-medium text-white bg-blue-500 rounded-lg shadow-sm hover:bg-blue-600 border"
                    : "flex items-center gap-2 p-3 font-medium text-white hover:text-gray-900 hover:bg-gray-100 rounded-lg border"
                }
              >
                <FaListAlt className="text-xl" />
                <span>Hold Order</span>
              </NavLink>

              <NavLink
                to="/orders/return"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-2 p-3 font-medium text-white bg-blue-500 rounded-lg shadow-sm hover:bg-blue-600 border"
                    : "flex items-center gap-2 p-3 font-medium text-white hover:text-gray-900 hover:bg-gray-100 rounded-lg border"
                }
              >
                <FaListAlt className="text-xl" />
                <span>Return Order</span>
              </NavLink>
            </div>
          )}
        </div>


        {/* Users */}
        {
          loginUser && loginUser?.role?.name === 'Admin' && (
            <NavLink
              to="/customers"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-2 p-3 font-medium text-white bg-blue-500 rounded-lg shadow-sm hover:bg-blue-600 border"
                  : "flex items-center gap-2 p-3 font-medium text-white hover:text-gray-900 hover:bg-gray-100 rounded-lg border"
              }
            >
              <MdFactCheck className="text-xl" />
              <span>Customers</span>
            </NavLink>
          )
        }




        {/* Users */}
        {
          loginUser && loginUser?.role?.name === 'Admin' && (
            <>
              <NavLink
                to="/users"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-2 p-3 font-medium text-white bg-blue-500 rounded-lg shadow-sm hover:bg-blue-600 border"
                    : "flex items-center gap-2 p-3 font-medium text-white hover:text-gray-900 hover:bg-gray-100 rounded-lg border"
                }
              >
                <MdFactCheck className="text-xl" />
                <span>Users</span>
              </NavLink>

              {/* Roles */}
              <NavLink
                to="/roles"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-2 p-3 font-medium text-white bg-blue-500 rounded-lg shadow-sm hover:bg-blue-600 border"
                    : "flex items-center gap-2 p-3 font-medium text-white hover:text-gray-900 hover:bg-gray-100 rounded-lg border"
                }
              >
                <MdFactCheck className="text-xl" />
                <span>Roles</span>
              </NavLink>

              {/* Policy */}
              <NavLink
                to="/policy"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-2 p-3 font-medium text-white bg-blue-500 rounded-lg shadow-sm hover:bg-blue-600 border"
                    : "flex items-center gap-2 p-3 font-medium text-white hover:text-gray-900 hover:bg-gray-100 rounded-lg border"
                }
              >
                <MdFactCheck className="text-xl" />
                <span>Policy</span>
              </NavLink>

              {/* Payment Method Setting */}
              <NavLink
                to="/paymentmethod"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-2 p-3 font-medium text-white bg-blue-500 rounded-lg shadow-sm hover:bg-blue-600 border"
                    : "flex items-center gap-2 p-3 font-medium text-white hover:text-gray-900 hover:bg-gray-100 rounded-lg border"
                }
              >
                <MdFactCheck className="text-xl" />
                <span>Payment Method Setting</span>
              </NavLink>

              {/* Setting */}
              <NavLink
                to="/setting"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-2 p-3 font-medium text-white bg-blue-500 rounded-lg shadow-sm hover:bg-blue-600 border"
                    : "flex items-center gap-2 p-3 font-medium text-white hover:text-gray-900 hover:bg-gray-100 rounded-lg border"
                }
              >
                <MdFactCheck className="text-xl" />
                <span>Setting</span>
              </NavLink>
            </>
          )
        }








        {/* Media */}
        <NavLink
          to="/media"
          className={({ isActive }) =>
            isActive
              ? "flex items-center gap-2 p-3 font-medium text-white bg-blue-500 rounded-lg shadow-sm hover:bg-blue-600 border"
              : "flex items-center gap-2 p-3 font-medium text-white hover:text-gray-900 hover:bg-gray-100 rounded-lg border"
          }
        >
          <MdFactCheck className="text-xl" />
          <span>Media</span>
        </NavLink>



        {/* Inventory Dropdown */}
        <div>
          <button
            onClick={toggleInventoryDropdown}
            className="flex items-center gap-2 p-3 font-medium text-white hover:text-gray-900 hover:bg-gray-100 rounded-lg w-full text-left border"
          >
            <MdFactCheck className="text-xl" />

            <span>Inventory</span>
          </button>
          {isInventoryDropdownOpen && (
            <div className="ml-6 border border-gray-200 border-y-4 p-3">
              <NavLink
                to="/addInventory"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-2 p-3 font-medium text-white bg-blue-500 rounded-lg shadow-sm hover:bg-blue-600 border"
                    : "flex items-center gap-2 p-3 font-medium text-white hover:text-gray-900 hover:bg-gray-100 rounded-lg border"
                }
              >
                <FaSquarePlus className="text-xl" />
                <span>Add Inventory</span>
              </NavLink>



              {/* Vendor */}
              <NavLink
                to="/vendor"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-2 p-3 font-medium text-white bg-blue-500 rounded-lg shadow-sm hover:bg-blue-600 border"
                    : "flex items-center gap-2 p-3 font-medium text-white hover:text-gray-900 hover:bg-gray-100 rounded-lg border"
                }
              >
                <MdFactCheck className="text-xl" />
                <span>Vendor</span>
              </NavLink>
              <NavLink
                to="/vendorPOWorkflow"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-2 p-3 font-medium text-white bg-blue-500 rounded-lg shadow-sm hover:bg-blue-600 border"
                    : "flex items-center gap-2 p-3 font-medium text-white hover:text-gray-900 hover:bg-gray-100 rounded-lg border"
                }
              >
                <MdFactCheck className="text-xl" />
                <span>Vendor Work Flow</span>
              </NavLink>
            </div>
          )}
        </div>


        {/* Task Dropdown */}
        <div>
          <button
            onClick={toggleTaskDropdown}
            className="flex items-center gap-2 p-3 font-medium text-white hover:text-gray-900 hover:bg-gray-100 rounded-lg w-full text-left border"
          >
            <MdFactCheck className="text-xl" />

            <span>Task</span>
          </button>
          {isTaskDropdownOpen && (
            <div className="ml-6 border border-gray-200 border-y-4 p-3">
              <NavLink
                to="/myTask"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-2 p-3 font-medium text-white bg-blue-500 rounded-lg shadow-sm hover:bg-blue-600 border"
                    : "flex items-center gap-2 p-3 font-medium text-white hover:text-gray-900 hover:bg-gray-100 rounded-lg border"
                }
              >
                <FaSquarePlus className="text-xl" />
                <span>My Task</span>
              </NavLink>

            </div>
          )}
        </div>





      </div>

      {/* Logout Button */}
      <div className="mt-auto pt-2">
        {token && (
          <button
            onClick={() => setToken("")}
            className="flex items-center gap-2 p-3 font-medium text-white hover:text-red-600 hover:bg-gray-100 rounded-lg"
          >
            <BiLogOut className="text-xl" />
            <span>Logout</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
