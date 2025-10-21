import { Button, Typography, notification } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useVerifyEmailMutation,
  useResendOtpMutation,
} from "../../features/auth/authApi";
import {
  getForgetToken,
  saveForgetOtpMatchToken,
} from "../../features/auth/authService";

const { Title, Text } = Typography;

const LoginPage = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [email, setEmail] = useState("");
  const otpInputRefs = useRef([]);

  const navigate = useNavigate();
  const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  // Handle OTP input change
  const handleChange = useCallback(
    (e, index) => {
      const value = e.target.value;

      if (/^\d*$/.test(value)) {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError("");

        // Auto focus to next input
        if (value && index < 5) {
          otpInputRefs.current[index + 1]?.focus();
        }
      }
    },
    [otp]
  );

  // Handle paste
  const handlePaste = useCallback(
    (e) => {
      e.preventDefault();
      const pasteData = e.clipboardData.getData("text/plain").slice(0, 6);
      if (/^\d+$/.test(pasteData)) {
        const newOtp = [...otp];
        for (let i = 0; i < pasteData.length; i++) {
          newOtp[i] = pasteData[i];
        }
        setOtp(newOtp);
      }
    },
    [otp]
  );

  // Handle backspace
  const handleKeyDown = useCallback(
    (e, index) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        otpInputRefs.current[index - 1]?.focus();
      }
    },
    [otp]
  );

  // Handle form submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const otpValue = otp.join("");

      if (otpValue.length !== 6 || !/^\d+$/.test(otpValue)) {
        setError("Please enter a valid 6-digit OTP");
        return;
      }

      setIsSubmitting(true);
      try {
        const result = await verifyEmail({
          otp: otpValue,
        }).unwrap();

        if (result.success) {
          // Save forgetOtpMatchToken to localStorage
          if (result.data?.forgetOtpMatchToken) {
            saveForgetOtpMatchToken(result.data.forgetOtpMatchToken);
          }
          navigate("/auth/login/set_password");
          // Show custom success modal
          setSuccessMessage(result.message || "Your OTP has been verified");
          setShowSuccessModal(true);
          localStorage.removeItem("adminForgetToken");

          // Hide modal and redirect after 2 seconds
          setTimeout(() => {
            setShowSuccessModal(false);
          }, 2000);
        } else {
          setError(result.message || "Invalid OTP");
          notification.error({
            message: "Verification Failed",
            description: result.message || "Invalid OTP. Please try again.",
          });
        }
      } catch (err) {
        console.error("OTP verification error:", err);
        const errorMessage =
          err?.data?.message ||
          err?.message ||
          "Invalid OTP. Please try again.";
        setError(errorMessage);
        notification.error({
          message: "Verification Failed",
          description: errorMessage,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [otp, navigate, verifyEmail]
  );

  // Handle resend OTP
  const handleResendOtp = useCallback(async () => {
    if (isResendDisabled) return;

    try {
      const response = await resendOtp({
        email: email,
      }).unwrap();

      if (response.success) {
        setTimer(60);
        setIsResendDisabled(true);

        notification.success({
          message: "OTP Resent",
          description:
            response.message || "A new OTP has been sent to your email",
        });
      } else {
        notification.error({
          message: "Failed to Resend",
          description:
            response.message || "Failed to resend OTP. Please try again.",
        });
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      notification.error({
        message: "Failed to Resend",
        description:
          err?.data?.message ||
          err?.message ||
          "Failed to resend OTP. Please try again.",
      });
    }
  }, [isResendDisabled, email, resendOtp]);

  // Get email from URL params or localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailFromUrl = urlParams.get("email");
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, []);

  // Countdown timer for resend OTP
  useEffect(() => {
    let interval;
    if (isResendDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [isResendDisabled, timer]);

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
              src={"/icons/auth/verify.png"}
              alt="Login"
              className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48"
            />
          </div>
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl xl:text-6xl font-bold">
            Verify Your Email
          </h1>

          <p className="text-white text-sm md:text-base lg:text-lg leading-relaxed block opacity-90">
            A password reset Code has been sent to {email}. Check your inbox and
            follow the instructions to reset your password. Didn't get the
            email? Check spam or resend below.
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
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md bg-white rounded-lg p-8 shadow-xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold">
                Enter the Verification Code For Verify Your Email
              </h2>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-6">
                <div className="flex justify-center space-x-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpInputRefs.current[index] = el)}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onPaste={handlePaste}
                      className={`w-12 h-12 text-center text-xl border ${
                        error ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
                {error && (
                  <p className="mt-2 text-sm text-red-600 text-center">
                    {error}
                  </p>
                )}
              </div>
              <div className="pb-3 text-sm text-gray-600 text-center">
                <p>
                  Didn't receive code?{" "}
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isResendDisabled}
                    className={`${
                      isResendDisabled
                        ? "text-gray-400"
                        : "text-blue-600 font-medium"
                    }`}
                    aria-label={
                      isResendDisabled
                        ? `Resend OTP in ${timer} seconds`
                        : "Resend OTP"
                    }
                  >
                    {isResendDisabled ? `Resend in ${timer}s` : "Resend OTP"}
                  </button>
                </p>
              </div>

              <div className="mb-4 md:mb-6">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={isSubmitting || isVerifying}
                  className="w-full rounded-full font-semibold"
                  style={{
                    height: "44px",
                    fontSize: "16px",
                    borderRadius: "100px",
                    fontWeight: "bold",
                  }}
                >
                  Verify OTP
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
