export const saveToken = (accessToken) => {
  localStorage.setItem("adminToken", accessToken);
};

export const saveRefreshToken = (refreshToken) => {
  localStorage.setItem("adminRefreshToken", refreshToken);
};

export const saveForgetToken = (forgetToken) => {
  localStorage.setItem("adminForgetToken", forgetToken);
};

export const saveForgetOtpMatchToken = (forgetOtpMatchToken) => {
  localStorage.setItem("adminForgetOtpMatchToken", forgetOtpMatchToken);
};

export const getToken = () => {
  return localStorage.getItem("adminToken");
};

export const getRefreshToken = () => {
  return localStorage.getItem("adminRefreshToken");
};

export const getForgetToken = () => {
  return localStorage.getItem("adminForgetToken");
};

export const getForgetOtpMatchToken = () => {
  return localStorage.getItem("adminForgetOtpMatchToken");
};

export const removeToken = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminRefreshToken");
  localStorage.removeItem("adminForgetToken");
  localStorage.removeItem("adminForgetOtpMatchToken");
  localStorage.removeItem("adminLoginId");
};

export const isAuthenticated = () => {
  return !getToken();
};
