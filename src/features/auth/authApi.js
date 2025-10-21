import { baseApi } from "../../apiBaseQuery";
import {
  getForgetOtpMatchToken,
  getForgetToken,
  getToken,
} from "./authService";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // Email Verification
    verifyEmail: builder.mutation({
      query: (data) => {
        const forgetToken = getForgetToken();
        return {
          url: "/auth/forgot-password-otp-match",
          method: "PATCH",
          body: data,
          headers: {
            token: `${forgetToken}`,
          },
        };
      },
    }),

    // resend otp
    resendOtp: builder.mutation({
      query: (data) => {
        const forgetToken = getForgetToken();
        return {
          url: "/otp/resend-otp",
          method: "PATCH",
          body: data,
          headers: {
            token: `${forgetToken}`,
          },
        };
      },
    }),

    // Forgot Password
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/forgot-password-otp",
        method: "POST",
        body: data,
      }),
    }),

    // Reset Password
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/forgot-password-reset",
        method: "PATCH",
        headers: {
          token: `${getForgetOtpMatchToken()}`,
        },
        body: {
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        },
      }),
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: {
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        },
      }),
    }),
  }),
});

// Export hooks
export const {
  useLoginMutation,
  useVerifyEmailMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useResendOtpMutation,
  useChangePasswordMutation,
} = authApi;
