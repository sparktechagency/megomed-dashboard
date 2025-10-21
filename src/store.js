import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import { businessApi } from "./features/bussinessManagement/bussinessApi";
import { dashboardApi } from "./features/dashboard/dashboardApi";
import { earningApi } from "./features/earning/earningApi";
import idReducer from "./features/ids/idSlice";
import { userApi } from "./features/userManagement/userManagementApi";
import { projectApi } from "./features/project/projectApi";
import { serviceApi } from "./features/service/serviceApi";
import { categoryApi } from "./features/category/categoryApi";

const apis = [
  businessApi,
  dashboardApi,
  earningApi,
  userApi,
  projectApi,
  serviceApi,
  categoryApi,
];

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ids: idReducer, // Add the ID slice to store
    ...Object.fromEntries(apis.map((api) => [api.reducerPath, api.reducer])),
  },
  middleware: (getDefaultMiddleware) => {
    // Deduplicate middleware references (many feature APIs may share the same baseApi)
    const uniqueApiMiddleware = Array.from(
      new Set(apis.map((api) => api.middleware))
    );
    return getDefaultMiddleware().concat(uniqueApiMiddleware);
  },
});
