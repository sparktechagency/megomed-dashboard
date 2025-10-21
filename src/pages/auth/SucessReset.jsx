import { Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

const ResetPasswordSuccessPage = () => {
  const navigate = useNavigate();

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
          <div className='w-full flex justify-center items-center'>
            <img src={'/icons/auth/success.png'} alt='Login' className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48" />
          </div>
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl xl:text-4xl font-bold">Password reset</h1>

          <Text className="text-white text-sm md:text-base lg:text-lg leading-relaxed block opacity-90">
            Your password has been successfully reset. You can now log in to your account securely. Click the button below to continue. Welcome back!
          </Text>

          <div>
            <img className='absolute left-[380px] -mt-10' src={"/icons/auth/loginIcon.png"} width={300} height={300} alt='Chat Icons' />
          </div>
        </div>

        {/* Right side - Success message */}
        <div className="w-full md:w-1/2 lg:w-2/5 xl:w-1/3">
          <div className="p-6 mx-auto bg-white shadow-2xl rounded-lg w-full max-w-md md:p-8">
            <div className="flex flex-col items-center justify-center gap-4">
              <img
                src={"/icons/sucess_reset.png"}
                alt="Success Icon"
                className="w-14 h-14"
              />
              <h3 className="text-3xl font-semibold text-center">Password reset</h3>
              <Text className="text-sm font-normal text-center text-gray-600">
                Your password has been successfully reset. Click below to log in magically.
              </Text>
            </div>

            <div className="mt-6">
              <Button
                onClick={() => navigate('/auth/login')}
                type="primary"
                className="w-full rounded-full"
                size="large"
                style={{ height: '44px', fontWeight: 'bold' }}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordSuccessPage;