import { BellOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { Avatar, Badge, Button, Card, Drawer, Input, Tag } from "antd";
import { motion } from "framer-motion";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { useLocation, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import {
  useGetNotificationQuery,
  useReadNotificationSingleMutation,
  useReadNotificationAllMutation,
} from "../features/notification/notification";
import { useProfileQuery } from "../features/profile/profileApi";
import { baseURL, baseURLImage } from "../utils/BaseURL";
import { getImageUrl } from "../utils/getImageUrl";

const Navber = () => {
  const path = useLocation();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const socketRef = useRef(null);
  const popupRef = useRef(null);
  const iconRef = useRef(null);

  const { data: profile, isLoading: profileLoading } = useProfileQuery();
  console.log("Profile Data:", profile?.data?.profile);

  const {
    data: notifications,
    refetch,
    isLoading,
  } = useGetNotificationQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const [readSingle, { isLoading: updateSingleLoading }] =
    useReadNotificationSingleMutation();

  const [readAll, { isLoading: updateAllLoading }] =
    useReadNotificationAllMutation();

  // Check for mobile device
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  useEffect(() => {
    socketRef.current = io(baseURL);

    socketRef.current.on("connect", () => {});

    const handleNewNotification = (notification) => {
      refetch();
    };

    socketRef.current.on(
      `notification::${localStorage.getItem("adminLoginId")}`,
      handleNewNotification
    );

    return () => {
      if (socketRef.current) {
        socketRef.current.off("connect");
        socketRef.current.off(
          `notification::${localStorage.getItem("adminLoginId")}`,
          handleNewNotification
        );
        socketRef.current.disconnect();
      }
    };
  }, []); // Removed refetch from dependencies to prevent infinite loop

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
      } else {
        // Remove search query when input is cleared
        const url = new URL(window.location);
        url.searchParams.delete("search");
        navigate(url.pathname + url.search);
      }
    } else {
      if (path.pathname === "/user-management") {
        navigate(`/user-management?search=${searchQuery}`);
      } else if (path.pathname === "/driver-management") {
        navigate(`/driver-management?search=${searchQuery}`);
      } else if (path.pathname === "/earning") {
        navigate(`/earning?search=${searchQuery}`);
      }
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.read) {
        await readSingle(notification._id);
      }
      refetch();
    } catch (error) {
      // console.error("Error updating notification:", error);
    }
  };

  const handleSeeDetailsClick = () => {
    setVisible(false);
    setDrawerVisible(false);
    navigate("/notification");
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

  // Normalize API response shape - handle multiple formats
  let normalizedNotifications = [];
  let unreadCount = 0;

  if (notifications?.data) {
    if (notifications.data.data?.result) {
      // Format: { data: { data: { result: [...], unReadCount } } }
      const apiContainer = notifications.data.data;
      const rawNotifications = apiContainer.result || [];
      normalizedNotifications = rawNotifications.map((n) => ({
        _id: n?._id,
        text: n?.message,
        type: n?.type ? String(n.type).toUpperCase() : undefined,
        read: !!n?.isRead,
        createdAt: n?.createdAt,
      }));
      unreadCount =
        apiContainer.unReadCount ??
        normalizedNotifications.filter((n) => !n.read).length;
    } else if (Array.isArray(notifications.data.result)) {
      // Format: { data: { result: [...] } }
      const rawNotifications = notifications.data.result || [];
      normalizedNotifications = rawNotifications.map((n) => ({
        _id: n?._id,
        text: n?.message,
        type: n?.type ? String(n.type).toUpperCase() : undefined,
        read: !!n?.isRead,
        createdAt: n?.createdAt,
      }));
      unreadCount = normalizedNotifications.filter((n) => !n.read).length;
    } else if (Array.isArray(notifications.data)) {
      // Format: { data: [...] } - Direct array in data
      const rawNotifications = notifications.data;
      normalizedNotifications = rawNotifications.map((n) => ({
        _id: n?._id,
        text: n?.message,
        type: n?.type ? String(n.type).toUpperCase() : undefined,
        read: !!n?.isRead,
        createdAt: n?.createdAt,
      }));
      unreadCount = normalizedNotifications.filter((n) => !n.read).length;
    }
  }

  const markAllAsRead = async () => {
    try {
      await readAll();
      refetch();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const getNotification = normalizedNotifications;

  // Notification content component to avoid duplication
  const NotificationContent = ({ inDrawer = false }) => (
    <div
      className={`overflow-y-auto ${
        inDrawer ? "max-h-screen" : "max-h-96"
      } custom-scrollbar`}
    >
      {getNotification.length === 0 ? (
        <div className="text-center text-gray-500 p-4">
          <div className="flex justify-center mb-4">
            <img
              src={"/images/notification.png"}
              width={inDrawer ? 150 : 200}
              height={inDrawer ? 150 : 200}
              alt="Notification Icon"
              className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48"
            />
          </div>
          <h3 className="font-bold text-base sm:text-lg leading-6 pb-2">
            There&apos;s no notifications
          </h3>
          <p className="pb-4 text-sm sm:text-base">
            Your notifications will appear on this page.
          </p>
          <Button
            onClick={handleSeeDetailsClick}
            type="primary"
            className="w-full"
            size="middle"
          >
            See More
          </Button>
        </div>
      ) : (
        getNotification.map((notif, index) => (
          <div
            key={notif._id || index}
            className={`flex items-start p-3 transition duration-300 border-b border-gray-100 hover:bg-gray-50 ${
              !notif.read ? "bg-blue-50" : ""
            }`}
          >
            <div
              className="flex-1 cursor-pointer"
              onClick={() => handleNotificationClick(notif)}
            >
              <div className="flex items-center justify-between mb-1 flex-wrap">
                {notif.type && (
                  <Tag color={getTypeColor(notif.type)} className="text-xs">
                    {notif.type}
                  </Tag>
                )}
                <span className="ml-auto text-xs text-gray-500 whitespace-nowrap">
                  {formatTime(notif.createdAt)}
                </span>
              </div>
              <p
                className={`text-sm break-words ${
                  !notif.read ? "font-medium" : "text-gray-600"
                }`}
              >
                {notif.text}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <>
      {/* Main Navbar */}
      <div className="flex items-center justify-between pb-3 sm:pb-5 px-2 sm:px-4">
        {/* Search Section - Hidden on mobile for driver-management */}
        {path.pathname === "/driver-management" && (
          <div className="hidden sm:flex items-center justify-between flex-1 max-w-lg lg:max-w-2xl mr-4">
            <Input
              size="large"
              onChange={handleSearch}
              placeholder="Search here Institute Name, Email, Subscription"
              className="w-full"
              style={{
                borderColor: "#041B44",
                color: "#333",
              }}
              suffix={
                <CiSearch className="text-xl sm:text-2xl text-opacity-50 text-textPrimary" />
              }
            />
          </div>
        )}

        {/* Mobile Search Button for driver-management */}
        {path.pathname === "/driver-management" && (
          <div className="flex sm:hidden items-center mr-2">
            <Button
              icon={<CiSearch />}
              onClick={() => setDrawerVisible(true)}
              className="border-0 shadow-none"
            />
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center justify-end gap-2 sm:gap-4 ml-auto">
          {/* Profile Section */}
          <div
            onClick={() => navigate("/settings")}
            className="cursor-pointer flex items-center"
          >
            {/* Hide name on mobile, show on larger screens */}
            <span className="hidden sm:inline-block mr-2 text-gray-700 text-sm lg:text-base">
              Hello,{" "}
              <b className="break-words">
                {profile?.data?.fullName || "Sabbir"}
              </b>
            </span>
            {/* Show only on mobile */}
            <span className="sm:hidden mr-2 text-gray-700 text-xs">
              <b>{profile?.data?.fullName?.split(" ")[0] || "Sabbir"}</b>
            </span>
            <Avatar
              src={
                profile?.data?.profile
                  ? `${getImageUrl(profile?.data?.profile)}`
                  : `/avator2.png`
              }
              size={isMobile ? 28 : 32}
              className="flex-shrink-0"
            />
          </div>

          {/* Notification Bell */}
          <Badge
            count={unreadCount}
            className="cursor-pointer"
            onClick={() =>
              isMobile ? setDrawerVisible(true) : setVisible(!visible)
            }
            ref={iconRef}
            size={isMobile ? "small" : "default"}
          >
            <BellOutlined className="text-xl sm:text-2xl text-gray-600 transition duration-300 hover:text-gray-800" />
          </Badge>
        </div>

        {/* Desktop Notification Popup */}
        {visible && !isMobile && (
          <motion.div
            ref={popupRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute overflow-hidden bg-white border border-gray-200 shadow-xl right-2 sm:right-4 top-12 sm:top-14 w-80 sm:w-96 rounded-xl z-50"
          >
            <Card
              title="Notifications"
              className="p-0"
              extra={
                <Button
                  size="small"
                  type="link"
                  onClick={handleSeeDetailsClick}
                >
                  See All
                </Button>
              }
            >
              <NotificationContent />
            </Card>
          </motion.div>
        )}
      </div>

      {/* Mobile Search Drawer for driver-management */}
      {path.pathname === "/driver-management" && (
        <Drawer
          title="Search"
          placement="top"
          height="auto"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible && isMobile}
          className="sm:hidden"
        >
          <div className="p-4">
            <Input
              size="large"
              onChange={handleSearch}
              placeholder="Search here Institute Name, Email, Subscription"
              autoFocus
              style={{
                borderColor: "#041B44",
                color: "#333",
              }}
              suffix={
                <CiSearch className="text-xl text-opacity-50 text-textPrimary" />
              }
            />
          </div>
        </Drawer>
      )}

      {/* Mobile Notification Drawer */}
      <Drawer
        title={
          <div className="flex items-center justify-between">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <Button
                size="small"
                type="link"
                onClick={markAllAsRead}
                loading={updateAllLoading}
              >
                Mark all as read
              </Button>
            )}
          </div>
        }
        placement="right"
        width="100%"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible && isMobile}
        className="sm:hidden"
      >
        <NotificationContent inDrawer={true} />
      </Drawer>

      {/* Custom CSS for responsive design */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }

        @media (max-width: 640px) {
          .ant-card-head-title {
            font-size: 16px !important;
          }
          .ant-badge-count {
            font-size: 10px !important;
            min-width: 16px !important;
            height: 16px !important;
            line-height: 16px !important;
          }
        }

        @media (min-width: 641px) and (max-width: 1024px) {
          .ant-input-affix-wrapper {
            max-width: 400px;
          }
        }

        @media (min-width: 1025px) {
          .ant-input-affix-wrapper {
            max-width: 500px;
          }
        }

        /* Responsive text sizing */
        @media (max-width: 480px) {
          .notification-text {
            font-size: 12px;
          }
          .notification-time {
            font-size: 10px;
          }
        }

        @media (min-width: 481px) and (max-width: 768px) {
          .notification-text {
            font-size: 13px;
          }
          .notification-time {
            font-size: 11px;
          }
        }

        /* Ensure proper spacing on different screen sizes */
        @media (max-width: 640px) {
          .navbar-container {
            padding: 8px 12px;
          }
        }

        @media (min-width: 641px) and (max-width: 1024px) {
          .navbar-container {
            padding: 12px 20px;
          }
        }

        @media (min-width: 1025px) {
          .navbar-container {
            padding: 16px 24px;
          }
        }
      `}</style>
    </>
  );
};

export default Navber;
