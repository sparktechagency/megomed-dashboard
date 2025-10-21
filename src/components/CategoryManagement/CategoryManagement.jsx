import { Button, Select } from 'antd';
import { useState } from 'react';

import { useGetCategoryQuery } from '../../features/category/categoryApi';
import CategoryManagementFormModal from './CategoryManagementFormModal';
import CategoryManagementTableHead from './CategoryManagementTableHead';



const { Option } = Select;

function CategoryManagement() {

  const [isNewCategoryModalVisible, setIsNewCategoryModalVisible] = useState(false);
  const { data: category = [], isLoading, isError, refetch } = useGetCategoryQuery();

  const handleCreateService = async (values) => {
    setIsNewServiceModalVisible(false);
  };

  const categoryColumns = [
    "SL",
    "Service Image",
    "Category Name",
    "Base Fare ($)",
    "ratePerKm",
    "ratePerHour",
    "Status",
    "Action"
  ];


  return (
    <div className="p-6 bg-gray-50">
      <div className="mb-6 flex justify-end">
        <Button
          type="primary"
          onClick={() => setIsNewCategoryModalVisible(true)}
        >
          Add New Category
        </Button>
      </div>


      <CategoryManagementTableHead data={category.data} columns={categoryColumns} loading={isLoading} refetch={refetch} />

      <CategoryManagementFormModal
        mode="create"
        visible={isNewCategoryModalVisible}
        onCancel={() => setIsNewCategoryModalVisible(false)}
        onCreate={handleCreateService}
        loading={isLoading}
      />
    </div>
  );
}

export default CategoryManagement;