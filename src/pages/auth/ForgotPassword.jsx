import { Button, Form, Input, message, Typography } from "antd";
import { ArrowLeft, Key } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForgotPasswordMutation } from "../../features/auth/authApi";
import { saveForgetToken } from "../../features/auth/authService";

const { Title, Text } = Typography;

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (values) => {
    setLoading(true);
    setSuccess("");

    try {
      const response = await forgotPassword(values).unwrap();

      if (response.success) {
        // Save forgetToken to localStorage
        if (response.data?.forgetToken) {
          saveForgetToken(response.data.forgetToken);
        }
        navigate(`/auth/login/check_email?email=${values.email}`);

        setSuccess(
          response.message || "Reset instructions sent to your email!"
        );
        form.resetFields();
        message.success(
          response.message || "Reset instructions sent to your email!"
        );
      } else {
        message.error(
          response.message ||
            "Failed to send reset instructions. Please try again."
        );
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      message.error(
        error?.data?.message ||
          error?.message ||
          "Failed to send reset instructions. Please try again."
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
        <div className="absolute -bottom-16 -left-16 sm:-bottom-24 sm:-left-24 md:-bottom-32 md:-left-32 w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] md:w-[520px] md:h-[520px] bg-gradient-to-r from-blue-600 to-blue-300 rounded-full z-10"></div>

        {/* Medium blue circle - top right */}
        <div className="absolute -mt-14 -left-0 sm:-mt-20 md:-mt-28 w-[500px] h-[500px] sm:w-[650px] sm:h-[650px] md:w-[850px] md:h-[850px] rounded-br-[150px] sm:rounded-br-[250px] md:rounded-br-[300px] lg:rounded-br-[400px] xl:rounded-br-[600px] rounded-r-[75px] sm:rounded-r-[125px] md:rounded-r-[150px] lg:rounded-r-[200px] xl:rounded-r-[300px] bg-gradient-to-r from-blue-900 to-blue-600"></div>

        {/* Purple gradient circle - bottom right */}
        <div className="absolute -bottom-16 -right-12 sm:-bottom-24 sm:-right-18 md:-bottom-32 md:-right-24 w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] md:w-[520px] md:h-[520px] bg-gradient-to-r from-blue-600 to-blue-300 rounded-full z-10"></div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10 flex flex-col lg:flex-row items-center justify-center lg:justify-between min-h-screen py-4 sm:py-6 md:py-8">
        {/* Left side - Welcome content */}
        <div className="flex lg:hidden max-w-sm sm:max-w-md w-full flex-col gap-2 sm:gap-3 mb-6 sm:mb-8 text-white text-center">
          {/* Mobile 3D illustration */}
          <div className="w-full flex justify-center items-center mb-2">
            <img
              src={"/icons/auth/forgot.png"}
              alt="Forgot Password"
              className="w-20 h-20 sm:w-24 sm:h-24"
            />
          </div>
          <h1 className="text-white text-2xl sm:text-3xl font-bold">
            Forgot Password
          </h1>
          <p className="text-white text-xs sm:text-sm leading-relaxed opacity-90 px-2">
            Enter your registered email address, and we'll send you a secure
            link to reset your password.
          </p>
        </div>

        {/* Desktop left side - Welcome content */}
        <div className="lg:flex hidden max-w-lg flex-col gap-3 lg:-mt-[300px] xl:-mt-[350px] w-full text-white">
          {/* Desktop 3D illustration */}
          <div className="w-full flex justify-center items-center">
            <img
              src={"/icons/auth/forgot.png"}
              alt="Forgot Password"
              className="w-32 h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48"
            />
          </div>
          <h1 className="text-white text-3xl lg:text-4xl xl:text-5xl font-bold">
            Forgot Password
          </h1>

          <p className="text-white text-sm lg:text-base xl:text-lg leading-relaxed block opacity-90">
            Enter your registered email address, and we'll send you a secure
            link to reset your password and regain access to your Lunq account.
          </p>

          <div className="hidden xl:block">
            <img
              className="absolute left-[350px] -mt-10"
              src={"/icons/auth/loginIcon.png"}
              width={300}
              height={300}
              alt="Chat Icons"
            />
          </div>
        </div>

        {/* Right side - forgot form */}
        <div className="w-full sm:w-10/12 md:w-8/12 lg:w-6/12 xl:w-5/12 flex items-center justify-center px-2 sm:px-4">
          <div className="max-w-sm sm:max-w-md w-full bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
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
              Forgot password?
            </Title>

            {/* Subtitle */}
            <Text
              type="secondary"
              className="text-center block mb-4 sm:mb-6 md:mb-8 !text-xs sm:!text-sm md:!text-base"
            >
              No worries, we'll send you reset instructions.
            </Text>

            {/* Form */}
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              validateMessages={{
                required: "Please input your email!",
                types: {
                  email: "Please enter a valid email address",
                },
              }}
            >
              <Form.Item
                label={
                  <span className="text-xs sm:text-sm md:text-base">Email</span>
                }
                name="email"
                rules={[
                  {
                    required: true,
                  },
                  {
                    type: "email",
                  },
                ]}
                className="mb-4 sm:mb-5 md:mb-6"
              >
                <Input
                  size="large"
                  placeholder="Enter your email"
                  style={{
                    padding: "8px 14px",
                    borderRadius: "100px",
                    fontSize: window.innerWidth < 640 ? "14px" : "16px",
                  }}
                  className="h-10 sm:h-11 md:h-12"
                />
              </Form.Item>

              <Form.Item className="mb-3 sm:mb-4 md:mb-5">
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  style={{
                    height: "44px",
                    fontSize: "16px",
                    borderRadius: "100px",
                    fontWeight: "bold",
                  }}
                  className="sm:h-11 md:h-12"
                  loading={loading || isLoading}
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>

            {/* Back to Login */}
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
  );
};

export default ForgotPasswordPage;
