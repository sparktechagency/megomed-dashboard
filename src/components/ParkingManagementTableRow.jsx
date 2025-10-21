import { Button, Card, Dropdown, Input, message, Radio, Spin } from "antd";
import { useEffect, useState } from "react";
import {
  useUpdateRevenueMutation,
  useUpdateStatusMutation,
} from "../features/bussinessManagement/bussinessApi";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";

const inputStyle = {
  width: "100%",
  height: "44px",
  background: "transparent",
  border: "1px solid #E8505B",
  fontSize: "14px",
  borderRadius: "12px",
};

const ParkingManagementTableRow = ({ item, list }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [revenueDropdown, setRevenueDropdown] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [statusName, setStatusName] = useState(item.status);
  const [updateRevenue, { isLoading: revenueLoading }] =
    useUpdateRevenueMutation();
  const [updateStatus, { isLoading: statusLoading }] =
    useUpdateStatusMutation();

  useEffect(() => {
    setStatusName(item.status);
  }, [item.status]);

  const handleRadioChange = async (e) => {
    setStatusName(e?.target?.value);
    setDropdownOpen(false);
    // try {
    //   const response = await updateStatus({
    //     id: item._id,
    //     status: e.target.value,
    //   });
    //   setStatusName(response?.data?.data?.status);

    //   if (response?.error) {
    //     message.error(
    //       response.error?.data?.message || "Failed to update status."
    //     );
    //   }
    // } catch (error) {
    //   message.error(error?.data?.message || "An error occurred!");
    // }
    // setDropdownOpen(false);
  };

  const handleInputValue = (value) => {
    setInputValue(value);
  };

  const handleRevenue = async (id) => {
    // const numericValue = parseFloat(inputValue);
    // if (isNaN(numericValue)) {
    //   message.error("Please enter a valid number for revenue.");
    //   return;
    // }

    // try {
    //   const response = await updateRevenue({
    //     id: id,
    //     revenue: numericValue,
    //   });

    //   if (response.data) {
    //     message.success("Revenue updated successfully.");
    //     setInputValue("");
    //     setRevenueDropdown(false);
    //   } else {
    //     message.error(
    //       response.error?.data?.message || "Failed to update revenue."
    //     );
    //   }
    // } catch (error) {
    //   message.error(error?.message || "An unexpected error occurred.");
    // }
  };

  return (
    <div className="grid items-center grid-cols-9 pr-3 mx-2 my-3 text-sm bg-gray-100 rounded-lg whitespace-nowrap">
      <div className="py-3 text-center">{list}</div>
      <div className="px-3 py-3 text-center">{item?.shopName || item.SpotName}</div>
      <div className="px-3 py-3 text-start">{item?.userId?.email || item.email}</div>
      <div className="px-4 py-3 text-center">{item?.location || "Dhaka"}</div>
      <div className="px-4 py-3 text-center">{item?.userId?.phone || item.phone}</div>
      <div className="px-4 py-3 text-center">{item?.totalOrders || item.Total_Parking}</div>
      <div className="py-3 text-center">{item.revenue || item.Revenue}%</div>
      <div className="col-span-2 py-1 border rounded border-SurfacePrimary">
        <div className="flex items-center justify-between gap-2 rounded">
          <div className="w-1/2 px-1">
            <Dropdown
              open={revenueDropdown}
              onOpenChange={setRevenueDropdown}
              trigger={["click"]}
              dropdownRender={() => (
                <Card className="flex flex-col gap-3 shadow-lg w-[300px]">
                  <h2 className="text-[#464749] font-bold text-[20px]">
                    Update Revenue
                  </h2>
                  <div className="bg-primary w-full h-[1px] mt-3"></div>

                  <Input
                    type="number"
                    onChange={(e) => handleInputValue(e.target.value)}
                    className="mt-3"
                    style={inputStyle}
                    value={inputValue}
                  />

                  <Button
                    onClick={() => handleRevenue(item._id)}
                    type="text"
                    htmlType="submit"
                    className="w-full mt-3"
                    style={{
                      height: "40px",
                      background: "#E8505B",
                      color: "white",
                    }}
                    disabled={revenueLoading}
                  >
                    {revenueLoading ? "Saving..." : "Save"}
                  </Button>
                </Card>
              )}
              placement="bottomRight"
            >
              <div className="w-full">
                <button className="w-full p-2.5 text-white rounded bg-primary hover:bg-opacity-90 transition-colors">
                  Update Revenue
                </button>
              </div>
            </Dropdown>
          </div>

           <div className="text-center">
            <Dropdown
              open={dropdownOpen}
              onOpenChange={setDropdownOpen}
              trigger={["click"]}
              disabled={item.userStatus === "blocked"}
              dropdownRender={() => (
                <Card className="shadow-lg w-38">
                  <Radio.Group
                    onChange={handleRadioChange}
                    value={statusName || "Active"}
                    disabled={statusLoading}
                    className="flex flex-col space-y-2"
                  >
                    <Radio value="Active" className="font-semibold text-primary">
                      Active
                    </Radio>
                    <Radio value="Blocked" className="text-black">
                      Blocked
                    </Radio>
                  </Radio.Group>
                </Card>
              )}
              placement="bottomRight"
            >
              <div className="flex justify-center py-1 text-center transition duration-200 hover:bg-gray-100">
                <button
                  className={`w-[150px] mx-1 p-2.5 text-white rounded flex items-center justify-center ${
                    statusName === "Blocked" ? "bg-red-600" : "bg-primary"
                  }`}
                >
                  <span>{statusLoading ? <Spin size='small' /> : statusName||"Active"}</span>
                  {dropdownOpen ? (
                    <BiChevronUp size={20} className="ml-2" />
                  ) : (
                    <BiChevronDown size={20} className="ml-2" />
                  )}
                </button>
              </div>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkingManagementTableRow;