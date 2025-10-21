import { Button, Select, Modal, Input, message } from "antd";
import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";

import CategoryTable from "../../components/CategoryTable";
import {
  useGetCategoryQuery,
  useCreateCategoryMutation,
} from "../../features/category/categoryApi";

const Category = () => {
  const [category, setCategory] = useState("Invoice");
  const [apiResponse, setApiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal and form states
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Mutation for creating category
  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();

  // Filter state
  const [activeFilter, setActiveFilter] = useState(null);

  // Columns for the category table
  const columns = ["SL", "Category Name", "Created At", "Status", "Action"];

  // Call the API when component mounts or category changes
  const {
    data,
    isLoading: queryLoading,
    error: queryError,
  } = useGetCategoryQuery({
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

  // Handle adding new category
  const handleAddCategory = async () => {
    // Validate category name
    if (!newCategoryName.trim()) {
      message.error("Category name cannot be empty");
      return;
    }

    try {
      await createCategory({
        name: newCategoryName.trim(),
        paymentType: category.toLowerCase(),
      }).unwrap();

      message.success("Category added successfully");
      setIsAddModalVisible(false);
      setNewCategoryName("");
    } catch (error) {
      message.error(error?.data?.message || "Failed to add category");
    }
  };

  return (
    <div className="p-6 bg-gray-50">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>

        <div className="flex items-center space-x-4">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="bg-primary h-10"
            onClick={() => setIsAddModalVisible(true)}
          >
            Add New Category
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
          <CategoryTable columns={columns} data={apiResponse?.data || []} />
        )}
      </div>

      {/* Add Category Modal */}
      <Modal
        title="Add New Category"
        open={isAddModalVisible}
        onCancel={() => {
          setIsAddModalVisible(false);
          setNewCategoryName("");
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setIsAddModalVisible(false);
              setNewCategoryName("");
            }}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={isCreating}
            onClick={handleAddCategory}
          >
            Save
          </Button>,
        ]}
      >
        <div className="py-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Category Name
          </label>
          <Input
            placeholder="Enter category name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="w-full"
          />
        </div>
      </Modal>
    </div>
  );
};

export default Category;
