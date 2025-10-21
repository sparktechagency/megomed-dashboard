import { Avatar, Button } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetChatListQuery } from "../../features/supportChat/supportChatApi";
import { getImageUrl } from "../../utils/getImageUrl";

const MessageHeader = () => {
  const { id } = useParams();
  const { data: chatListResponse } = useGetChatListQuery();
  const [timer, setTimer] = useState({
    days: 0,
    hours: 1,
    mins: 15,
    secs: 30,
  });

  // Find the current chat data
  const currentChat = chatListResponse?.data?.find(
    (chatItem) => chatItem.chat._id === id
  );
  const participant = currentChat?.chat?.participants?.[0];

  // Countdown timer effect
  useEffect(() => {
    if (!id) return;

    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        let { days, hours, mins, secs } = prevTimer;

        if (secs > 0) {
          secs--;
        } else if (mins > 0) {
          mins--;
          secs = 59;
        } else if (hours > 0) {
          hours--;
          mins = 59;
          secs = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          mins = 59;
          secs = 59;
        }

        return { days, hours, mins, secs };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [id]);

  const formatTime = (time) => {
    return time.toString().padStart(2, "0");
  };

  if (!id) return null;

  return (
    <div className="w-full bg-white border-b border-gray-200">
      <div className="flex items-center justify-between p-4">
        {/* Left Section - Profile */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar
              src={
                getImageUrl(participant?.profile) ||
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face"
              }
              size={60}
              className="border-2 border-white shadow-sm"
            />
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {participant?.fullName || "Unknown User"}
              </h3>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <p className="text-sm text-gray-600">
              {participant?.role === "freelancer" ? "Freelancer" : "Client"}
            </p>
          </div>
        </div>

        {/* Center Section - Delivery Timer */}
        {/* <div className="flex flex-col items-center">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Delivery Date</h4>

          <div className="flex items-center gap-2">
       
            <div className="flex flex-col items-center">
              <div className="bg-gray-100 rounded-lg px-3 py-2 min-w-[50px] text-center">
                <span className="text-xl font-bold text-gray-900">
                  {formatTime(timer.days)}
                </span>
              </div>
              <span className="text-xs text-gray-500 mt-1">Days</span>
            </div>

            <span className="text-xl font-bold text-gray-400 pb-6">:</span>

    
            <div className="flex flex-col items-center">
              <div className="bg-gray-100 rounded-lg px-3 py-2 min-w-[50px] text-center">
                <span className="text-xl font-bold text-gray-900">
                  {formatTime(timer.hours)}
                </span>
              </div>
              <span className="text-xs text-gray-500 mt-1">Hours</span>
            </div>

            <span className="text-xl font-bold text-gray-400 pb-6">:</span>

            <div className="flex flex-col items-center">
              <div className="bg-gray-100 rounded-lg px-3 py-2 min-w-[50px] text-center">
                <span className="text-xl font-bold text-gray-900">
                  {formatTime(timer.mins)}
                </span>
              </div>
              <span className="text-xs text-gray-500 mt-1">Mins</span>
            </div>

            <span className="text-xl font-bold text-gray-400 pb-6">:</span>

            <div className="flex flex-col items-center">
              <div className="bg-gray-100 rounded-lg px-3 py-2 min-w-[50px] text-center">
                <span className="text-xl font-bold text-gray-900">
                  {formatTime(timer.secs)}
                </span>
              </div>
              <span className="text-xs text-gray-500 mt-1">Secs</span>
            </div>
          </div>
        </div> */}

        {/* Right Section - Action Buttons */}
        {/* <div className="flex gap-2">
          <Button
            type="default"
            className="border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-600 px-4 py-2 h-auto"
            size="small"
          >
            View Client Profile
          </Button>

          <Button
            type="default"
            className="border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-600 px-4 py-2 h-auto"
            size="small"
          >
            View Freelancer Profile
          </Button>

          <Button
            type="default"
            className="border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-600 px-4 py-2 h-auto"
            size="small"
          >
            View All Project
          </Button>
        </div> */}
      </div>
    </div>
  );
};

export default MessageHeader;
