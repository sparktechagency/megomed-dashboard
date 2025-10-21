import { UploadOutlined } from '@ant-design/icons';
import { Button, Form, Image, Input, message, Modal, Upload } from 'antd';
import { useEffect, useState } from 'react';

import { useCreateCategoryMutation, useEditCategoryMutation } from '../../features/category/categoryApi';
import { baseURL } from '../../utils/BaseURL';

const ServicesManagementModal = ({
  mode = 'create', // edit
  visible,
  onCancel,
  onSubmit,
  initialValues = {},
  loading
}) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);
  const [fileList, setFileList] = useState([]);

  const [createCategory, { isLoading: createCategoryLoading }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: updateCategoryLoading }] = useEditCategoryMutation();

  useEffect(() => {
    if (initialValues.image) {
      setImageUrl(initialValues.image);
      // setFileList([{
      //   uid: '-1',
      //   name: 'current-image',
      //   status: 'done',
      //   url: initialValues.image,
      // }]);
    }
  }, [initialValues.image]);

  const handleSubmit = async () => {
    try {
      const value = await form.validateFields();
      const formdata = new FormData();
      const data = {
        categoryName: value.categoryName,
        basePrice: parseFloat(value.basePrice),
        ratePerKm: parseFloat(value.ratePerKm),
        ratePerHour: parseFloat(value.ratePerHour),
      }
      formdata.append("data", JSON.stringify(data));

      if (mode === 'create' && (!value.image || !value.image.file)) {
        message.error('Please upload an image!');
        return;
      }

      if (value.image && value.image.file) {
        formdata.append("image", value.image.file);
      }

      if (mode === 'create') {
        const response = await createCategory(formdata).unwrap();
        console.log(response)
        message.success('Service created successfully');
      } else {
        await updateCategory({ id: initialValues.id, data: formdata }).unwrap();
        message.success('Service updated successfully');
      }

      form.resetFields();
      setImageUrl(null);
      setFileList([]);
      onCancel();
    } catch (err) {
      message.error(err?.data?.errorMessages[0].message || "something wrong")
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setImageUrl(null);
    setFileList([]);
    onCancel();
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  const handleChange = (info) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-1);

    setFileList(newFileList);

    if (newFileList.length === 0) {
      setImageUrl(null);
    } else if (info.file && info.file.originFileObj) {
      getBase64(info.file.originFileObj, url => {
        setImageUrl(url);
      });
    }
  };

  const getBase64 = (file, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(file);
  };

  const uploadButton = (
    <div>
      <UploadOutlined />
      <div style={{ marginTop: 8 }}>Upload Image</div>
    </div>
  );

  const modalFooter = (
    <div>
      <Button
        style={{ paddingLeft: "30px", paddingRight: "30px", fontSize: "16px", marginRight: 8 }}
        onClick={handleCancel}
      >
        Cancel
      </Button>
      <Button
        loading={mode === 'create' ? createCategoryLoading : updateCategoryLoading}
        type="primary"
        style={{ paddingLeft: "40px", paddingRight: "40px", fontSize: "16px" }}
        onClick={handleSubmit}
      >
        {mode === 'create' ? 'Create' : 'Update'}
      </Button>
    </div>
  );

  const modalTitle = mode === 'create'
    ? 'Create New Service'
    : 'Edit Service';

  return (
    <Modal
      title={<span style={{ fontWeight: "bold", color: "#041B44", paddingTop: "20px", paddingBottom: "20px" }}>{modalTitle}</span>}
      open={visible}
      onCancel={handleCancel}
      footer={modalFooter}
      closable={false}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
      >
        <Form.Item
          name="categoryName"
          label={<span style={{ fontWeight: "bold" }}>Service Name</span>}
          rules={[{ required: true, message: 'Please input service name!' }]}
        >
          <Input type='text' placeholder="Enter service name" />
        </Form.Item>

        <Form.Item
          name="basePrice"
          label={<span style={{ fontWeight: "bold" }}>Base Fare ($)</span>}
          rules={[{ required: true, message: 'Please input base fare!' }]}
        >
          <Input type="number" placeholder="Enter base fare" />
        </Form.Item>

        <Form.Item
          name="ratePerKm"
          label={<span style={{ fontWeight: "bold" }}>rate Per Km</span>}
          rules={[{ required: true, message: 'Please input rate Per Km!' }]}
        >
          <Input type="number" placeholder="Enter rate Per Km" />
        </Form.Item>


        <Form.Item
          name="ratePerHour"
          label={<span style={{ fontWeight: "bold" }}>rate Per Hour</span>}
          rules={[{ required: true, message: 'Please input rate Per Hour!' }]}
        >
          <Input type="number" placeholder="Enter rate Per Hour" />
        </Form.Item>


        <Form.Item
          name="image"
          label={<span style={{ fontWeight: "bold" }}>Service Image</span>}
          rules={[{ required: mode === 'create', message: 'Please upload an image!' }]}
        >
          <Upload
            name="image"
            listType="picture-card"
            fileList={fileList}
            beforeUpload={beforeUpload}
            onChange={handleChange}
            accept="image/*"
            maxCount={1}
          >
            {imageUrl ? (
              <Image
                src={`${baseURL}${imageUrl}`}
                alt="service"
                style={{ width: '100%' }}
                preview={false}
              />
            ) : uploadButton}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ServicesManagementModal;