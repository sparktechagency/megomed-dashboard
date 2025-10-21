import { CloseOutlined, EyeOutlined } from "@ant-design/icons";
import { Avatar, Button, Modal } from "antd";
import { useState } from "react";

const ProjectManagementTableBody = ({ user, list }) => {
  const [userDetailsModalVisible, setUserDetailsModalVisible] = useState(false);

  const handleViewDetails = () => {
    setUserDetailsModalVisible(true);
  };

  // Format date to DD-MM-YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Helper function to safely access nested properties
  const safeGet = (obj, path, defaultValue = "N/A") => {
    try {
      const result = path.split(".").reduce((acc, part) => {
        if (acc && acc[part] !== undefined && acc[part] !== null) {
          return acc[part];
        }
        return undefined;
      }, obj);

      return result !== undefined ? result : defaultValue;
    } catch (error) {
      return defaultValue;
    }
  };

  return (
    <>
      <div className="grid grid-cols-11 my-3 text-sm bg-gray-100 rounded-lg whitespace-nowrap">
        <div className="py-3 text-center">{list}</div>
        <div className="px-3 py-3 text-center">
          {safeGet(user, "clientUserId.fullName")}
        </div>
        <div className="px-3 py-3 text-center ">
          {safeGet(user, "freelancerUserId.fullName")}
        </div>
        <div className="px-4 py-3 text-center  overflow-auto">
          {safeGet(user, "tenderId.title")}
        </div>
        <div className="px-4 py-3 text-center">{user.invoiceType}</div>
        <div className="px-4 py-3 text-center">{user.serviceType}</div>
        <div className="px-4 py-3 text-center">${user.amount}</div>
        <div className="px-4 py-3 text-center">{formatDate(user.date)}</div>
        <div
          className={`flex items-center justify-center py-3 ${
            user.status === "delivered" ? "text-green-500" : "text-yellow-500"
          }`}
        >
          {user.status}
        </div>
        <div
          className={`flex items-center justify-center py-3 ${
            user.paymentStatus === "pending" ? "text-red-500" : "text-green-500"
          }`}
        >
          {user.paymentStatus}
        </div>
        <div className="border rounded border-primary flex h-11 mt-1 justify-center w-4/12 mx-auto items-center">
          <Button
            type="text"
            icon={<EyeOutlined style={{ fontSize: "18px" }} />}
            className="text-primary hover:text-primary w-32"
            onClick={handleViewDetails}
          />
        </div>
      </div>

      <Modal
        open={userDetailsModalVisible}
        onCancel={() => setUserDetailsModalVisible(false)}
        footer={null}
        closable={false}
        width={500}
        centered
        className="user-details-modal"
      >
        <div className="relative">
          {/* Custom Close Button */}
          <Button
            type="text"
            icon={<CloseOutlined />}
            className="absolute top-0 right-0 text-primary hover:text-primary text-lg"
            onClick={() => setUserDetailsModalVisible(false)}
            style={{
              border: "2px solid #002282",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />

          {/* Modal Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold mb-4">Invoice Details</h2>
          </div>

          {/* Invoice Details */}
          <div className="border border-primary p-6 rounded-lg">
            <div className="space-y-4">
              <div className="flex gap-1 items-center py-2">
                <span className="font-medium">Project Name:</span>
                <span>{safeGet(user, "tenderId.title")}</span>
              </div>

              <div className="flex gap-1 items-center py-2">
                <span className="font-medium">Description:</span>
                <span>{safeGet(user, "tenderId.description")}</span>
              </div>

              <div className="flex gap-1 items-center py-2">
                <span className="font-medium">Invoice Type:</span>
                <span>{user.invoiceType}</span>
              </div>

              <div className="flex gap-1 items-center py-2">
                <span className="font-medium">Client:</span>
                <span>{safeGet(user, "clientUserId.fullName")}</span>
              </div>

              <div className="flex gap-1 items-center py-2">
                <span className="font-medium">Freelancer:</span>
                <span>{safeGet(user, "freelancerUserId.fullName")}</span>
              </div>

              <div className="flex gap-1 items-center py-2">
                <span className="font-medium">Service Type:</span>
                <span>{user.serviceType}</span>
              </div>

              <div className="flex gap-1 items-center py-2">
                <span className="font-medium">Amount:</span>
                <span>${user.amount}</span>
              </div>

              <div className="flex gap-1 items-center py-2">
                <span className="font-medium">Date:</span>
                <span>{formatDate(user.date)}</span>
              </div>

              <div className="flex gap-1 items-center py-2">
                <span className="font-medium">Status:</span>
                <span
                  className={`capitalize ${
                    user.status === "delivered"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {user.status}
                </span>
              </div>

              <div className="flex gap-1 items-center py-2">
                <span className="font-medium">Payment Status:</span>
                <span
                  className={`capitalize ${
                    user.paymentStatus === "pending"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {user.paymentStatus}
                </span>
              </div>

              {user.deliveryFiles && user.deliveryFiles.length > 0 && (
                <div className="flex gap-1 items-center py-2">
                  <span className="font-medium">Delivery Files:</span>
                  <span>{user.deliveryFiles.length} file(s)</span>
                </div>
              )}

              {user.deliveryMessage && (
                <div className="flex gap-1 items-center py-2">
                  <span className="font-medium">Delivery Message:</span>
                  <span>{user.deliveryMessage}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProjectManagementTableBody;
