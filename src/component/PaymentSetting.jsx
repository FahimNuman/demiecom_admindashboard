import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PaymentSetting = () => {
  const navigate = useNavigate();
  const [enabledPayments, setEnabledPayments] = useState({
    stripe: false,
    paypal: false,
    authorizeNet: false,
    cod: false,
  });

  const togglePayment = (method) => {
    setEnabledPayments((prev) => ({
      ...prev,
      [method]: !prev[method],
    }));
  };

  const navigateToSettings = (method) => {
    if (method === "stripe") {
      navigate("/stripesetting");
    } else if (method === "authorizeNet") {
      navigate("/authorizenetsetting");
    } else if (method === "cod") {
      navigate("/cod");
    } else {
      navigate(`/${method}setting`);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4 sm:p-6">
      <h2 className="text-2xl sm:text-2xl font-bold mb-6 sm:mb-8 text-gray-800">
        Payment Settings
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full max-w-5xl">
        {/* Payment Methods */}
        {[
          { id: "stripe", text: "Stripe", gradient: "from-cyan-400 to-cyan-500" },
          { id: "authorizeNet", text: "AuthorizeNet", gradient: "from-teal-400 to-teal-700" },
          { id: "cod", text: "COD", gradient: "from-blue-500 to-blue-700" },
        ].map(({ id, text, gradient }) => (
          <div
            key={id}
            className={`flex flex-col items-center bg-gradient-to-r ${gradient} p-4 sm:p-6 rounded-xl shadow-lg transition-transform transform hover:scale-105`}
          >
            <button
              onClick={() => navigateToSettings(id)}
              className="flex justify-center items-center w-full sm:w-32 h-10 sm:h-12 bg-white rounded-lg shadow-md hover:bg-gray-100 transition text-sm sm:text-base font-medium text-gray-800 truncate px-2"
            >
              {text}
            </button>
            <button
              onClick={() => togglePayment(id)}
              className={`mt-3 sm:mt-4 w-14 sm:w-16 h-7 sm:h-8 flex items-center rounded-full p-1 transition-all ${
                enabledPayments[id] ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-5 sm:w-6 h-5 sm:h-6 bg-white rounded-full shadow-md transform transition-transform ${
                  enabledPayments[id] ? "translate-x-6 sm:translate-x-8" : "translate-x-0"
                }`}
              ></div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentSetting;