import { CloseOutlined, EyeOutlined } from "@ant-design/icons";
import { Avatar, Button, Modal, Switch, Tooltip, message } from "antd";
import { useState } from "react";
import { MdOutlineVerified } from 'react-icons/md';
import { useUpdateUserStatusMutation } from "../features/userManagement/userManagementApi";

const UserManagementTableRow = ({ user, list, columns }) => {

  const [editModalVisible, setEditModalVisible] = useState(false);

  const [switchModalVisible, setSwitchModalVisible] = useState(false);
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [userDetailsModalVisible, setUserDetailsModalVisible] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(
    user.isActive ? "active" : "blocked"
  ); // Add local state
  const [updateUserStatus, { isLoading }] = useUpdateUserStatusMutation();

  const handleViewDetails = () => {
    setUserDetailsModalVisible(true);
  };

  const handleSwitchChange = (checked) => {
    setSwitchModalVisible(true);
  };

  const handleDelete = () => {
    setRemoveModalVisible(true);
  };

  const handleConfirmDelete = async (id) => {
    // Implement delete logic here
    try {
      const response = await deleteEmployee(id);
      if (response.success) {
        message.success(response.message || "Employee deleted successfully");
      }
    } catch (error) {
      message.error(error?.data?.message || "Failed to delete employee");
      console.log("Delete error:", error);
    }
    setRemoveModalVisible(false);
  };

  const handleConfirmSwitch = async () => {
    try {
      const newStatus = currentStatus === "active" ? "blocked" : "active";
      const response = await updateUserStatus({
        id: user._id,
        status: newStatus,
      }).unwrap();

      console.log(response);

      // Update local state immediately
      setCurrentStatus(newStatus);

      message.success(`User status updated to ${newStatus}`);
      setSwitchModalVisible(false);
    } catch (err) {
      message.error("Failed to update user status");
    }
  };

  // Format date to DD-MM-YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const gridCols = columns.length;

  // Define grid classes based on column count
  const getGridClass = (colCount) => {
    switch (colCount) {
      case 7:
        return "grid-cols-8";
      case 9:
        return "grid-cols-10";
      case 10:
        return "grid-cols-10";
      default:
        return `grid-cols-${colCount}`;
    }
  };

  return (
    <>
      <div
        className={`grid ${getGridClass(
          gridCols
        )} my-3 text-sm bg-gray-100 rounded-lg whitespace-nowrap`}
      >
        <div className="py-3 text-center">{list}</div>
        <div className="px-3 py-3 text-center">
          <Tooltip title={user?.fullName}>
            <span className="inline-block max-w-[100px] truncate cursor-pointer">
              {user?.fullName || "N/A"}
            </span>
          </Tooltip>
        </div>

        <div className="px-3 py-3 text-center">
          <Tooltip title={user.email}>
            <span className="inline-block max-w-[100px] truncate cursor-pointer">
              {user.email || "N/A"}
            </span>
          </Tooltip>
        </div>

        <div className="px-3 py-3 text-center">
          <Tooltip title={user.designation}>
            <span className="inline-block max-w-[100px] truncate cursor-pointer">
              {user.designation || "N/A"}
            </span>
          </Tooltip>
        </div>


        {columns.includes("Experience") && (
          <div className="px-4 py-3 text-center">
            {user.yearsOfExperience || "N/A"}
          </div>
        )}
        {columns.includes("Daily Rate") && (
          <div className="px-4 py-3 text-center">
            {user.dailyRate ? `$${user.dailyRate}` : "N/A"}
          </div>
        )}
        <div className="px-4 py-3 text-center">{user.location || "N/A"}</div>

        <div
          className={`flex items-center justify-center py-3 ${currentStatus === "active" ? "text-green-500" : "text-red-500"
            }`}
        >
          {currentStatus}
        </div>
        <div className="px-4 py-3 text-center flex justify-center">{user.isVarified ? <MdOutlineVerified className="text-green-500 text-2xl" /> : "Pending"}</div>
        <div className="flex items-center justify-evenly gap-2 border rounded border-primary px-1 mx-2">
          <Button
            type="text"
            icon={<EyeOutlined style={{ fontSize: "18px" }} />}
            className="text-primary hover:text-primary w-32"
            onClick={handleViewDetails}
          />
          <Switch
            checked={currentStatus === "active"}
            size="small"
            className="ml-2"
            onChange={handleSwitchChange}
          />
          {/* <Button
            type="text"
            icon={<DeleteOutlined />}
            className="text-red-500 hover:text-red-600"
            onClick={handleDelete}
          /> */}
        </div>
      </div>

      {/* Switch Confirmation Modal */}
      <Modal
        open={switchModalVisible}
        onCancel={() => setSwitchModalVisible(false)}
        footer={null}
        closable={false}
        width={350}
        centered
      >
        <div className="text-center py-4">
          <p className="text-lg font-medium mb-6">
            {currentStatus === "active"
              ? "Are you sure Turn off this Account?"
              : "Are you sure Turn on this Account?"}
          </p>
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => setSwitchModalVisible(false)}
              className="px-8 border-primary text-primary"
            >
              No
            </Button>
            <Button
              type="primary"
              onClick={handleConfirmSwitch}
              loading={isLoading}
              className="px-8 bg-primary"
            >
              Yes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={removeModalVisible}
        onCancel={() => setRemoveModalVisible(false)}
        footer={null}
        closable={false}
        width={350}
        centered
      >
        <div className="text-center py-4">
          <p className="text-base font-medium text-black mb-6">
            Are you sure Remove this Account
          </p>
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => setRemoveModalVisible(false)}
              className="px-8 border-primary text-primary"
            >
              No
            </Button>
            <Button
              // loading={deleteLoading}
              type="primary"
              onClick={() => handleConfirmDelete(item._id)}
              className="px-8 bg-primary"
            >
              Yes
            </Button>
          </div>
        </div>
      </Modal>

      {/* User Details Modal */}
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
            <h2 className="text-xl font-semibold mb-4">User Information</h2>
          </div>

          {/* User Details */}
          <div className="border border-primary p-6 rounded-lg">
            <div className="flex justify-center mb-6">
              <Avatar
                size={180}
                src={user.image || "https://i.ibb.co/z5YHLV9/profile.png"}
                className="border-4 border-gray-200"
              />
            </div>

            <div className="space-y-4">
              <div className="flex gap-1 items-center py-2">
                <span className="font-medium">Name:</span>
                <span className="">{user?.fullName}</span>
              </div>

              <div className="flex gap-1 items-center py-2">
                <span className="font-medium">Role:</span>
                <span className="capitalize">{user?.role}</span>
              </div>

              <div className="flex gap-1 items-center py-2">
                <span className="font-medium">Status:</span>
                <span className="capitalize">{currentStatus}</span>
              </div>

              <div className="flex items-center py-2 gap-1">
                <span className="font-medium ">Email: </span>
                <span className="">{user?.email}</span>
              </div>

              <div className="flex gap-1 items-center py-2">
                <span className="font-medium">Designation:</span>
                <span className="">{user?.designation || "N/A"}</span>
              </div>

              <div className="flex gap-1 items-center py-2">
                <span className="font-medium">Experience:</span>
                <span className="">{user?.yearsOfExperience || "N/A"}</span>
              </div>

              <div className="flex gap-1 items-center py-2">
                <span className="font-medium">Daily Rate:</span>
                <span className="">
                  {user?.dailyRate ? `$${user.dailyRate}` : "N/A"}
                </span>
              </div>

              <div className="flex gap-1 items-center py-2">
                <span className="font-medium">Location:</span>
                <span className="">{user?.location || "N/A"}</span>
              </div>

              <div className="flex gap-1 items-center py-2">
                <span className="font-medium ">Joined:</span>
                <span className="">{formatDate(user.createdAt)}</span>
              </div>

              <div className="flex gap-1 items-center py-2">
                <span className="font-medium">Verified:</span>
                <span className="">{user.isVarified ? "Yes" : "No"}</span>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default UserManagementTableRow;
