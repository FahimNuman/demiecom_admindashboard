import React, { useRef } from "react";
import jsPDF from "jspdf";

const Invoice = ({ order = {} }) => {
  const invoiceRef = useRef();

  const handleDownload = () => {
    const doc = new jsPDF("p", "pt", "a4");
    const content = invoiceRef.current;

    doc.html(content, {
      callback: function (doc) {
        doc.save("invoice.pdf");
      },
      x: 10,
      y: 10,
      html2canvas: { scale: 0.7 },
    });
  };

  const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  };

  return (
    <div className="p-8 bg-white shadow-md rounded-md max-w-4xl mx-auto">
      <div className="flex justify-end mb-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          onClick={handleDownload}
        >
          Print/Download Invoice
        </button>
      </div>

      <div ref={invoiceRef}>
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold">Demi UI.</h1>
            <p className="text-sm">32-41 79th Street, East Elmhurst, NY 11370, USA</p>
            <p className="text-sm">Tel: incomming</p>
            <p className="text-sm">E-mail: hello@demiui.com</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-right">Invoice</h2>
            <table className="text-sm mt-2 border-collapse border border-gray-300">
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-gray-700 font-medium">Date:</td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-600">
                    {new Date(order?.createdAt).toLocaleDateString() || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-gray-700 font-medium">Order ID:</td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-600">
                    {order?._id || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-gray-700 font-medium">Status:</td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-600">{order?.status || "Pending"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Address Section */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-sm mb-4">Bill To:</h3>
            <div className="border border-gray-300 p-4 min-h-[80px]">
              <p className="text-sm">
                {order?.address?.street}, {order?.address?.city},{" "}
                {order?.address?.state}, {order?.address?.zip}
              </p>
              <p className="text-sm">{order?.address?.country}</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-4">Ship To:</h3>
            <div className="border border-gray-300 p-4 min-h-[80px]">
              <p className="text-sm">Same as billing address</p>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div>
          <h3 className="font-semibold text-sm mb-4">Order Details:</h3>
          <table className="w-full border border-gray-300 text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Item</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Color</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Size</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Quantity</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Price</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order?.carts?.map((cart) =>
                cart.items.map((item) =>
                  item.colors.map((color) =>
                    color.sizes.map((size) => (
                      <tr key={size._id}>
                        <td className="border border-gray-300 px-2 py-1">{item.product_id}</td>
                        <td className="border border-gray-300 px-2 py-1">{color?.name}</td>
                        <td className="border border-gray-300 px-2 py-1">{size?.name}</td>
                        <td className="border border-gray-300 px-2 py-1">{size.quantity}</td>
                        <td className="border border-gray-300 px-2 py-1">{formatCurrency(size.price)}</td>
                      
                      </tr>
                    ))
                  )
                )
              )}
              {!order?.carts?.length && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500 border">
                    No items in this order.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Payment and Total */}
        <div className="flex justify-between items-center mt-8 border-t pt-4">
          <div>
            <h3 className="font-semibold text-sm">Payment Method:</h3>
            <p className="text-sm">{order?.paymentDetails?.method || "N/A"}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm">Total:</h3>
            <p className="text-lg font-bold">{formatCurrency(order?.total || 0, "USD")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
