import { Button, Modal } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  RiLogoutCircleLine,
  RiMenuFoldLine,
  RiMenuUnfoldLine,
} from "react-icons/ri";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { menuDatas } from "../constants/menuDatas";
import { logout } from "../features/auth/authSlice";

const Sidebar = () => {
  const location = useLocation();
  const router = useNavigate();
  const dispatch = useDispatch();
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setCollapsed(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleSubMenu = (index) => {
    if (openSubMenu === index) {
      setOpenSubMenu(null);
      localStorage.removeItem("openSubMenu");
    } else {
      setOpenSubMenu(index);
      localStorage.setItem("openSubMenu", index);
    }
  };

  useEffect(() => {
    const storedOpenSubMenu = localStorage.getItem("openSubMenu");
    if (storedOpenSubMenu !== null) {
      setOpenSubMenu(parseInt(storedOpenSubMenu, 10));
    }
  }, []);

  useEffect(() => {
    const activeSubMenuIndex = menuDatas.findIndex((item) =>
      item.subLinks?.some(
        (subLink) =>
          location.pathname.startsWith(subLink.link) ||
          location.pathname === subLink.link
      )
    );

    const activeMainMenuIndex = menuDatas.findIndex(
      (item) =>
        location.pathname === item.link ||
        (item.link !== "/" && location.pathname.startsWith(item.link + "/"))
    );

    if (activeSubMenuIndex !== -1) {
      setOpenSubMenu(activeSubMenuIndex);
    } else if (activeMainMenuIndex !== -1) {
      setOpenSubMenu(null);
    }
  }, [location.pathname]);

  const showLogoutModal = () => {
    setIsLogoutModalVisible(true);
  };

  const handleLogoutOk = () => {
    setIsLogoutModalVisible(false);
    localStorage.clear();
    router("/auth/login");
  };

  const handleLogoutCancel = () => {
    setIsLogoutModalVisible(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    // Broadcast logout event to all tabs
    localStorage.setItem("logoutEvent", Date.now().toString());
    router("/auth/login");
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed z-50 p-2 bg-white rounded-md shadow-md top-4 left-4"
        >
          {collapsed ? (
            <RiMenuUnfoldLine size={24} />
          ) : (
            <RiMenuFoldLine size={24} />
          )}
        </button>
      )}

      {/* Sidebar */}
      <motion.div
        className={`bg-white border-r border-r-primary h-screen overflow-y-auto custom-scrollbar2 fixed md:relative z-40 ${
          collapsed ? "w-[80px]" : "w-[300px]"
        } ${
          isMobile && !collapsed ? "left-0" : isMobile ? "-left-full" : "left-0"
        }`}
        initial={{ x: isMobile ? -300 : 0 }}
        animate={{ x: collapsed && isMobile ? -300 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div
          className={`h-[200px] border-b flex flex-col justify-center items-center gap-3 border-b-primary ${
            collapsed ? "px-0" : "px-4"
          }`}
        >
          <div className="flex items-center justify-center">
            <img
              onClick={() => router("/")}
              src={"/icons/dashboard_logoCopy.png"}
              title="company logo"
              className={`cursor-pointer select-none ${
                collapsed ? "w-16 h-8" : "w-40 h-20"
              }`}
            />
          </div>
        </div>

        <div className={`${collapsed ? "pl-2" : "pl-6"}`}>
          <ul className="pt-3">
            {menuDatas?.map((item, index) => {
              const isShopActive =
                location.pathname.startsWith("/driver-management/") &&
                item.link === "/driver-management";
              const isMealActive =
                location.pathname.startsWith("/meal-management/") &&
                item.link === "/meal-management";
              const isOfferActive =
                location.pathname.startsWith("/offer/") &&
                item.link === "/offer";
              const isSupportActive =
                location.pathname.startsWith("/support") &&
                item.link === "/support";
              const isExactMatch = location.pathname === item.link;
              const isSettingsActive =
                location.pathname.startsWith("/settings");
              const isDeleteActive =
                location.pathname.startsWith("/delete-account");

              const isActive =
                isShopActive ||
                isMealActive ||
                isOfferActive ||
                isSupportActive ||
                isExactMatch ||
                (isSettingsActive && item.title === "Settings");

              return (
                <li key={index} className="py-1 text-textSecondary">
                  <Link
                    to={item.link}
                    className={`flex items-center gap-3 text-sm py-3 font-semibold 
                      ${isActive && "active"} 
                      rounded-s-xl p-2 ${collapsed ? "justify-center" : ""}`}
                    onClick={() => toggleSubMenu(index)}
                  >
                    <span className={`${collapsed ? "pl-0" : "pl-2"} text-2xl`}>
                      <img
                        src={item?.icon}
                        width={24}
                        height={24}
                        alt=""
                        className={isActive ? "active-icon" : "inactive-icon"}
                      />
                    </span>
                    {!collapsed && (
                      <span className="text-lg font-normal">{item?.title}</span>
                    )}
                  </Link>

                  {!collapsed && (
                    <AnimatePresence>
                      {item.subLinks && openSubMenu === index && (
                        <motion.ul
                          layout
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="pt-2 pl-10"
                        >
                          {item.subLinks.map((subLink, subIndex) => (
                            <motion.li
                              key={subIndex}
                              className="mt-1 text-textSecondary"
                            >
                              <Link
                                to={subLink.link}
                                className={`flex items-center gap-3 text-sm py-2 font-semibold 
                                  ${
                                    location.pathname.startsWith(
                                      subLink.link
                                    ) && "activesub"
                                  } 
                                  rounded-s-lg p-2`}
                              >
                                <span className="pl-2 text-2xl">
                                  <img
                                    src={subLink.subicon}
                                    width={24}
                                    height={24}
                                    alt=""
                                  />
                                </span>
                                <span className="text-sm font-normal">
                                  {subLink.title}
                                </span>
                              </Link>
                            </motion.li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  )}
                </li>
              );
            })}
          </ul>
          <button
            className={`flex items-center gap-2 p-3 ${
              collapsed ? "pl-3 justify-center" : "pl-5"
            } mt-10 font-semibold`}
            onClick={showLogoutModal}
          >
            <span>
              <RiLogoutCircleLine size={20} />
            </span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>

        <Modal
          open={isLogoutModalVisible}
          onOk={handleLogoutOk}
          centered
          closable={false}
          onCancel={handleLogoutCancel}
          width={Math.min(400, window.innerWidth - 40)}
          footer={[
            <div
              key="footer"
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "5px",
                paddingBottom: "20px",
              }}
            >
              <Button
                className=""
                key="back"
                onClick={handleLogoutCancel}
                style={{
                  borderColor: "#041B44",
                  fontWeight: "bold",
                  paddingLeft: "50px",
                  paddingRight: "50px",
                  paddingTop: "20px",
                  paddingBottom: "20px",
                }}
              >
                No
              </Button>
              ,
              <Button
                key="submit"
                type="text"
                onClick={handleLogout}
                style={{
                  backgroundColor: "#041B44",
                  paddingLeft: "50px",
                  paddingRight: "50px",
                  paddingTop: "20px",
                  paddingBottom: "20px",
                  color: "white",
                }}
              >
                Yes
              </Button>
            </div>,
          ]}
        >
          <div style={{ textAlign: "center" }}>
            <p className="pt-5 pb-3 text-xl font-bold">
              Do you want to Logout?
            </p>
          </div>
        </Modal>
      </motion.div>

      {/* Overlay for mobile */}
      {isMobile && !collapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;
