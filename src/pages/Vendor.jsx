import React, { useState } from "react";
import Modal from "react-modal";
import RegisterVendor from "../component/RegisterVendor";
import VendorList from "../component/VendorList";
import VendorDetails from "../component/VendorDetails";

// Bind modal to your appElement for accessibility
Modal.setAppElement("#root");

const Vendor = () => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [refreshList, setRefreshList] = useState(false);

  const openRegisterModal = () => setIsRegisterModalOpen(true);
  const closeRegisterModal = () => setIsRegisterModalOpen(false);

  const openDetailsModal = (vendorId) => {
    setSelectedVendorId(vendorId);
    setIsDetailsModalOpen(true);
  };
  const closeDetailsModal = () => {
    setSelectedVendorId(null);
    setIsDetailsModalOpen(false);
  };

  const handleRefreshList = () => {
    setRefreshList(!refreshList);
  };

  return (
    <div className="flex min-h-screen bg-gray-200">
      {/* Sidebar */}
    

      {/* Main Content */}
      <div className="flex-1 ml-64 p-6">
        {/* Header */}
       

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-gray-300">
          <button className="px-4 py-2 text-gray-600 font-medium border-b-2 border-blue-600 text-blue-600">
            Vendor List
          </button>
          <button
            onClick={openRegisterModal}
            className="px-4 py-2 text-gray-600 font-medium hover:text-blue-600 transition"
          >
            Register Vendor
          </button>
        </div>

        {/* Vendor List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <VendorList
            openDetailsModal={openDetailsModal}
            refresh={refreshList}
          />
        </div>

        {/* Register Vendor Modal */}
        <Modal
          isOpen={isRegisterModalOpen}
          onRequestClose={closeRegisterModal}
          className="bg-white p-6 rounded-lg shadow-lg max-w-[90vw] mx-auto mt-20"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Register Vendor</h2>
          <RegisterVendor
            closeModal={closeRegisterModal}
            onRegister={handleRefreshList}
          />
        </Modal>

        {/* Vendor Details Modal */}
        <Modal
          isOpen={isDetailsModalOpen}
          onRequestClose={closeDetailsModal}
          className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Vendor Details</h2>
          <VendorDetails vendorId={selectedVendorId} closeModal={closeDetailsModal} />
        </Modal>
      </div>
    </div>
  );
};

export default Vendor;