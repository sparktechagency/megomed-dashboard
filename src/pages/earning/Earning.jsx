import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, DatePicker, Input, Select } from "antd";
import { useEffect, useState } from "react";
import EarningTable from "../../components/EarningTable";
import { FiEye } from "react-icons/fi";
import { useTotalEarningMutation } from "../../features/totalEarning/totalEarningApi";
const columns = [
  "SL",
  "Client Name",
  "Freelancer Name",
  "Project Name",
  "Invoice Number",
  "Service Type",
  "Total Amount",
  "Revenue",
  "Status",
  "Action",
];

// Removed static data - using API data only

const Earning = () => {
  // const [searchValue, setSearchValue] = useState("");
  // const [dateRange, setDateRange] = useState("February 2025");
  const [category, setCategory] = useState("Invoice");

  const [getEarningData, { data: apiResponse, isLoading, error }] =
    useTotalEarningMutation();

  // Call the API when component mounts or category changes
  useEffect(() => {
    getEarningData({
      page: 1,
      limit: 10,
      paymentType: category.toLowerCase(),
    });
  }, [category]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debug: Log the API response (remove in production)
  useEffect(() => {
    if (apiResponse) {
      console.log("API Response:", apiResponse);
      console.log("Data array:", apiResponse?.result);
      console.log("Data length:", apiResponse?.result?.length);
    }
    if (error) {
      console.error("API Error:", error);
    }
  }, [apiResponse, error]);

  return (
    <div className="p-6 bg-gray-50">
      <div className="mb-6 flex justify-end">
        <div className="flex justify-between items-center">
          {/* Search Input */}
          {/* <Input
            placeholder="Search here"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            suffix={<SearchOutlined />}
            className="w-full md:w-96 mr-4"
          />
          <DatePicker className="w-full md:w-52 mr-4 h-11" picker="month" /> */}

          {/* Category Selector */}
          <Select
            value={category}
            onChange={(value) => setCategory(value)}
            className="w-full md:w-64"
            placeholder="Payment Type"
          >
            <Select.Option value="Invoice">Invoice</Select.Option>
            <Select.Option value="Subscription">Subscription</Select.Option>
          </Select>
        </div>
      </div>

      <div className=" rounded-md">
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            Error loading data: {error?.message || "Unknown error"}
          </div>
        ) : (
          <EarningTable
            columns={columns}
            data={apiResponse?.data?.result || []}
          />
        )}
      </div>
    </div>
  );
};

export default Earning;
