import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Navber from "../components/Navber";
import Sidebar from "./Sidebar";
import { logout } from "../features/auth/authSlice";

const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Listen for logout events from other tabs
  // useEffect(() => {
  //   // Check if there's already a logout event (in case tab was inactive)
  //   const logoutEvent = localStorage.getItem("logoutEvent");
  //   if (logoutEvent) {
  //     dispatch(logout());
  //     localStorage.clear();
  //     navigate("/auth/login");
  //     return;
  //   }

  //   const handleStorageChange = (e) => {
  //     if (e.key === "logoutEvent") {
  //       // Logout event detected from another tab
  //       dispatch(logout());
  //       localStorage.clear();
  //       navigate("/auth/login");
  //     }
  //   };

  //   window.addEventListener("storage", handleStorageChange);

  //   return () => {
  //     window.removeEventListener("storage", handleStorageChange);
  //   };
  // }, [dispatch, navigate]);

  return (
    <div className="flex">
      <div>
        <Sidebar />
      </div>
      <div className="max-h-screen px-10 py-5 overflow-y-auto grow">
        <Navber />
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
