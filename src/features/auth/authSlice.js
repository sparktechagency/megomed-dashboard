import { createSlice } from "@reduxjs/toolkit";
import {
  saveToken,
  saveRefreshToken,
  getToken,
  getRefreshToken,
  removeToken,
} from "./authService";

const initialState = {
  token: getToken(),
  refreshToken: getRefreshToken(),
  user: null,
  isAuthenticated: !!getToken(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData: (state, action) => {
      const { accessToken, refreshToken, user } = action.payload;
      state.token = accessToken;
      state.refreshToken = refreshToken;
      state.user = user;
      state.isAuthenticated = true;
      saveToken(accessToken);
      saveRefreshToken(refreshToken);
    },
    setToken: (state, action) => {
      state.token = action.payload;
      saveToken(action.payload);
    },
    logout: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.user = null;
      state.isAuthenticated = false;
      removeToken();
    },
  },
});

export const { setAuthData, setToken, logout } = authSlice.actions;
export default authSlice.reducer;
