import { useState } from "react";
import ProductFeatureModal from "../component/ProductFeatureModal/ProductFeatureModal";

const Campaign = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productFeatures, setProductFeatures] = useState([]);
  const [campaignData, setCampaignData] = useState([
    {
      id: "productFeature",
      text: "Product Feature",
      gradient: "from-purple-400 to-purple-700",
      enabled: true,
    },
  ]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const toggleSetting = (id) => {
    setCampaignData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
    console.log(`Toggling setting: ${id}`);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4 sm:p-6">
      <h2 className="text-2xl sm:text-2xl font-bold mb-6 sm:mb-8 text-gray-800">
        Campaign Settings
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 w-full max-w-5xl">
        {campaignData.map(({ id, text, gradient, enabled }) => (
          <div
            key={id}
            onClick={enabled ? openModal : null} // Only trigger modal if enabled
            className={`flex flex-col items-center bg-gradient-to-r ${gradient} p-4 sm:p-6 rounded-xl shadow-lg transition-transform transform hover:scale-105 text-center ${
              enabled ? "cursor-pointer" : "cursor-not-allowed opacity-70"
            }`}
          >
            <h3 className="text-sm md:text-md font-medium mb-2 text-white">
              {text}
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSetting(id);
              }}
              className={`mt-3 sm:mt-4 w-14 sm:w-16 h-7 sm:h-8 flex items-center rounded-full p-1 transition-all ${
                enabled ? "bg-green-500" : "bg-gray-400"
              }`}
            >
              <div
                className={`w-5 sm:w-6 h-5 sm:h-6 bg-white rounded-full shadow-md transform transition-transform ${
                  enabled ? "translate-x-6 sm:translate-x-8" : "translate-x-0"
                }`}
              ></div>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (enabled) openModal(); // Open modal only if enabled
              }}
              disabled={!enabled} // Disable button when not enabled
              className={`flex justify-center items-center w-full h-10 sm:h-12 rounded-lg shadow-md transition text-sm sm:text-base font-medium mt-4 ${
                enabled
                  ? "bg-white hover:bg-gray-100 text-gray-800 cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Manage
            </button>
          </div>
        ))}
      </div>
      <ProductFeatureModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        handleClose={closeModal}
        setProductFeatures={setProductFeatures}
      />
    </div>
  );
};

export default Campaign;