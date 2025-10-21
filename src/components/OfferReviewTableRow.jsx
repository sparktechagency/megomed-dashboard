import { Card, Dropdown, message, Radio, Spin } from "antd";
import { useEffect, useState } from "react";
import { useUpdateOfferStatusMutation } from "../features/bussinessManagement/bussinessApi";

const OfferReviewTableRow = ({ item, num }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [updateOfferStatus, { isLoading: isLoadingStatus }] =
    useUpdateOfferStatusMutation();

  const [statusName, setStatusName] = useState(item.status); // Initialize with item.status

  // Update statusName whenever item.status changes
  useEffect(() => {
    setStatusName(item.status);
  }, [item.status]);

  const handleRadioChange = async (e) => {
    try {
      const response = await updateOfferStatus({
        id: item._id,
        status: e.target.value,
      });
      setStatusName(response?.data?.data?.status);

      if (response?.error) {
        message.error(
          response.error?.data?.message || "Failed to update status."
        );
      }
    } catch (error) {
      message.error(error?.data?.message || "An error occurred!");
    }
    setDropdownOpen(false);
  };

  return (
    <div className="grid grid-cols-8 my-3 text-sm bg-gray-100 rounded-lg whitespace-nowrap">
      <div className="py-3 text-center">{num}</div>
      <div className="px-3 py-3 text-center">{item?.shopId?.shopName}</div>
      <div className="px-3 py-3 text-center">{item.itemName}</div>
      <div className="px-4 py-3 text-center">{item.shopCategory}</div>
      <div className="px-4 py-3 text-center">{item.stateDate}</div>
      <div className="px-4 py-3 text-center">{item.endDate}</div>
      <div className="py-3 text-center">{item?.itemId?.price}</div>

      <div className="text-center">
        <Dropdown
          open={dropdownOpen}
          onOpenChange={setDropdownOpen}
          trigger={["click"]}
          disabled={item.userStatus === "blocked"}
          dropdownRender={() => (
            <Card className="shadow-lg w-52">
              <Radio.Group
                onChange={handleRadioChange}
                value={statusName} // Use statusName instead of item.userStatus
                disabled={isLoadingStatus}
                className="flex flex-col space-y-2"
              >
                <Radio value="active" className="font-semibold text-amber-700">
                  Active
                </Radio>
                <Radio value="blocked" className="text-black">
                  Blocked
                </Radio>
              </Radio.Group>
            </Card>
          )}
          placement="bottomRight"
        >
          <div className="py-1 transition duration-200 border border-red-500 rounded hover:bg-gray-100">
            <button
              className={`w-[180px] p-2.5 text-white rounded ${statusName === "blocked" ? "bg-red-600" : "bg-primary"
                }`}
            >
              {isLoadingStatus ? <Spin size='small' /> : statusName}{" "}
              {/* Use statusName here */}
            </button>
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default OfferReviewTableRow;
