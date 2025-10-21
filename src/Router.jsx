// Routes.jsx
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

// Layout & Pages
import DeletePage from "./components/delete-page/DeletePage";
import ProtectedRoute from "./components/ProtectedRoute";
import Settings from "./components/Settings/Settings";
import SubscriptionManagement from "./components/Subscription/SubscriptionManagement";
import Layout from "./layouts/Layout";
import CheckEmail from "./pages/auth/CheckEmail";
import ForgotPassword from "./pages/auth/ForgotPassword";
import SetPassword from "./pages/auth/SetPassword";
import Login from "./pages/auth/SignIn";
import SuccessReset from "./pages/auth/SucessReset";
import Verify from "./pages/auth/Verify_user";
import Category from "./pages/category/category";
import Chats from "./pages/chats/Chats";
import Contact from './pages/contact/Contact';
import Dashboard from "./pages/dashboard/Dashboard";
import Earning from "./pages/earning/Earning";
import NotFound from "./pages/NotFound";
import Notification from "./pages/Notification";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ProjectManagement from "./pages/ProjectManagement/ProjectManagement";
import Report from './pages/report/Report';
import Service from "./pages/service/Service";
import SocialManagement from './pages/social/socialManagement';
import TermsConditions from "./pages/TermsConditions";
import UserManagement from "./pages/UserManagement/UserManagement";
import VerifyRequestManagement from './pages/verify_request/VerifyRequestManagement';

const Routers = () => {
  return (
    <Router>
      <Routes>
        {/* Public/Auth Routes */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/success" element={<SuccessReset />} />
        <Route path="/auth/signup/verify" element={<Verify />} />
        <Route
          path="/auth/login/forgot_password"
          element={<ForgotPassword />}
        />
        <Route path="/auth/login/check_email" element={<CheckEmail />} />
        <Route path="/auth/login/set_password" element={<SetPassword />} />
        <Route path="/delete-account" element={<DeletePage />} />

        {/* Protected Routes inside layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="user-management" element={<UserManagement />} />
          {/* Driver Management with nested RequestTable */}
          <Route path="/support" element={<Chats />} />
          <Route path="/support/:id" element={<Chats />} />
          <Route path="/project-management" element={<ProjectManagement />} />
          <Route path="settings" element={<Settings />} />
          <Route path="subscription" element={<SubscriptionManagement />} />
          <Route path="category" element={<Category />} />
          <Route path="service" element={<Service />} />
          <Route path="earning" element={<Earning />} />
          <Route path="verify-request" element={<VerifyRequestManagement />} />
          <Route path="report" element={<Report />} />
          <Route path="contact" element={<Contact />} />
          <Route path="social" element={<SocialManagement />} />
          <Route path="notification" element={<Notification />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="refund-policy" element={<TermsConditions />} />
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default Routers;
