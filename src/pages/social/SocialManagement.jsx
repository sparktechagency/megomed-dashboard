"use client";

import { DeleteOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Form, Image, Input, message, Modal, Popconfirm, Table, Upload } from "antd";
import { useState } from "react";
import { useCreateLinkMutation, useDeleteSocialLinkMutation, useGetSocialLinkQuery } from '../../features/social/socialApi';
import { baseURLImage } from '../../utils/BaseURL';

const SocialManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const [deleteLink, { isLoading: deleteLoading }] = useDeleteSocialLinkMutation();
  const [createLink, { isLoading: createLoading }] = useCreateLinkMutation();
  const { data, isLoading } = useGetSocialLinkQuery();

  const socialData = data?.data || [];

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setFileList([]);
  };

  const handleDelete = async (id) => {
    try {
      await deleteLink(id).unwrap();
      message.success("Social link deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      message.error("Failed to delete social link");
    }
  };

  const handleSubmit = async (values) => {
    try {
      // Check if image is uploaded
      if (fileList.length === 0) {
        message.error("Please upload an image");
        return;
      }

      const formData = new FormData();
      formData.append("name", values.name);

      // Get the actual file object
      const imageFile = fileList[0];
      if (imageFile && imageFile.originFileObj) {
        formData.append("image", imageFile.originFileObj);
        console.log("Image file:", imageFile.originFileObj);
        console.log("Image name:", imageFile.name);
        console.log("Image type:", imageFile.type);
      } else {
        message.error("No valid image file found");
        return;
      }

      // Log FormData contents for debugging
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      await createLink(formData).unwrap();
      message.success("Social link created successfully!");
      handleCancel();
    } catch (error) {
      console.error("Create error:", error);
      message.error("Failed to create social link");
    }
  };

  // Fixed upload properties
  const uploadProps = {
    // Handle file removal
    onRemove: (file) => {
      const newFileList = fileList.filter(f => f.uid !== file.uid);
      setFileList(newFileList);
    },

    // Handle before upload - prevent automatic upload
    beforeUpload: (file) => {
      // File validation
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return false;
      }

      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must be smaller than 2MB!');
        return false;
      }

      // Add file to fileList with proper structure
      const newFile = {
        uid: file.uid,
        name: file.name,
        status: 'done',
        originFileObj: file,
      };

      setFileList([newFile]);
      return false; // Prevent automatic upload
    },

    // Handle file change
    onChange: (info) => {
      console.log("Upload onChange:", info);

      if (info.file.status === 'removed') {
        setFileList([]);
      }
    },

    fileList,
    maxCount: 1,
    accept: "image/*",
    listType: "picture-card",
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: 100,
      render: (image) => (
        <Image
          src={`${baseURLImage}/${image}`}
          alt="Social Icon"
          width={50}
          height={50}
          className="rounded-lg object-cover"
          fallback="/placeholder-image.png"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => date ? new Date(date).toLocaleDateString() : "-",
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Popconfirm
          title="Delete social link"
          description="Are you sure you want to delete this social link?"
          onConfirm={() => handleDelete(record._id)}
          okText="Yes"
          cancelText="No"
          disabled={deleteLoading}
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            loading={deleteLoading}
          />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Social Management</h1>
          <p className="text-gray-600 mt-1">Manage your social media links and icons</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showModal}
          size="large"
          className="bg-blue-600 hover:bg-blue-700"
        >
          Add Social Link
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={socialData}
        rowKey="_id"
        loading={isLoading}
        className="mt-4"
      />

      <Modal
        title={<span className="text-xl font-semibold">Add New Social Link</span>}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please enter social link name" },
              { min: 2, message: "Name must be at least 2 characters" },
            ]}
          >
            <Input
              placeholder="e.g., Facebook, Twitter, Instagram"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Image"
            name="image"
            rules={[
              {
                validator: () => {
                  if (fileList.length === 0) {
                    return Promise.reject("Please upload an image");
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Upload {...uploadProps}>
              {fileList.length === 0 && (
                <div>
                  <UploadOutlined />
                  <div className="mt-2">Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item className="mb-0 mt-6">
            <div className="flex justify-end gap-3">
              <Button onClick={handleCancel} size="large" disabled={createLoading}>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={createLoading}
                size="large"
                className="bg-blue-600 hover:bg-blue-700"
              >
                Create Social Link
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SocialManagement;