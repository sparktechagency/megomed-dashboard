import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Button, Input, Typography, message } from "antd";
import { ArrowLeft, Key } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "../../features/auth/authApi";

const { Title, Text } = Typography;

const ResetPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validateForm = () => {
    const newErrors = {};

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(formData.password.trim())) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Confirm password validation
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password.trim() !== formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const onFinish = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await resetPassword({
        newPassword: formData.password.trim(),
        confirmPassword: formData.confirmPassword.trim(),
      }).unwrap();

      if (response.success) {
        message.success(response.message || "Password reset successfully!");
        // Navigate to login after successful reset
        navigate("/auth/login");
        localStorage.removeItem("adminForgetOtpMatchToken");
      } else {
        message.error(
          response.message || "Failed to reset password. Please try again."
        );
      }
    } catch (error) {
      console.error("Reset password error:", error);
      message.error(
        error?.data?.message ||
          error?.message ||
          "Failed to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-white to-white">
      {/* Background geometric shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large blue circle - bottom left */}
        <div className="absolute -bottom-32 -left-32 w-64 h-64 md:w-[500px] md:h-[500px] lg:w-130 lg:h-130 bg-gradient-to-r from-blue-600 to-blue-300 rounded-full z-10"></div>

        {/* Medium blue circle - top right */}
        <div className="absolute -mt-28 -left-0 w-[860px] h-[920px] rounded-br-[300px] md:rounded-br-[400px] lg:rounded-br-[600px] rounded-r-[150px] md:rounded-r-[200px] lg:rounded-r-[300px] bg-gradient-to-r from-blue-900 to-blue-600"></div>

        {/* Purple gradient circle - bottom right */}
        <div className="absolute -bottom-32 -right-24 w-[500px] h-[500px] bg-gradient-to-r from-blue-600 to-blue-300 rounded-full z-10"></div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center justify-center lg:justify-between min-h-screen py-8">
        {/* Left side - Welcome content (hidden on mobile) */}
        <div className="lg:flex hidden max-w-lg flex-col gap-3 lg:-mt-[350px] md:-mt-[300px] -mt-0 w-full text-white">
          {/* 3D illustration placeholder */}
          <div className="w-full flex justify-center items-center">
            <img
              src={"/icons/auth/resetPassword.png"}
              alt="Login"
              className="w-8/12 h-52"
            />
          </div>
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl xl:text-4xl font-bold">
            Create a New Password
          </h1>

          <p className="text-white text-sm md:text-base lg:text-lg leading-relaxed block opacity-90">
            Create a strong password for your account. It should be at least 8
            characters long and different from your previous passwords to keep
            your account secure.
          </p>

          <div>
            <img
              className="absolute left-[380px] -mt-10"
              src={"/icons/auth/loginIcon.png"}
              width={300}
              height={300}
              alt="Chat Icons"
            />
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="flex-shrink-0 w-full rounded-xl shadow-2xl bg-white max-w-md md:max-w-lg lg:ml-8">
          <div className="border-0">
            <div className="p-6 sm:p-8">
              {/* Logo */}
              {/* Icon */}
              <div className="flex justify-center mb-4 sm:mb-6 md:mb-8">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Key className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-600" />
                </div>
              </div>

              {/* Title */}
              <Title
                level={2}
                className="text-center mb-1 sm:mb-2 !text-lg sm:!text-xl md:!text-2xl"
              >
                Create a New Password
              </Title>

              {/* Subtitle */}
              <Text
                type="secondary"
                className="text-center block mb-4 sm:mb-6 md:mb-8 !text-xs sm:!text-sm md:!text-base"
              >
                Your new password must be different to previously used
                passwords.
              </Text>

              {/* Login form */}
              <div className="space-y-4 md:space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <Input.Password
                    placeholder="Enter your new password"
                    size="large"
                    value={formData.password.trim()}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="rounded-full"
                    style={{ padding: "10px 16px", borderRadius: "100px" }}
                    status={errors.password ? "error" : ""}
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                  />
                  {errors.password && (
                    <span className="text-red-500 text-xs md:text-sm mt-1 block">
                      {errors.password}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">
                    Confirm password <span className="text-red-500">*</span>
                  </label>
                  <Input.Password
                    placeholder="Confirm your new password"
                    size="large"
                    value={formData.confirmPassword.trim()}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className="rounded-full"
                    style={{ padding: "10px 16px", borderRadius: "100px" }}
                    status={errors.confirmPassword ? "error" : ""}
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                  />
                  {errors.confirmPassword && (
                    <span className="text-red-500 text-xs md:text-sm mt-1 block">
                      {errors.confirmPassword}
                    </span>
                  )}
                </div>
                <div className="mb-4 md:mb-6">
                  <Button
                    type="primary"
                    loading={loading || isLoading}
                    size="large"
                    className="w-full rounded-full font-semibold"
                    style={{
                      height: "44px",
                      fontSize: "16px",
                      borderRadius: "100px",
                      fontWeight: "bold",
                    }}
                    onClick={onFinish}
                  >
                    Reset password
                  </Button>
                </div>
                <div className="text-center">
                  <Button
                    type="link"
                    onClick={() => navigate("/auth/login")}
                    className="flex items-center justify-center gap-1 sm:gap-2 mx-auto !text-xs sm:!text-sm md:!text-base !p-1 sm:!p-2"
                  >
                    <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                    Back to log in
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
