import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Select } from "antd";
import { useState } from "react";
import UserManagementTable from "../../components/UserManagmentTable";
import { useGetUserManagementQuery } from "../../features/userManagement/userManagementApi";

const { Option } = Select;

function UserManagement() {
  // State for active tab (Institution or Department)
  const [activeTab, setActiveTab] = useState("freelancher");
  const [searchValue, setSearchValue] = useState("");
  const [category, setCategory] = useState("All category");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch users data from API
  const {
    data: usersData,
    isLoading,
    error,
  } = useGetUserManagementQuery({
    page: currentPage,
    searchValue: searchValue,
  });

  // Filter users based on role
  const filteredUsers =
    usersData?.data?.filter((user) => {
      if (activeTab === "freelancher") {
        return user.role === "freelancer";
      } else {
        return user.role === "client";
      }
    }) || [];

  const freelancherColumns = [
    "SL",
    "Name",
    "Email",
    "Designation",
    "Experience",
    "Daily Rate",
    "Location",
    "Status",
    "verified",
    "Action",
  ];

  const clientColumns = [
    "SL",
    "Name",
    "Email",
    "Designation",
    "Location",
    "Status",
    "verified",
    "Action",
  ];

  return (
    <div className="p-6 bg-gray-50">
      <div className="mb-6 flex justify-between">
        <div>
          <Button
            type={activeTab === "freelancher" ? "primary" : "default"}
            className={`mr-2 ${activeTab === "freelancher" ? "bg-[#002282]" : ""
              }`}
            onClick={() => setActiveTab("freelancher")}
          >
            Freelancer
          </Button>
          <Button
            type={activeTab === "client" ? "primary" : "default"}
            className={activeTab === "client" ? "bg-[#002282]" : ""}
            onClick={() => setActiveTab("client")}
          >
            client
          </Button>
        </div>

        <div className="flex justify-between items-center">
          <Input
            placeholder="Search here"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            suffix={<SearchOutlined />}
            className="w-full md:w-96 mr-4"
          />

          {/* <DatePicker className='w-full md:w-52 mr-4 h-11' picker="month" /> */}

          {/* <Select
            value={category}
            onChange={(value) => setCategory(value)}
            className="w-full md:w-64"
          >
            <Select.Option value="All category">
              <span className="flex gap-3 items-center">
                <FilterOutlined />
                All category
              </span>
            </Select.Option>
            <Select.Option value="Category 1">Category 1</Select.Option>
            <Select.Option value="Category 2">Category 2</Select.Option>
          </Select> */}
        </div>
      </div>

      <div className="rounded-md">
        {isLoading ? (
          <div className="text-center py-8">Loading users...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            Error loading users: {error.message || "Unknown error"}
          </div>
        ) : activeTab === "freelancher" ? (
          <UserManagementTable
            columns={freelancherColumns}
            data={filteredUsers}
          />
        ) : (
          <UserManagementTable columns={clientColumns} data={filteredUsers} />
        )}
      </div>
    </div>
  );
}

export default UserManagement;
