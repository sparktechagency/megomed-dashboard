import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Button, Input, message, Typography } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../../features/auth/authApi";
import { setAuthData } from "../../features/auth/authSlice";

const { Title, Text } = Typography;

const LoginPage = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [login, { isLoading }] = useLoginMutation();
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
      const response = await login(formData).unwrap();

      if (response.success) {
        const { accessToken, refreshToken, user } = response.data;

        // Dispatch auth data to Redux store
        dispatch(
          setAuthData({
            accessToken,
            refreshToken,
            user,
          })
        );

        // Set adminLoginId for compatibility - try multiple possible ID fields
        console.log("Full response:", response); // Debug log to see full response
        console.log("User object:", user); // Debug log to see user structure

        const adminId =
          user?.id ||
          user?._id ||
          user?.userId ||
          user?.adminId ||
          response.data?.id ||
          response.data?._id ||
          response.data?.userId ||
          "admin";

        localStorage.setItem("adminLoginId", adminId);
        console.log("Set adminLoginId:", adminId); // Debug log

        message.success(response.message || "Login successful!");

        // Use navigate for client-side routing instead of window.location.href
        navigate("/");
      } else {
        message.error(response.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error(
        error?.data?.message ||
          error?.message ||
          "Login failed. Please check your credentials and try again."
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
        <div className=" lg:flex hidden max-w-lg flex-col gap-3 lg:-mt-[350px] md:-mt-[300px] -mt-0 w-full text-white ">
          {/* 3D illustration placeholder */}
          <div className="w-full flex justify-center items-center">
            <img
              src={"/images/login.png"}
              alt="Login"
              className="w-36 h-36 md:w-40 md:h-40 lg:w-48 lg:h-48"
            />
          </div>
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold">
            Welcome Back
          </h1>

          <p className="text-white text-sm md:text-base lg:text-lg leading-relaxed block opacity-90">
            Log in to connect with verified professionals, manage projects, and
            collaborate easily. Lunq offers secure payments, direct contracts,
            and zero commission—giving you full control over your work and
            earnings.
          </p>

          <div>
            <img
              className="absolute left-[350px] -mt-10"
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
              <div className="flex flex-col gap-4 md:gap-8">
                <div className="w-full flex justify-center items-center">
                  <img
                    src={"/icons/auth/loginIcon2.png"}
                    alt=""
                    className="w-40 h-auto md:w-48 lg:w-56"
                  />
                </div>
                <h3 className="text-gray-600 text-sm sm:text-base text-center pb-6 md:pb-10">
                  Welcome back! Please enter your details.
                </h3>
              </div>

              {/* Login form */}
              <div className="space-y-4 md:space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Enter your email"
                    size="large"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="rounded-full"
                    style={{ padding: "10px 16px", borderRadius: "100px" }}
                    status={errors.email ? "error" : ""}
                  />
                  {errors.email && (
                    <span className="text-red-500 text-xs md:text-sm mt-1 block">
                      {errors.email}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <Input.Password
                    placeholder="••••••••"
                    size="large"
                    value={formData.password}
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

                <div className="text-right">
                  <button
                    onClick={() => navigate("/auth/login/forgot_password")}
                    className="cursor-pointer hover:underline select-none text-xs md:text-sm"
                  >
                    Forgot password
                  </button>
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
                    Sign In
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

export default LoginPage;
