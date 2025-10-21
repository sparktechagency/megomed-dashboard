import { message, Tooltip } from 'antd';
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FiCopy, FiEye } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import { useReportedWithAdminMutation } from '../../features/report/ReportApi';

const ReportTableBody = ({ item, list }) => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminMessage, setAdminMessage] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  const [sendReportwithAdmin, { isLoading }] = useReportedWithAdminMutation();

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

  const showAdminModal = () => {
    setIsAdminModalOpen(true);
  };

  const handleAdminModalClose = () => {
    setIsAdminModalOpen(false);
    setAdminMessage("");
  };

  const handleSendToAdmin = async () => {
    if (!adminMessage.trim()) {
      alert("Please write a message before sending");
      return;
    }

    try {
      const result = await sendReportwithAdmin({
        id: item._id,
        data: { message: adminMessage }
      }).unwrap();

      message.success("Report sent to admin successfully!");
      handleAdminModalClose();
    } catch (error) {
      console.error("Failed to send report:", error);
      alert("Failed to send report. Please try again.");
    }
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
      case 'varified':
        return "bg-green-100 text-green-800";
      case 'pending':
        return "bg-yellow-100 text-yellow-800";
      case 'rejected':
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAvailabilityBadge = (isAvailable) => {
    return isAvailable
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  return (
    <>
      {/* Table Row */}
      <div className="grid items-center grid-cols-6 gap-2 px-2 my-3 text-sm bg-gray-100 rounded-lg whitespace-nowrap">
        {/* SL */}
        <div className="flex items-center justify-center py-3">{list}</div>

        {/* Reported By */}
        <div className="flex items-center justify-center py-3">
          {item.userId?.fullName || "N/A"}
        </div>

        {/* Report Text */}
        <div className="flex items-center justify-center py-3 truncate" title={item.text}>
          {item.text || "N/A"}
        </div>

        {/* Report Date */}
        <div className="flex items-center justify-center py-3">
          {formatDate(item.createdAt)}
        </div>

        {/* Action */}
        <div className="flex items-center col-span-2 justify-center gap-2">
          <button
            onClick={showViewModal}
            className="flex items-center justify-center gap-2 w-full text-center bg-primary text-white px-3 py-3 rounded hover:bg-primary/80 transition-colors"
            title="View Report Details"
          >
            <FiEye className="w-4 h-4" />
            View
          </button>

          <Tooltip title={item.isAction ? "Already Reported to Admin" : "Report with Admin"}>
            <button
              onClick={showAdminModal}
              disabled={item.isAction}
              className="flex items-center justify-center gap-1 bg-primary text-white px-3 py-3 rounded w-full hover:bg-primary/80 transition-colors"
              title="Report with Admin"
            >
              Report with Admin
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Report Details Modal */}
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
                Report Details
              </h2>

              {/* Modal Content */}
              <div className="space-y-4">
                {/* Report Information Section */}
                <div className="p-4 border rounded-md border-primary">
                  <h3 className="mb-3 text-lg font-semibold text-primary border-b pb-2">
                    Report Information
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Report ID:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {item._id ? `...${item._id.slice(-8)}` : "N/A"}
                        </span>
                        <FiCopy
                          className={`w-4 h-4 cursor-pointer hover:text-primary transition-colors ${copiedId === item._id ? "text-green-500" : "text-gray-400"}`}
                          title="Copy Report ID"
                          onClick={() => copyToClipboard(item._id, item._id)}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Report Text:</span>
                      <span className="text-sm max-w-[200px] text-right">{item.text || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Report Date:</span>
                      <span className="text-sm">{formatDateTime(item.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Last Updated:</span>
                      <span className="text-sm">{formatDateTime(item.updatedAt)}</span>
                    </div>
                  </div>
                </div>

                {/* User Information Section */}
                <div className="p-4 border rounded-md border-primary">
                  <h3 className="mb-3 text-lg font-semibold text-primary border-b pb-2">
                    User Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Full Name:</span> {item.userId?.fullName || "N/A"}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Email:</span> {item.userId?.email || "N/A"}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Role:</span>
                        <span className={`ml-2 px-2 py-1 rounded text-xs ${item.userId?.role === 'freelancer' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                          {item.userId?.role || "N/A"}
                        </span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Designation:</span> {item.userId?.designation || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Status:</span>
                        <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusBadge(item.userId?.isVarified)}`}>
                          {item.userId?.isVarified || "N/A"}
                        </span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Available:</span>
                        <span className={`ml-2 px-2 py-1 rounded text-xs ${getAvailabilityBadge(item.userId?.isAvailable)}`}>
                          {item.userId?.isAvailable ? "Available" : "Not Available"}
                        </span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Experience:</span> {item.userId?.yearsOfExperience || "N/A"}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Daily Rate:</span> ${item.userId?.dailyRate || 0}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Information Section */}
                <div className="p-4 border rounded-md border-primary">
                  <h3 className="mb-3 text-lg font-semibold text-primary border-b pb-2">
                    Additional Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Service Type:</span> {item.userId?.serviceType || "N/A"}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Category:</span> {item.userId?.categoryType || "N/A"}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Location:</span> {item.userId?.location || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Jobs Done:</span> {item.userId?.jobsDone || 0}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Followers:</span> {item.userId?.followers || 0}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Languages:</span> {item.userId?.language?.join(", ") || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Report Modal */}
      <AnimatePresence>
        {isAdminModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={handleAdminModalClose}
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
                onClick={handleAdminModalClose}
                className="absolute text-gray-500 top-3 right-3 hover:text-gray-800"
              >
                <IoCloseOutline className="w-6 h-6" />
              </button>

              <h2 className="mb-4 text-xl font-bold text-center text-primary">
                Report to Admin
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={adminMessage}
                    onChange={(e) => setAdminMessage(e.target.value)}
                    placeholder="Write your message to admin..."
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAdminModalClose}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendToAdmin}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 text-white bg-primary rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Sending..." : "Send"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ReportTableBody;