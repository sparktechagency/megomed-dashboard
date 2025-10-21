import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, message, Modal, Switch } from "antd";
import { useState } from "react";
import { useGetParticularCategoryQuery, useUpdateCategoryStatusMutation } from '../../features/category/categoryApi';

import { baseURL } from '../../utils/BaseURL';
import CategoryManagementFormModal from './CategoryManagementFormModal';
import ViewDetailsModal from "./ViewDetailsModal";

const CategoryManagementTableBody = ({ item, list, refetch }) => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewdetailsModalVisible, setViewdetailsModalVisible] = useState(false);
  const [switchModalVisible, setSwitchModalVisible] = useState(false);
  const [localStatus, setLocalStatus] = useState(item.status);

  const [updateStatus] = useUpdateCategoryStatusMutation();

  const { data: serviceResponse, isLoading } = useGetParticularCategoryQuery(item._id, {
    skip: !viewdetailsModalVisible,
  });


  const handleEdit = (value) => {
    setEditModalVisible(true);
  };

  const handleViewDetails = () => {
    setViewdetailsModalVisible(true);
  };

  const handleSwitchChange = (checked) => {
    setSwitchModalVisible(true);
  };

  const handleConfirmSwitch = async () => {
    try {
      const newStatus = localStatus === 'active' ? 'block' : 'active';

      // Optimistically update local state
      setLocalStatus(newStatus);

      const response = await updateStatus({
        id: item._id,
        status: newStatus
      }).unwrap();
      if (response.success) {
        message.success(`Category status updated to ${newStatus}`);
        setSwitchModalVisible(false);
        refetch();
      }
    } catch (error) {
      // Revert if API call fails
      setLocalStatus(item.status);
      message.error("Failed to update status");
      console.error("Failed to update status:", error);
    }
  };

  return (
    <>
      {/* Table Row */}
      <div className={`grid items-center grid-cols-8 gap-2 px-2 my-3 text-sm bg-gray-100 space-x-5 rounded-lg whitespace-nowrap`}>
        <div className="flex items-center justify-center py-3">{list}</div>
        <div className="flex items-center justify-center py-3">
          {item.image ? (
            <img
              src={`${baseURL}${item.image}`}
              alt={item.serviceName || item.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-xs text-gray-500">No Image</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-center py-3">{item.categoryName}</div>
        <div className="flex items-center justify-center py-3">{item.basePrice}</div>
        <div className="flex items-center justify-center py-3">{item.ratePerKm}</div>
        <div className="flex items-center justify-center py-3">{item.ratePerHour}</div>
        <div className="flex items-center justify-center py-3">{item.status}</div>

        {/* Fixed Actions Column */}
        <div className="flex items-center justify-center py-3 ">
          <div className="flex items-center border border-primary rounded max-w-fit px-2">
            <Button
              type="text"
              icon={<EyeOutlined style={{ fontSize: "16px" }} />}
              className="text-primary hover:text-primary"
              onClick={handleViewDetails}
            />
            <Button
              type="text"
              icon={<EditOutlined style={{ fontSize: "16px" }} />}
              className="text-orange-500 hover:text-orange-600"
              onClick={handleEdit}
            />
            <Switch
              checked={localStatus}
              size="small"
              className="ml-2"
              onChange={handleSwitchChange}
            />
          </div>
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
          <p className="text-lg font-medium mb-6">Do you want to Remove This Category</p>
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
              className="px-8 bg-primary"
            >
              Yes
            </Button>
          </div>
        </div>
      </Modal>


      <ViewDetailsModal isOpen={viewdetailsModalVisible} onClose={() => setViewdetailsModalVisible(false)} modalTitle="Category"
        imageAlt="Category"
        details={[
          { label: "Category Name", value: "Demo Category" },
          { label: "Base Price", value: "$548" },
          { label: "Rate Per Km ($)", value: "$45" },
        ]} />

      <CategoryManagementFormModal mode="edit"
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        initialValues={{
          id: item._id,
          categoryName: item.categoryName,
          basePrice: item.basePrice,
          ratePerKm: item.ratePerKm,
          ratePerHour: item.ratePerHour,
          image: item.image
        }} />
    </>
  );
};

export default CategoryManagementTableBody;