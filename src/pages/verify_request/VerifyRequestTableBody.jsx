import { Input, Tooltip, message as antMessage } from 'antd';
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FiCheck, FiClock, FiCopy, FiEye } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import { useUpdateStatusUserMutation } from '../../features/verifyRequest/VerifyRequestApi';
import { baseURLImage } from '../../utils/BaseURL';

const { TextArea } = Input;

const VerifyRequestTableBody = ({ item, list }) => {

  console.log(item)

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [revisionMessage, setRevisionMessage] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const [updateStatus, { isLoading }] = useUpdateStatusUserMutation();

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

  const showRevisionModal = () => {
    setIsRevisionModalOpen(true);
  };

  const handleRevisionModalClose = () => {
    setIsRevisionModalOpen(false);
    setRevisionMessage('');
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

  // Get status badge color and icon
  const getStatusBadge = (status) => {
    switch (status) {
      case 'varified':
        return {
          class: "bg-green-100 text-green-800 border border-green-200",
          icon: <FiCheck className="w-3 h-3 mr-1" />,
          text: "Verified"
        };
      case 'pending':
        return {
          class: "bg-yellow-100 text-yellow-800 border border-yellow-200",
          icon: <FiClock className="w-3 h-3 mr-1" />,
          text: "Pending"
        };
      case 'revision':
        return {
          class: "bg-orange-100 text-orange-800 border border-orange-200",
          icon: <FiClock className="w-3 h-3 mr-1" />,
          text: "Revision"
        };
      case 'rejected':
        return {
          class: "bg-red-100 text-red-800 border border-red-200",
          icon: <IoCloseOutline className="w-3 h-3 mr-1" />,
          text: "Rejected"
        };
      default:
        return {
          class: "bg-gray-100 text-gray-800 border border-gray-200",
          icon: null,
          text: status || "N/A"
        };
    }
  };

  // Get role badge color
  const getRoleBadge = (role) => {
    switch (role) {
      case 'freelancer':
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case 'client':
        return "bg-purple-100 text-purple-800 border border-purple-200";
      case 'company':
        return "bg-indigo-100 text-indigo-800 border border-indigo-200";
      case 'admin':
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  // ✅ Verified Flow - Only status, no message
  const handleVerified = async () => {
    try {
      const result = await updateStatus({
        id: item._id,
        status: 'varified',
        message: '' // No message for verification
      }).unwrap();

      if (result.success) {
        antMessage.success('Successfully Verified');
        handleModalClose();
      } else {
        antMessage.error(result.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      antMessage.error('Failed to verify user');
    }
  };

  // 🔄 Revision Flow - Status and message both
  const handleRevisionSubmit = async () => {
    if (!revisionMessage.trim()) {
      antMessage.warning('Please enter a revision message');
      return;
    }

    try {
      const result = await updateStatus({
        id: item._id,
        status: 'revision',
        message: revisionMessage.trim()
      }).unwrap();

      if (result.success) {
        antMessage.success('Revision Sent Successfully');
        handleRevisionModalClose();
        handleModalClose();
      } else {
        antMessage.error(result.message || 'Revision request failed');
      }
    } catch (error) {
      console.error('Revision error:', error);
      antMessage.error('Failed to send revision request');
    }
  };

  const statusInfo = getStatusBadge(item.isVarified);

  // Helper function to get file URL
  const getFileUrl = (filePath) => {
    if (!filePath) return null;
    const baseUrl = baseURLImage;
    return `${baseUrl}/${filePath.replace(/\\/g, '/')}`;
  };

  return (
    <>
      {/* Table Row */}
      <div className="grid items-center grid-cols-11 gap-2 px-2 my-3 text-sm bg-white rounded-lg whitespace-nowrap border border-gray-200 hover:bg-gray-50 transition-colors">
        {/* SL */}
        <div className="flex items-center justify-center py-3 font-medium">{list}</div>

        {/* User Name */}
        <div className="flex items-center justify-center py-3">
          <div className="text-center">
            <Tooltip title={item.fullName}>
              <div className="font-medium max-w-[120px] truncate cursor-pointer">
                {item.fullName?.length > 10
                  ? item.fullName.slice(0, 10) + "..."
                  : item.fullName || "N/A"}
              </div>
            </Tooltip>

            {item.companyName && (
              <Tooltip title={item.companyName}>
                <div className="text-xs text-gray-500 mt-1 max-w-[120px] truncate cursor-pointer">
                  {item.companyName.length > 15
                    ? item.companyName.slice(0, 15) + "..."
                    : item.companyName}
                </div>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center justify-center py-3">
          <Tooltip title={item.email}>
            <span className="text-xs md:text-sm max-w-[150px] truncate cursor-pointer">
              {item.email?.length > 20
                ? item.email.slice(0, 20) + "..."
                : item.email || "N/A"}
            </span>
          </Tooltip>
        </div>

        {/* Role */}
        <div className="flex items-center justify-center py-3">
          <span className={`px-2 py-1 rounded text-xs ${getRoleBadge(item.role)}`}>
            {item.role ? item.role.charAt(0).toUpperCase() + item.role.slice(1) : "N/A"}
          </span>
        </div>

        {/* Designation */}
        <div className="flex items-center justify-center py-3">
          {item.designation || item.role === 'company' ? 'Company' : item.role === 'client' ? 'Client' : 'N/A'}
        </div>

        {/* Location */}
        <div className="flex items-center justify-center py-3">
          {item.location || "N/A"}
        </div>

        {/* Experience */}
        <div className="flex items-center justify-center py-3">
          {item.yearsOfExperience || "N/A"}
        </div>

        {/* Daily Rate */}
        <div className="flex items-center justify-center py-3">
          {item.dailyRate ? `$${item.dailyRate}` : "N/A"}
        </div>

        {/* Verification Status */}
        <div className="flex items-center justify-center py-3">
          <span className={`px-2 py-1 rounded text-xs flex items-center ${statusInfo.class}`}>
            {statusInfo.icon}
            {statusInfo.text}
          </span>
        </div>

        {/* Registration Date */}
        <div className="flex items-center justify-center py-3">
          {formatDate(item.createdAt)}
        </div>

        {/* Action */}
        <div className="flex items-center justify-center py-3 space-x-2">
          <button
            onClick={showViewModal}
            className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors text-xs"
            title="View User Details"
          >
            <FiEye className="w-3 h-3" />
            View
          </button>
        </div>
      </div>

      {/* User Details Modal */}
      <AnimatePresence>
        {isViewModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            onClick={handleModalClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative w-full max-w-5xl p-6 bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleModalClose}
                className="absolute text-gray-500 top-3 right-3 hover:text-gray-800 z-10"
              >
                <IoCloseOutline className="w-6 h-6" />
              </button>

              <h2 className="mb-4 text-xl font-bold text-center text-primary">
                User Verification Details
              </h2>

              {/* Modal Content */}
              <div className="space-y-4">
                {/* Profile & Cover Photo Section */}
                <div className="p-4 border rounded-md border-primary">
                  <h3 className="mb-3 text-lg font-semibold text-primary border-b pb-2">
                    Profile Images
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Profile Photo */}
                    <div>
                      <p className="text-sm font-medium mb-2">Profile Photo:</p>
                      {item.profile && !item.profile.includes('default-user.jpg') ? (
                        <a
                          href={getFileUrl(item.profile)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <img
                            src={getFileUrl(item.profile)}
                            alt="Profile"
                            className="w-full h-48 object-cover rounded-lg border-2 border-gray-200 hover:border-primary transition-colors cursor-pointer"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/400x300?text=Profile+Image';
                            }}
                          />
                        </a>
                      ) : (
                        <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                          No Profile Photo
                        </div>
                      )}
                    </div>

                    {/* Cover Photo */}
                    <div>
                      <p className="text-sm font-medium mb-2">Cover Photo:</p>
                      {item.coverPhoto ? (
                        <a
                          href={getFileUrl(item.coverPhoto)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <img
                            src={getFileUrl(item.coverPhoto)}
                            alt="Cover"
                            className="w-full h-48 object-cover rounded-lg border-2 border-gray-200 hover:border-primary transition-colors cursor-pointer"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/400x300?text=Cover+Image';
                            }}
                          />
                        </a>
                      ) : (
                        <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                          No Cover Photo
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Basic Information Section */}
                <div className="p-4 border rounded-md border-primary">
                  <h3 className="mb-3 text-lg font-semibold text-primary border-b pb-2">
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">User ID:</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-mono">
                            {item._id ? `...${item._id.slice(-8)}` : "N/A"}
                          </span>
                          <FiCopy
                            className={`w-4 h-4 cursor-pointer hover:text-primary transition-colors ${copiedId === item._id ? "text-green-500" : "text-gray-400"}`}
                            title="Copy User ID"
                            onClick={() => copyToClipboard(item._id, item._id)}
                          />
                        </div>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Full Name:</span> {item.fullName || "N/A"}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Email:</span> {item.email || "N/A"}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Role:</span>
                        <span className={`ml-2 px-2 py-1 rounded text-xs ${getRoleBadge(item.role)}`}>
                          {item.role ? item.role.charAt(0).toUpperCase() + item.role.slice(1) : "N/A"}
                        </span>
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Verification Status:</span>
                        <span className={`ml-2 px-2 py-1 rounded text-xs flex items-center w-fit ${statusInfo.class}`}>
                          {statusInfo.icon}
                          {statusInfo.text}
                        </span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Registration Date:</span> {formatDateTime(item.createdAt)}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Last Updated:</span> {formatDateTime(item.updatedAt)}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Active Status:</span>
                        <span className={`ml-2 px-2 py-1 rounded text-xs ${item.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {item.isActive ? "Active" : "Inactive"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Professional Information Section */}
                <div className="p-4 border rounded-md border-primary">
                  <h3 className="mb-3 text-lg font-semibold text-primary border-b pb-2">
                    Professional Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Designation:</span> {item.designation || "N/A"}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Location:</span> {item.location || "N/A"}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Experience:</span> {item.yearsOfExperience || "N/A"}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Daily Rate:</span> {item.dailyRate ? `$${item.dailyRate}` : "N/A"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Service Type:</span> {item.serviceType || "N/A"}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Category:</span> {item.categoryType || "N/A"}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Jobs Done:</span> {item.jobsDone || 0}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Followers:</span> {item.followers || 0}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Details Section */}
                <div className="p-4 border rounded-md border-primary">
                  <h3 className="mb-3 text-lg font-semibold text-primary border-b pb-2">
                    Additional Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Languages:</span> {item.language?.join(", ") || "N/A"}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Stripe Connected:</span>
                        <span className={`ml-2 px-2 py-1 rounded text-xs ${item.isStripeConnectedAccount ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {item.isStripeConnectedAccount ? "Yes" : "No"}
                        </span>
                      </p>
                      {item.companyName && (
                        <p className="text-sm">
                          <span className="font-medium">Company Name:</span> {item.companyName}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Free Job Posts:</span> {item.freeJobPost || 0}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Subscribed:</span>
                        <span className={`ml-2 px-2 py-1 rounded text-xs ${item.isSubscribed ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                          {item.isSubscribed ? "Yes" : "No"}
                        </span>
                      </p>
                    </div>
                  </div>
                  {item.aboutCompany && (
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-2">About Company:</p>
                      <div className="p-3 bg-gray-50 rounded text-sm">
                        {item.aboutCompany}
                      </div>
                    </div>
                  )}
                </div>

                {/* Client Documents Section - Only for Clients */}
                {item.role === 'client' && item.clientId && (
                  <div className="p-4 border rounded-md border-primary">
                    <h3 className="mb-3 text-lg font-semibold text-primary border-b pb-2">
                      Client Documents & Verification Files
                    </h3>
                    <div className="space-y-4">
                      {/* Company Information */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium mb-1">Registration Number (SIREN):</p>
                          <div className="p-2 bg-gray-50 rounded text-xs font-mono">
                            {item.clientId.registrationNumber || "N/A"}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">Establishment Number (SIRET):</p>
                          <div className="p-2 bg-gray-50 rounded text-xs font-mono">
                            {item.clientId.establishmentNumber || "N/A"}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">VAT Number:</p>
                          <div className="p-2 bg-gray-50 rounded text-xs font-mono">
                            {item.clientId.clientVatNumber || "N/A"}
                          </div>
                        </div>
                      </div>

                      {/* Document Files */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        {/* RC File */}
                        <div className="border-2 rounded-lg p-3 hover:shadow-lg transition-shadow">
                          <p className="text-sm font-medium mb-2 text-center text-gray-700">RC Document</p>
                          {item.clientId.clientRCFile ? (
                            <a
                              href={getFileUrl(item.clientId.clientRCFile)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block"
                            >
                              {item.clientId.clientRCFile.toLowerCase().endsWith('.pdf') ? (
                                <div className="bg-red-50 p-6 rounded-lg text-center hover:bg-red-100 transition-colors cursor-pointer">
                                  <FiEye className="w-10 h-10 mx-auto text-red-500 mb-2" />
                                  <p className="text-xs text-red-600 font-medium">View PDF Document</p>
                                </div>
                              ) : (
                                <img
                                  src={getFileUrl(item.clientId.clientRCFile)}
                                  alt="RC Document"
                                  className="w-full h-40 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                  onError={(e) => {
                                    e.target.parentElement.innerHTML = '<div class="bg-gray-100 p-6 rounded-lg text-center"><p class="text-gray-400 text-xs">Unable to load image</p></div>';
                                  }}
                                />
                              )}
                            </a>
                          ) : (
                            <div className="bg-gray-100 p-6 rounded-lg text-center text-gray-400 text-xs">
                              No RC Document Uploaded
                            </div>
                          )}
                        </div>

                        {/* KBIS File */}
                        <div className="border-2 rounded-lg p-3 hover:shadow-lg transition-shadow">
                          <p className="text-sm font-medium mb-2 text-center text-gray-700">KBIS Document</p>
                          {item.clientId.clientKBISFile ? (
                            <a
                              href={getFileUrl(item.clientId.clientKBISFile)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block"
                            >
                              {item.clientId.clientKBISFile.toLowerCase().endsWith('.pdf') ? (
                                <div className="bg-blue-50 p-6 rounded-lg text-center hover:bg-blue-100 transition-colors cursor-pointer">
                                  <FiEye className="w-10 h-10 mx-auto text-blue-500 mb-2" />
                                  <p className="text-xs text-blue-600 font-medium">View PDF Document</p>
                                </div>
                              ) : (
                                <img
                                  src={getFileUrl(item.clientId.clientKBISFile)}
                                  alt="KBIS Document"
                                  className="w-full h-40 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                  onError={(e) => {
                                    e.target.parentElement.innerHTML = '<div class="bg-gray-100 p-6 rounded-lg text-center"><p class="text-gray-400 text-xs">Unable to load image</p></div>';
                                  }}
                                />
                              )}
                            </a>
                          ) : (
                            <div className="bg-gray-100 p-6 rounded-lg text-center text-gray-400 text-xs">
                              No KBIS Document Uploaded
                            </div>
                          )}
                        </div>

                        {/* Certificate File */}
                        <div className="border-2 rounded-lg p-3 hover:shadow-lg transition-shadow">
                          <p className="text-sm font-medium mb-2 text-center text-gray-700">Certificate</p>
                          {item.clientId.clientCertificateFile ? (
                            <a
                              href={getFileUrl(item.clientId.clientCertificateFile)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block"
                            >
                              {item.clientId.clientCertificateFile.toLowerCase().endsWith('.pdf') ? (
                                <div className="bg-green-50 p-6 rounded-lg text-center hover:bg-green-100 transition-colors cursor-pointer">
                                  <FiEye className="w-10 h-10 mx-auto text-green-500 mb-2" />
                                  <p className="text-xs text-green-600 font-medium">View PDF Document</p>
                                </div>
                              ) : (
                                <img
                                  src={getFileUrl(item.clientId.clientCertificateFile)}
                                  alt="Certificate"
                                  className="w-full h-40 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                  onError={(e) => {
                                    e.target.parentElement.innerHTML = '<div class="bg-gray-100 p-6 rounded-lg text-center"><p class="text-gray-400 text-xs">Unable to load image</p></div>';
                                  }}
                                />
                              )}
                            </a>
                          ) : (
                            <div className="bg-gray-100 p-6 rounded-lg text-center text-gray-400 text-xs">
                              No Certificate Uploaded
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Freelancer Documents Section - Only for Freelancers */}
                {item.role === 'freelancer' && item.freelancerId && (
                  <div className="p-4 border rounded-md border-primary">
                    <h3 className="mb-3 text-lg font-semibold text-primary border-b pb-2">
                      Freelancer Documents & Certifications
                    </h3>
                    <div className="space-y-4">
                      {/* Skills */}
                      {item.freelancerId.skills && item.freelancerId.skills.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2">Skills:</p>
                          <div className="flex flex-wrap gap-2">
                            {item.freelancerId.skills.map((skill, index) => (
                              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Academic Certificates */}
                      {item.freelancerId.academicCertificateFiles && item.freelancerId.academicCertificateFiles.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-3">Academic Certificates:</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {item.freelancerId.academicCertificateFiles.map((file, index) => (
                              <div key={index} className="border-2 rounded-lg p-3 hover:shadow-lg transition-shadow">
                                <p className="text-xs font-medium mb-2 text-center text-gray-600">Certificate {index + 1}</p>
                                <a
                                  href={getFileUrl(file)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block"
                                >
                                  {file.toLowerCase().endsWith('.pdf') ? (
                                    <div className="bg-purple-50 p-6 rounded-lg text-center hover:bg-purple-100 transition-colors cursor-pointer">
                                      <FiEye className="w-10 h-10 mx-auto text-purple-500 mb-2" />
                                      <p className="text-xs text-purple-600 font-medium">View PDF Certificate</p>
                                    </div>
                                  ) : (
                                    <img
                                      src={getFileUrl(file)}
                                      alt={`Certificate ${index + 1}`}
                                      className="w-full h-40 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                      onError={(e) => {
                                        e.target.parentElement.innerHTML = '<div class="bg-gray-100 p-6 rounded-lg text-center"><p class="text-gray-400 text-xs">Unable to load certificate</p></div>';
                                      }}
                                    />
                                  )}
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Education Certifications */}
                      {item.freelancerId.educationCertifications && item.freelancerId.educationCertifications.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-3">Education & Certifications:</p>
                          <div className="space-y-3">
                            {item.freelancerId.educationCertifications.map((edu, index) => (
                              <div key={index} className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                  <p className="text-sm">
                                    <span className="font-medium text-gray-700">Degree:</span>
                                    <span className="ml-2 text-gray-900">{edu.degree || "N/A"}</span>
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium text-gray-700">Institution:</span>
                                    <span className="ml-2 text-gray-900">{edu.institution || "N/A"}</span>
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium text-gray-700">Year:</span>
                                    <span className="ml-2 text-gray-900">{edu.year || "N/A"}</span>
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Experience */}
                      {item.freelancerId.experience && item.freelancerId.experience.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-3">Work Experience:</p>
                          <div className="space-y-3">
                            {item.freelancerId.experience.map((exp, index) => (
                              <div key={index} className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                  <p className="text-sm">
                                    <span className="font-medium text-gray-700">Position:</span>
                                    <span className="ml-2 text-gray-900">{exp.position || "N/A"}</span>
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium text-gray-700">Company:</span>
                                    <span className="ml-2 text-gray-900">{exp.company || "N/A"}</span>
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium text-gray-700">Duration:</span>
                                    <span className="ml-2 text-gray-900">{exp.duration || "N/A"}</span>
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Social Links */}
                      {item.freelancerId.socialLinks && item.freelancerId.socialLinks.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2">Social Links:</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {item.freelancerId.socialLinks.map((link, index) => (
                              <a
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg text-sm text-blue-600 hover:bg-blue-50 hover:text-blue-800 transition-colors"
                              >
                                <FiEye className="w-4 h-4" />
                                <span className="font-medium">{link.platform || "Link"}:</span>
                                <span className="truncate">{link.url}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* If no documents */}
                      {(!item.freelancerId.academicCertificateFiles || item.freelancerId.academicCertificateFiles.length === 0) &&
                        (!item.freelancerId.educationCertifications || item.freelancerId.educationCertifications.length === 0) &&
                        (!item.freelancerId.skills || item.freelancerId.skills.length === 0) &&
                        (!item.freelancerId.experience || item.freelancerId.experience.length === 0) && (
                          <div className="text-center py-8 text-gray-400">
                            <FiClock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p className="text-sm">No documents or certifications uploaded yet</p>
                          </div>
                        )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-center gap-5 pt-4 border-t">
                  <button
                    onClick={showRevisionModal}
                    disabled={isLoading}
                    className="px-10 py-3 bg-[#C68C4E] text-white rounded-md hover:bg-[#B57A3A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                  >
                    <FiClock className="w-4 h-4" />
                    {isLoading ? 'Processing...' : 'Request Revision'}
                  </button>
                  <button
                    onClick={handleVerified}
                    disabled={isLoading}
                    className="px-10 py-3 bg-green-500 rounded-md text-white hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                  >
                    <FiCheck className="w-4 h-4" />
                    {isLoading ? 'Processing...' : 'Verify User'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Revision Modal */}
      <AnimatePresence>
        {isRevisionModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 p-4"
            onClick={handleRevisionModalClose}
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
                onClick={handleRevisionModalClose}
                className="absolute text-gray-500 top-3 right-3 hover:text-gray-800"
              >
                <IoCloseOutline className="w-6 h-6" />
              </button>

              <h2 className="mb-4 text-xl font-bold text-center text-[#C68C4E]">
                Request Revision
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Revision Message <span className="text-red-500">*</span>
                  </label>
                  <TextArea
                    rows={6}
                    placeholder="Please provide detailed feedback about what needs to be revised for verification...&#10;&#10;Example:&#10;- Document quality is not clear&#10;- Missing required certificate&#10;- Profile information incomplete"
                    value={revisionMessage}
                    onChange={(e) => setRevisionMessage(e.target.value)}
                    className="w-full border-gray-300 focus:border-[#C68C4E] focus:ring-[#C68C4E]"
                    maxLength={500}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500">
                      This message will be sent to the user explaining what needs to be revised.
                    </p>
                    <p className="text-xs text-gray-400">
                      {revisionMessage.length}/500
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleRevisionModalClose}
                    disabled={isLoading}
                    className="flex-1 bg-gray-500 text-white py-3 rounded hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRevisionSubmit}
                    disabled={isLoading || !revisionMessage.trim()}
                    className="flex-1 bg-[#C68C4E] text-white py-3 rounded hover:bg-[#B57A3A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                  >
                    {isLoading ? (
                      <>
                        <FiClock className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <FiCheck className="w-4 h-4" />
                        Send Revision Request
                      </>
                    )}
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

export default VerifyRequestTableBody;