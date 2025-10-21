import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { DatePicker, Input, Select } from "antd";
import { useState } from "react";
import ProjectManagementTableHead from "./ProjectManagementTableHead";
import { useGetAllProjectsQuery } from "../../features/project/projectApi";

function ProjectManagement() {
  // State for active tab (Institution or Department)
  const [searchValue, setSearchValue] = useState("");
  const [dateRange, setDateRange] = useState("February 2025");
  const [category, setCategory] = useState("All category");

  // Fetch projects data from API
  const { data: projectsData, isLoading, error } = useGetAllProjectsQuery();

  console.log("projectsData", projectsData);

  const ProjectColumns = [
    "SL",
    "Client Name",
    "Freelancer Name",
    "Project Name",
    "Invoice Type",
    "Service Type",
    "Amount",
    "Date",
    "Status",
    "Payment Status",
    "Action",
  ];

  return (
    <div className="p-6 bg-gray-50">
      {/* <div className="mb-6 flex justify-end">
        <div className="flex justify-between items-center">
          <Input
            placeholder="Search here"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            suffix={<SearchOutlined />}
            className="w-full md:w-96 mr-4"
          />

          <DatePicker className="w-full md:w-52 mr-4 h-11" picker="month" />

          <Select
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
          </Select>
        </div>
      </div> */}

      <div className="rounded-md">
        {isLoading ? (
          <div className="text-center py-8">Loading projects...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            Error loading projects: {error.message || "Unknown error"}
          </div>
        ) : (
          <ProjectManagementTableHead
            columns={ProjectColumns}
            data={projectsData?.data || []}
          />
        )}
      </div>
    </div>
  );
}

export default ProjectManagement;
