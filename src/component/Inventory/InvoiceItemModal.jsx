import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

const InvoiceItemModal = ({ open, handleClose, items }) => {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Invoice Items</DialogTitle>
      <DialogContent>
        {items.length === 0 ? (
          <p className="text-gray-500">No items available.</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item._id} className="border-b pb-2 mb-2">
                <p>
                  <span className="font-semibold">Product ID:</span>{" "}
                  {item.productId}
                </p>
                <p>
                  <span className="font-semibold">Color:</span> {item.colorName}
                </p>
                <p>
                  <span className="font-semibold">Size:</span> {item.sizeName}
                </p>
                <p>
                  <span className="font-semibold">Quantity:</span> {item.quantity}
                </p>
                <p>
                  <span className="font-semibold">Price:</span> $
                  {item.price.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <button
          onClick={handleClose}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Close
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default InvoiceItemModal;