import { useState, useEffect, useRef } from "react";
import { Spin, Tag } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useGetNotificationQuery,
  useReadNotificationSingleMutation,
  useReadNotificationAllMutation,
} from "../features/notification/notification";
import moment from "moment";

const NotificationPopup = () => {
  const path = useLocation();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const popupRef = useRef(null);
  const iconRef = useRef(null);

  const {
    data: notifications,
    refetch,
    isLoading,
  } = useGetNotificationQuery(undefined, {
    refetchOnFocus: false, // Disable refetch on focus to reduce API calls
    refetchOnReconnect: true, // Keep refetch on reconnect for notifications
    pollingInterval: 60000, // Poll every 60 seconds instead of constant refetching
  });

  const [readSingle, { isLoading: updateSingleLoading }] =
    useReadNotificationSingleMutation();

  const [readAll, { isLoading: updateAllLoading }] =
    useReadNotificationAllMutation();

  // Debug logging to see what's coming from the API
  useEffect(() => {
    console.log("Notification datasss:", notifications);
  }, [notifications]);

  useEffect(() => {
    if (!isLoading) {
      setLoading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        iconRef.current &&
        !iconRef.current.contains(event.target)
      ) {
        setVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    const searchQuery = encodeURIComponent(e.target.value);
    if (!e.target.value) {
      if (path.pathname === "/order") {
        navigate("/order");
      } else if (path.pathname === "/earning") {
        navigate("/earning");
      }
    } else {
      if (path.pathname === "/business-management") {
        navigate(`/business-management?search=${searchQuery}`);
      } else if (path.pathname === "/earning") {
        navigate(`/earning?search=${searchQuery}`);
      }
    }
  };

  const handleNotificationClick = async (notification) => {
    // Just view the notification, don't mark as read automatically
    console.log("Notification clicked:", notification._id);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await readSingle(notificationId);
      refetch();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "Just now";

    const bangladeshTime = moment(timestamp).add(6, "hours");

    return bangladeshTime.fromNow();
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "ALERT":
        return "red";
      case "INFO":
        return "blue";
      case "SUCCESS":
        return "green";
      default:
        return "gray";
    }
  };

  // Normalize API response - handle all possible formats
  let normalized = [];
  let unreadCount = 0;

  if (notifications?.data) {
    // Check which response format we have
    if (notifications.data.data?.result) {
      // Format: { data: { data: { result: [...] } } }
      const container = notifications.data.data;
      const raw = container.result || [];
      normalized = raw.map((n) => ({
        _id: n?._id,
        text: n?.message,
        type: n?.type ? String(n.type).toUpperCase() : undefined,
        read: !!n?.isRead,
        createdAt: n?.createdAt,
      }));
      unreadCount =
        container.unReadCount ?? normalized.filter((n) => !n.read).length;
    } else if (Array.isArray(notifications.data.result)) {
      // Format: { data: { result: [...] } }
      const raw = notifications.data.result || [];
      normalized = raw.map((n) => ({
        _id: n?._id,
        text: n?.message,
        type: n?.type ? String(n.type).toUpperCase() : undefined,
        read: !!n?.isRead,
        createdAt: n?.createdAt,
      }));
      unreadCount = normalized.filter((n) => !n.read).length;
    } else if (Array.isArray(notifications.data)) {
      // Format: { data: [...] } - Direct array in data
      const raw = notifications.data || [];
      normalized = raw.map((n) => ({
        _id: n?._id,
        text: n?.message,
        type: n?.type ? String(n.type).toUpperCase() : undefined,
        read: !!n?.isRead,
        createdAt: n?.createdAt,
      }));
      unreadCount = normalized.filter((n) => !n.read).length;
    }
  }

  console.log("Normalized notifications:", normalized);

  const markAllAsRead = async () => {
    try {
      await readAll();
      refetch();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  return (
    <div className="flex items-center justify-between pt-10">
      <motion.div
        ref={popupRef}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="w-full p-10 bg-white border border-gray-200 rounded-xl"
      >
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Notifications</h3>
            {normalized.length > 0 && (
              <button
                onClick={markAllAsRead}
                disabled={updateAllLoading}
                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
              >
                {updateAllLoading ? "Marking..." : "Mark All as Read"}
              </button>
            )}
          </div>
          <div className="w-full">
            {loading ? (
              <div className="flex justify-center py-4">
                <Spin size="default" />
              </div>
            ) : normalized.length === 0 ? (
              <div className="text-center text-gray-500">
                <div className="pb-[70px]"></div>
                <div className="flex justify-center">
                  <img
                    src={"/images/notification.png"}
                    width={100}
                    height={100}
                    alt="Notification Icon"
                  />
                </div>
                <h3 className="font-bold text-lg leading-[26px] pb-[5px]">
                  There`s no notifications
                </h3>
                <p className="pb-[5px]">
                  Your notifications will appear on this page.
                </p>
              </div>
            ) : (
              normalized.map((notif, index) => (
                <div
                  key={notif._id || index}
                  className={`flex items-start p-3 transition duration-300 border-b border-gray-100 hover:bg-gray-50 ${
                    !notif.read ? "bg-blue-50" : ""
                  }`}
                >
                  <div
                    className="flex-1"
                    onClick={() => handleNotificationClick(notif)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      {notif.type && (
                        <Tag color={getTypeColor(notif.type)}>{notif.type}</Tag>
                      )}
                      <span className="ml-auto text-xs text-gray-500">
                        {formatTime(notif.createdAt)}
                      </span>
                    </div>
                    <p
                      className={`text-sm ${
                        !notif.read ? "font-medium" : "text-gray-600"
                      }`}
                    >
                      {notif.text}
                    </p>
                    {notif.read ? (
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <CheckCircleOutlined className="mr-1" /> Read
                      </div>
                    ) : (
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notif._id);
                          }}
                          disabled={updateSingleLoading}
                          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs rounded border border-gray-300"
                        >
                          Mark as Read
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotificationPopup;
