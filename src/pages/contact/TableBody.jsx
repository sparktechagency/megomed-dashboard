import { Tooltip } from 'antd';
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FiCopy, FiEye } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";

const TableBody = ({ item, list }) => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date) ? dateString : date.toLocaleDateString("en-GB");
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date) ? dateString : date.toLocaleString("en-GB");
  };

  const showViewModal = () => {
    setIsViewModalOpen(true);
  };

  const handleModalClose = () => {
    setIsViewModalOpen(false);
  };

  const copyToClipboard = async (text, id) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
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
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return "bg-green-100 text-green-800";
      case 'pending':
        return "bg-yellow-100 text-yellow-800";
      case 'rejected':
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      {/* Table Row */}
      <div className="grid items-center grid-cols-8 gap-2 px-2 my-3 text-sm bg-gray-100 rounded-lg whitespace-nowrap">
        {/* SL */}
        <div className="flex items-center justify-center py-3">{list}</div>

        {/* Full Name */}
        <div className="flex items-center justify-center py-3">
          {item.fullName || "N/A"}
        </div>


        <div className="px-3 py-3 text-center">
          <Tooltip title={item.email}>
            <span className="inline-block max-w-[100px] truncate cursor-pointer">
              {item.email || "N/A"}
            </span>
          </Tooltip>
        </div>

        {/* Phone Number */}
        <div className="flex items-center justify-center py-3">
          {item.phoneNumber || "N/A"}
        </div>



        <div className="px-3 py-3 text-center">
          <Tooltip title={item.message}>
            <span className="inline-block max-w-[160px] truncate cursor-pointer">
              {item.message || "N/A"}
            </span>
          </Tooltip>
        </div>

        {/* Status */}
        <div className="flex items-center justify-center py-3">
          <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(item.status)}`}>
            {item.status || "N/A"}
          </span>
        </div>

        {/* Date */}
        <div className="flex items-center justify-center py-3">
          {formatDate(item.createdAt)}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={showViewModal}
            className="flex items-center justify-center gap-2 w-full text-center bg-primary text-white px-3 py-3 rounded hover:bg-primary/80 transition-colors"
            title="View Contact Details"
          >
            <FiEye className="w-4 h-4" />
            View
          </button>
        </div>
      </div>

      {/* Contact Details Modal */}
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
              className="relative w-full max-w-2xl p-6 bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleModalClose}
                className="absolute text-gray-500 top-3 right-3 hover:text-gray-800"
              >
                <IoCloseOutline className="w-6 h-6" />
              </button>

              <h2 className="mb-4 text-xl font-bold text-center text-primary">
                Contact Details
              </h2>

              {/* Modal Content */}
              <div className="space-y-4">
                {/* Contact Information Section */}
                <div className="p-4 border rounded-md border-primary">
                  <h3 className="mb-3 text-lg font-semibold text-primary border-b pb-2">
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Contact ID:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {item._id ? `...${item._id.slice(-8)}` : "N/A"}
                        </span>
                        <FiCopy
                          className={`w-4 h-4 cursor-pointer hover:text-primary transition-colors ${copiedId === item._id ? "text-green-500" : "text-gray-400"}`}
                          title="Copy Contact ID"
                          onClick={() => copyToClipboard(item._id, item._id)}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(item.status)}`}>
                        {item.status || "N/A"}
                      </span>
                    </div>







                    <div className="flex justify-between">
                      <span className="font-medium">Submitted Date:</span>
                      <span className="text-sm">{formatDateTime(item.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Last Updated:</span>
                      <span className="text-sm">{formatDateTime(item.updatedAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Personal Information Section */}
                <div className="p-4 border rounded-md border-primary">
                  <h3 className="mb-3 text-lg font-semibold text-primary border-b pb-2">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Full Name:</span> {item.fullName || "N/A"}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Email:</span> {item.email || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Phone Number:</span> {item.phoneNumber || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Message Section */}
                <div className="p-4 border rounded-md border-primary">
                  <h3 className="mb-3 text-lg font-semibold text-primary border-b pb-2">
                    Message
                  </h3>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm whitespace-pre-wrap">
                      {item.message || "No message provided"}
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

export default TableBody;