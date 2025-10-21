import { Button, Modal, Input, message, Upload } from "antd";
import { useEffect, useState } from "react";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";

import {
  useGetAllServicesQuery,
  useCreateServiceMutation,
} from "../../features/service/serviceApi";
import ServiceTable from "../../components/ServiceTable";

const Service = () => {
  const [category, setCategory] = useState("Invoice");
  const [apiResponse, setApiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal and form states
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newServiceName, setNewServiceName] = useState("");
  const [fileList, setFileList] = useState([]);

  // Mutation for creating service
  const [createService, { isLoading: isCreating }] = useCreateServiceMutation();

  // Filter state
  const [activeFilter, setActiveFilter] = useState(null);

  // Columns for the service table
  const columns = [
    "SL",
    "Service Name",
    "Service Image",
    "Created At",
    "Status",
    "Action",
  ];

  // Call the API when component mounts or category changes
  const {
    data,
    isLoading: queryLoading,
    error: queryError,
  } = useGetAllServicesQuery({
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    if (data) {
      // Filter data based on active status
      let filteredData = data.data;
      if (activeFilter !== null) {
        filteredData = filteredData.filter(
          (item) => item.isActive === activeFilter
        );
      }
      setApiResponse({ ...data, data: filteredData });
    }
    setIsLoading(queryLoading);
    setError(queryError);
  }, [data, queryLoading, queryError, activeFilter]);

  // Handle adding new service
  const handleAddService = async () => {
    // Validate service name
    if (!newServiceName.trim()) {
      message.error("Service name cannot be empty");
      return;
    }

    // Validate image
    if (fileList.length === 0) {
      message.error("Please upload a service image");
      return;
    }

    try {
      // Create FormData to send multipart/form-data
      const formData = new FormData();
      formData.append("name", newServiceName.trim());
      formData.append("image", fileList[0].originFileObj);
      formData.append("paymentType", category.toLowerCase());

      await createService(formData).unwrap();

      message.success("Service added successfully");
      setIsAddModalVisible(false);
      setNewServiceName("");
      setFileList([]);
    } catch (error) {
      message.error(error?.data?.message || "Failed to add service");
    }
  };

  // Handle file upload
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
  };

  // Custom upload method to prevent default upload behavior
  const handleUpload = (options) => {
    const { onSuccess, file } = options;
    onSuccess("ok");
  };

  return (
    <div className="p-6 bg-gray-50">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Services</h1>

        <div className="flex items-center space-x-4">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="bg-primary h-10"
            onClick={() => setIsAddModalVisible(true)}
          >
            Add New Service
          </Button>
        </div>
      </div>

      <div className="rounded-md">
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            Error loading data: {error?.message || "Unknown error"}
          </div>
        ) : (
          <ServiceTable columns={columns} data={apiResponse?.data || []} />
        )}
      </div>

      {/* Add Service Modal */}
      <Modal
        title="Add New Service"
        open={isAddModalVisible}
        onCancel={() => {
          setIsAddModalVisible(false);
          setNewServiceName("");
          setFileList([]);
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setIsAddModalVisible(false);
              setNewServiceName("");
              setFileList([]);
            }}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={isCreating}
            onClick={handleAddService}
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
              value={newServiceName}
              onChange={(e) => setNewServiceName(e.target.value)}
              className="w-full"
              rules={[{ required: true, message: "Please enter service name" }]}
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
              rules={[
                { required: true, message: "Please upload service image" },
              ]}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Service;
