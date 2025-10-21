import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { FiEye } from "react-icons/fi";
import { FiCopy } from "react-icons/fi";

const EarningTableRow = ({ item, list }) => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [itemId, setItemId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date) ? dateString : date.toLocaleDateString("en-GB");
  };

  const showViewModal = async (id) => {
    setIsViewModalOpen(true);
    setItemId(id);
  };

  const handleModalClose = () => {
    setIsViewModalOpen(false);
  };

  const copyToClipboard = async (text, id) => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers or non-HTTPS contexts
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);

        if (!successful) {
          throw new Error("Copy command was unsuccessful");
        }
      }

      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy: ", err);
      // You could add a toast notification here to inform the user
    }
  };

  // Calculate days between dates
  const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return "N/A";
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start) || isNaN(end)) return "N/A";
    const diffTime = end - start;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <>
      {/* Table Row with Improved Alignment */}
      <div className="grid items-center grid-cols-10 gap-2 px-2 my-3 text-sm bg-gray-100 rounded-lg whitespace-nowrap">
        <div className="flex items-center justify-center py-3">{list}</div>
        <div className="flex items-center justify-center py-3">
          {item.userId?.fullName || "N/A"}
        </div>
        <div className="flex items-center justify-center py-3">
          {item.userId?.fullName || "N/A"}{" "}
          {/* Freelancer Name - using same field for now */}
        </div>
        <div className="flex items-center justify-center py-3">
          {item.subcriptionId ? "Subscription Payment" : "Invoice Payment"}
        </div>
        <div className="flex items-center justify-center py-3">
          {(() => {
            // Try multiple fields to get the full ID
            const fullId =
              item.invoiceId ||
              item.subcriptionId ||
              item.transactionId ||
              item._id;
            if (!fullId) return "N/A";
            const shortId =
              fullId.length > 6 ? `...${fullId.slice(-6)}` : fullId;
            const isCopied = copiedId === fullId;
            return (
              <div className="flex items-center gap-1">
                <span
                  className="cursor-pointer hover:text-primary transition-colors"
                  title={`Click to copy: ${fullId}`}
                  onClick={() => copyToClipboard(fullId, fullId)}
                >
                  {shortId}
                </span>
                <FiCopy
                  className={`w-3 h-3 cursor-pointer hover:text-primary transition-colors ${
                    isCopied ? "text-green-500" : "text-gray-400"
                  }`}
                  title="Copy full ID"
                  onClick={() => copyToClipboard(fullId, fullId)}
                />
                {isCopied && (
                  <span className="text-xs text-green-500 ml-1">Copied!</span>
                )}
              </div>
            );
          })()}
        </div>
        <div className="flex items-center justify-center py-3">
          {item.paymentType || "N/A"}
        </div>

        <div className="flex items-center justify-center py-3">
          ${item.amount || 0}
        </div>
        <div className="flex items-center justify-center py-3">
          ${item.transferAmount || 0}
        </div>
        <div className="flex items-center justify-center py-3">
          <span
            className={`px-2 py-1 rounded text-xs ${
              item.status === "paid"
                ? "bg-green-100 text-green-800"
                : item.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : item.status === "failed"
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {item.status || "N/A"}
          </span>
        </div>
        <div className="flex items-center justify-center py-3">
          <button
            onClick={() => showViewModal(item._id)}
            className="bg-primary text-white px-3 py-1 rounded hover:bg-primary/80 transition-colors"
          >
            <FiEye className="inline w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Booking Details Modal */}
      <AnimatePresence>
        {isViewModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={handleModalClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleModalClose}
                className="absolute text-gray-500 top-3 right-3 hover:text-gray-800"
              >
                <IoCloseOutline className="w-6 h-6" />
              </button>

              <h2 className="mb-4 text-xl font-bold text-center text-primary">
                Earning Details
              </h2>

              {/* Modal Content */}
              <div className="px-3 py-4 space-y-3 border rounded-md border-primary">
                {/* User Information Section */}
                <div>
                  <h3 className="mb-2 text-base font-semibold text-primary">
                    User Information
                  </h3>
                  <div className="flex flex-col gap-2 p-3 bg-gray-100 rounded-md">
                    <p className="text-sm">
                      <span className="font-medium">Client Name:</span>{" "}
                      {item.userId?.fullName || "N/A"}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Email:</span>{" "}
                      {item.userId?.email || "N/A"}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Role:</span>{" "}
                      {item.userId?.role || "N/A"}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Payment Type:</span>{" "}
                      {item.paymentType || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Financial Details Section */}
                <div>
                  <h3 className="mb-2 text-base font-semibold text-primary">
                    Financial Details
                  </h3>
                  <div className="flex flex-col gap-2 p-3 bg-gray-100 rounded-md">
                    <p className="text-sm">
                      <span className="font-medium">Payment Method:</span>{" "}
                      {item.method || "N/A"}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Transaction ID:</span>{" "}
                      {item.transactionId || "N/A"}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">
                        Invoice/Subscription ID:
                      </span>{" "}
                      {item.invoiceId || item.subcriptionId || "N/A"}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Amount:</span> $
                      {item.amount || 0}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Transfer Amount:</span> $
                      {item.transferAmount || 0}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Is Refund:</span>{" "}
                      {item.isRefund ? "Yes" : "No"}
                    </p>
                  </div>
                </div>

                {/* Status Information Section */}
                <div>
                  <h3 className="mb-2 text-base font-semibold text-primary">
                    Status Information
                  </h3>
                  <div className="flex flex-col gap-2 p-3 bg-gray-100 rounded-md">
                    <p className="text-sm">
                      <span className="font-medium">Status:</span>{" "}
                      <span
                        className={`ml-2 px-2 py-1 rounded text-xs ${
                          item.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : item.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : item.status === "failed"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.status || "N/A"}
                      </span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Transaction Date:</span>{" "}
                      {formatDate(item.transactionDate)}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Created At:</span>{" "}
                      {formatDate(item.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EarningTableRow;
