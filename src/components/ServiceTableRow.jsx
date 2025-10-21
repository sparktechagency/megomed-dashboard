import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Button, Modal, Switch, message, Input, Upload } from "antd";
import { useState } from "react";
import {
  useUpdateServiceStatusMutation,
  useDeleteServiceMutation,
  useUpdateServiceMutation,
} from "../features/service/serviceApi";
import { baseURLImage } from "../utils/BaseURL";

const ServiceTableRow = ({ item, list }) => {
  const [switchModalVisible, setSwitchModalVisible] = useState(false);
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [userDetailsModalVisible, setUserDetailsModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const [currentStatus, setCurrentStatus] = useState(item.isActive);
  const [editedName, setEditedName] = useState(item.name);
  const [editedImage, setEditedImage] = useState(null);
  const [fileList, setFileList] = useState(
    item.image
      ? [
          {
            uid: "-1",
            name: "existing-image",
            status: "done",
            url: `${baseURLImage}${item.image}`,
          },
        ]
      : []
  );

  const [updateServiceStatus, { isLoading: isStatusUpdating }] =
    useUpdateServiceStatusMutation();
  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();

  const handleEdit = () => {
    // Reset edit states
    setEditedName(item.name);
    setEditedImage(null);
    setFileList(
      item.image
        ? [
            {
              uid: "-1",
              name: "existing-image",
              status: "done",
              url: `${baseURLImage}${item.image}`,
            },
          ]
        : []
    );
    setEditModalVisible(true);
  };

  const handleViewDetails = () => {
    setUserDetailsModalVisible(true);
  };

  const handleSwitchChange = () => {
    setSwitchModalVisible(true);
  };

  const handleDelete = () => {
    setRemoveModalVisible(true);
  };

  const handleConfirmSwitch = async () => {
    try {
      const newStatus = !currentStatus;
      console.log("Attempting to update service status:", {
        id: item._id,
        currentStatus,
        newStatus,
      });

      const updateResponse = await updateServiceStatus({
        id: item._id,
        isActive: newStatus,
      }).unwrap();

      console.log("Service status update response:", updateResponse);

      setCurrentStatus(newStatus);
      message.success(
        `Service status updated to ${newStatus ? "active" : "inactive"}`
      );
      setSwitchModalVisible(false);
    } catch (err) {
      console.error("Status update error details:", {
        errorObject: err,
        itemId: item._id,
        errorMessage: err?.message,
        errorData: err?.data,
      });

      const errorMessage =
        err?.data?.message || err?.message || "Failed to update service status";

      message.error(errorMessage);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      // Log the ID being used for deletion
      console.log("Attempting to delete service with ID:", item._id);

      // Use the correct mutation with the service ID
      const deleteResponse = await deleteService(item._id).unwrap();

      // Log the response from the delete operation
      console.log("Delete service response:", deleteResponse);

      message.success("Service deleted successfully");
      setRemoveModalVisible(false);
    } catch (error) {
      // More detailed error handling
      console.error("Delete error details:", {
        errorObject: error,
        itemId: item._id,
        errorMessage: error?.message,
        errorData: error?.data,
      });

      // Specific error messages based on different error types
      const errorMessage =
        error?.data?.message || error?.message || "Failed to delete service";

      message.error(errorMessage);
    }
  };

  // Handle file upload for edit
  const handleFileChange = (info) => {
    let newFileList = [...info.fileList];

    // Limit to one file
    newFileList = newFileList.slice(-1);

    // Validate file type and size
    newFileList = newFileList
      .map((file) => {
        if (file.type && !file.type.startsWith("image/")) {
          message.error("You can only upload image files!");
          return null;
        }

        if (file.size && file.size / 1024 / 1024 > 2) {
          message.error("Image must be smaller than 2MB!");
          return null;
        }

        return file;
      })
      .filter((file) => file !== null);

    setFileList(newFileList);

    // Set the file for upload if it's a new file
    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      setEditedImage(newFileList[0].originFileObj);
    }
  };

  // Custom upload method to prevent default upload behavior
  const handleUpload = (options) => {
    const { onSuccess } = options;
    onSuccess("ok");
  };

  const handleConfirmEdit = async () => {
    // Validate service name
    if (!editedName.trim()) {
      message.error("Service name cannot be empty");
      return;
    }

    try {
      // Create FormData to send multipart/form-data
      const formData = new FormData();
      formData.append("name", editedName.trim());

      // Only append image if a new image is selected
      if (editedImage) {
        formData.append("image", editedImage);
      }

      await updateService({
        id: item._id,
        data: formData,
      }).unwrap();

      message.success("Service updated successfully");
      setEditModalVisible(false);
    } catch (error) {
      message.error(error?.data?.message || "Failed to update service");
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

  return (
    <>
      <div className="grid grid-cols-6 my-3 text-sm bg-gray-100 rounded-lg whitespace-nowrap">
        <div className="py-3 text-center">{list}</div>
        <div className="px-3 py-3 text-center">{item.name}</div>
        <div className=" p-0.5 mx-auto border-2 border-primary rounded-md">
          <img
            src={`${baseURLImage}${item.image}`}
            alt={item.name}
            className="w-20 h-10 rounded-md object-cover "
          />
        </div>
        <div className="px-4 py-3 text-center">
          {formatDate(item.createdAt)}
        </div>
        <div
          className={`flex items-center justify-center py-3 ${
            currentStatus === true ? "text-green-500" : "text-red-500"
          }`}
        >
          {currentStatus === true ? "Active" : "Inactive"}
        </div>
        <div className="mx-auto  flex items-center justify-end gap-2 border rounded border-primary px-1 ">
          <Button
            type="text"
            icon={<EyeOutlined style={{ fontSize: "18px" }} />}
            className="text-primary hover:text-primary w-32"
            onClick={handleViewDetails}
          />
          <Button
            type="text"
            icon={<EditOutlined style={{ fontSize: "18px" }} />}
            className="text-primary hover:text-primary w-32"
            onClick={handleEdit}
          />
          <Switch
            checked={currentStatus === true}
            size="small"
            className="ml-2"
            onChange={handleSwitchChange}
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            className="text-red-500 hover:text-red-600"
            onClick={handleDelete}
          />
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
            {currentStatus === true
              ? "Are you sure Turn off this Service?"
              : "Are you sure Turn on this Service?"}
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
              loading={isStatusUpdating}
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
            Are you sure you want to remove this Service?
          </p>
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => setRemoveModalVisible(false)}
              className="px-8 border-primary text-primary"
            >
              No
            </Button>
            <Button
              type="primary"
              onClick={handleConfirmDelete}
              loading={isDeleting}
              className="px-8 bg-primary"
            >
              Yes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Service Details Modal */}
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
            <h2 className="text-xl font-semibold mb-4">Service Information</h2>
          </div>

          {/* Service Details */}
          <div className="border border-primary p-6 rounded-lg">
            <div className="space-y-4">
              {/* Service Image */}
              <div className="flex justify-center mb-4">
                <div className="w-48 h-32 border-2 border-primary rounded-md overflow-hidden">
                  <img
                    src={`${baseURLImage}${item.image}`}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex gap-1 items-center py-2">
                <span className="font-medium">Service Name:</span>
                <span>{item.name}</span>
              </div>

              <div className="flex gap-1 items-center py-2">
                <span className="font-medium">Status:</span>
                <span
                  className={`capitalize ${
                    currentStatus === true ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {currentStatus === true ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="flex gap-1 items-center py-2">
                <span className="font-medium">Created At:</span>
                <span>{formatDate(item.createdAt)}</span>
              </div>

              <div className="flex gap-1 items-center py-2">
                <span className="font-medium">Last Updated:</span>
                <span>{formatDate(item.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Edit Service Modal */}
      <Modal
        title="Edit Service"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setEditModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={isUpdating}
            onClick={handleConfirmEdit}
          >
            Save
          </Button>,
        ]}
      >
        <div className="py-4 space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Service Name
            </label>
            <Input
              placeholder="Enter service name"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Service Image
            </label>
            <Upload
              listType="picture"
              fileList={fileList}
              onChange={handleFileChange}
              customRequest={handleUpload}
              accept="image/*"
              maxCount={1}
              beforeUpload={() => false} // Prevent auto upload
            >
              <Button>Click to Upload</Button>
            </Upload>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ServiceTableRow;
