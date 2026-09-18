import { Route, Routes } from "react-router-dom";
import Header from "./component/Header";
import Sidebar from "./component/Sidebar";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Login from "./component/Login";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Color from "./pages/Color";
import Size from "./pages/Size";
import Admin from "./pages/Customer";
import Category from "./pages/Category";
import Dashboard from "./pages/Dashboard";
import UploadExcel from "./pages/UploadExcel";
import PaymentSetting from "./component/PaymentSetting";
import StripeSetting from "./component/PaymentMethod/stripe/StripeSetting";
import AddProduct from "./pages/Add";

import AuthorizeNetSetting from "./component/PaymentMethod/authorizeNet/AuthorizeNetSetting";
import COD from "./component/PaymentMethod/cashOnDelivery/COD";
import Gallery from "./pages/Gallery";
import Inventory from "./pages/Inventory";
import Vendor from "./pages/Vendor";
import AddInventory from "./component/Inventory/AddInventory";
import InvoiceList from "./component/Inventory/InvoiceList";
import Setting from "./pages/Setting";
import Report from "./pages/InventoryReports";
import InventoryDashboard from "./component/vendor/InventoryDashboard";
import DraftPOCreation from "./component/vendor/DraftPOCreation";
import PurchaseOrderList from "./component/vendor/PurchaseOrderList";
import ViewPurchaseOrderDetails from "./component/vendor/ViewPurchaseOrderDetails";
import EditPurchaseOrder from "./component/vendor/EditPurchaseOrder";
import POGenerated from "./component/vendor/POGenerated";
import Customer from "./pages/Customer";
import User from "./pages/User";
import Role from "./pages/Role";
import Process from "./pages/Process";
import Policy from "./pages/Policy";
import MyTask from "./component/Task/MyTask";
import Campain from "./pages/Campain";



export const backend_url = import.meta.env.VITE_BACKEND_URL;
export const currency = "$";

function App() {
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return (
    <main>
      <ToastContainer />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
        
          <div className=" text-[#404040] container mx-auto">
            <Header />
          </div>

          {/* Sidebar and Main Content */}
          <div className="mx-auto max-w-[1680px] flex flex-col sm:flex-row mt-10 sm:mt-1 bg-zinc-100 backdrop-blur-xl border rounded-lg">
            <Sidebar token={token} setToken={setToken} />
            <Routes>
           
              <Route path="/add" element={<AddProduct token={token} />} />
              <Route path="/promomanager" element={<Campain token={token} />} />
             
              
              <Route path="/list" element={<List token={token} />} />
              <Route path="/orders/:status" element={<Orders token={token} />} />
              <Route path="/colors" element={<Color token={token} />} />
              <Route path="/sizes" element={<Size token={token} />} />
              <Route path="/category" element={<Category token={token} />} />
              <Route path="/customers" element={<Customer token={token} />} />
              <Route path="/users" element={<User token={token} />} />
              <Route path="/roles" element={<Role token={token} />} />
              <Route path="/policy" element={<Policy token={token} />} />
              <Route path="/process" element={<Process token={token} />} />


              <Route path="/orders" element={<Admin token={token} />} />
              <Route path="/dashboard" element={<Dashboard token={token} />} />
              <Route path="/uploadExcel" element={<UploadExcel token={token} />} />
              <Route path="/gallery" element={<Gallery token={token} />} />
              <Route path="/paymentmethod" element={<PaymentSetting token={token} />} />
              <Route path="/stripesetting" element={<StripeSetting token={token} />} />
              <Route path="/authorizenetsetting" element={<AuthorizeNetSetting token={token} />} />
              <Route path="/cod" element={<COD token={token} />} />
              <Route path="/inventory" element={<Inventory token={token} />} />
              <Route path="/vendor" element={<Vendor token={token} />} />
              <Route path="/addInventory" element={<AddInventory token={token} />} />
              <Route path="/myTask" element={<MyTask token={token} />} />
              <Route path="/invoiceList" element={<InvoiceList token={token} />} />
              <Route path="/setting" element={<Setting token={token} />} />
              <Route path="/report" element={<Report token={token} />} />
               <Route path="/vendorPOWorkflow" element={<InventoryDashboard token={token} />} />
               <Route path="/draftPOCreation" element={<DraftPOCreation token={token} />} />
               <Route path="/purchaseOrderList" element={<PurchaseOrderList token={token} />} />
               <Route path="/viewPurchaseOrderDetails" element={<ViewPurchaseOrderDetails token={token} />} />
                <Route path="/editPurchaseOrder" element={<EditPurchaseOrder token={token} />} />
                  <Route path="/po-generated" element={<POGenerated token={token} />} />
              
              
            </Routes>
          </div>
        </>
      )}
    </main>
  );
}

export default App;
