import { ConfigProvider } from "antd";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.jsx";
import "./index.css";
import { store } from "./store.js";
import { SocketProvider } from "./contexts/SocketContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          // Base tokens
          colorPrimary: "#002282",
          colorPrimaryBg: "#e6ebff",
          colorPrimaryBgHover: "#d0d8ff",
          colorPrimaryBorder: "#a3b0ff",
          colorPrimaryBorderHover: "#7a8aff",
          colorPrimaryHover: "#001d6e",
          colorPrimaryActive: "#00175a",
          colorPrimaryTextHover: "#001d6e",
          colorPrimaryText: "#00175a",
          colorPrimaryTextActive: "#00175a",

          colorSuccess: "#52c41a",
          colorWarning: "#faad14",
          colorError: "#ff4d4f",
          colorInfo: "#00175a",

          colorBgContainer: "#ffffff",
          colorBorder: "#d9d9d9",
          colorText: "rgba(0, 0, 0, 0.88)",
          colorTextSecondary: "rgba(0, 0, 0, 0.65)",
          colorTextTertiary: "rgba(0, 0, 0, 0.45)",
          colorTextQuaternary: "rgba(0, 0, 0, 0.25)",
        },
        components: {
          // Button component
          Button: {
            colorPrimaryActive: "#002282",
            controlHeight: 40,
            borderRadius: 6,
            fontWeight: 500,
          },

          // Input components
          Input: {
            colorPrimary: "#00175a",
            activeBorderColor: "#00175a",
            hoverBorderColor: "#00175a",
            activeShadow: "none",
            borderRadius: 6,
            paddingBlock: 10,
            paddingInline: 10,
          },

          // Select component
          Select: {
            colorPrimary: "#00175a",
            optionSelectedBg: "rgba(0, 23, 90, 0.08)",
            optionActiveBg: "rgba(0, 23, 90, 0.16)",
            controlHeight: 44,
          },

          // Checkbox component
          Checkbox: {
            colorPrimary: "#00175a",
          },

          // Radio component
          Radio: {
            colorPrimary: "#00175a",
            dotSize: 10,
          },

          // Switch component
          Switch: {
            colorPrimary: "#00175a",
            handleSize: 16,
          },

          // Slider component
          Slider: {
            colorPrimary: "#00175a",
            colorPrimaryBorder: "#00175a",
            handleSize: 16,
            handleSizeHover: 18,
          },

          // Menu component
          Menu: {
            colorItemBgSelected: "rgba(0, 23, 90, 0.08)",
            colorItemTextSelected: "#00175a",
            colorItemTextHover: "#001d6e",
            colorActiveBarBorderSize: 0,
            paddingBlock: 10,
            paddingInline: 10,
          },

          // Table component
          Table: {
            headerBg: "#fafafa",
            headerColor: "rgba(0, 0, 0, 0.88)",
            rowHoverBg: "rgba(0, 23, 90, 0.04)",
            borderColor: "#f0f0f0",
          },

          // Tabs component
          Tabs: {
            colorPrimary: "#00175a",
            inkBarColor: "#00175a",
            itemSelectedColor: "#00175a",
            itemHoverColor: "#001d6e",
            itemActiveColor: "#00175a",
          },

          // Progress component
          Progress: {
            colorInfo: "#00175a",
          },

          // Tag component
          Tag: {
            colorPrimary: "rgba(0, 23, 90, 0.1)",
            colorPrimaryBorder: "rgba(0, 23, 90, 0.3)",
            colorPrimaryHover: "rgba(0, 23, 90, 0.2)",
          },

          // Notification component
          Notification: {
            colorBgElevated: "#ffffff",
            colorInfo: "#00175a",
            colorInfoBg: "rgba(0, 23, 90, 0.1)",
            colorInfoBorder: "rgba(0, 23, 90, 0.2)",
          },

          // Alert component
          Alert: {
            colorInfo: "#00175a",
            colorInfoBorder: "rgba(0, 23, 90, 0.3)",
            colorInfoBg: "rgba(0, 23, 90, 0.1)",
          },

          // Badge component
          Badge: {
            colorPrimary: "#00175a",
          },

          // Card component
          Card: {
            colorBorderSecondary: "#f0f0f0",
          },

          // Tooltip component
          Tooltip: {
            colorBgDefault: "#00175a",
          },

          // Dropdown component
          Dropdown: {
            colorPrimary: "#00175a",
            paddingBlock: 10,
            paddingInline: 10,
          },

          // Steps component
          Steps: {
            colorPrimary: "#00175a",
            colorText: "rgba(0, 0, 0, 0.88)",
          },

          // DatePicker component
          DatePicker: {
            colorPrimary: "#00175a",
            activeBorderColor: "#00175a",
          },

          // Modal component
          Modal: {
            colorPrimary: "#00175a",
          },

          // Drawer component
          Drawer: {
            colorPrimary: "#00175a",
          },

          // Upload component
          Upload: {
            colorPrimary: "#00175a",
          },
        },
      }}
    >
      <Provider store={store}>
        <SocketProvider>
          <App />
        </SocketProvider>
      </Provider>
    </ConfigProvider>
  </StrictMode>
);
