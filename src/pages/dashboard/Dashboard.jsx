import { lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";

const Revenue = lazy(() => import("../../components/dashboard/Revenue"));

import { Skeleton } from "antd";
import AdminStatistics from "../../components/dashboard/AdminStatistics";

import ActiveProduct from "../../components/dashboard/ActiveProduct";
import DeliveryAcceptedChart from "../../components/dashboard/DeliveryAcceptedChart";
import FreelancersWorldMap from "../../components/dashboard/FreelancersWorldMap";
import WorldMap from "../WorldMap/WorldMap";
import WeeklyEarnings from "../../components/dashboard/WicklyEarning";
import {
  useGetDashboardDataQuery,
  useGetClientFreelancerByRegionQuery,
} from "../../features/dashboard/dashboardApi";

const Dashboard = () => {
  const navigate = useNavigate();

  const {
    data: dashboardData,
    isLoading,
    isError,
    error,
  } = useGetDashboardDataQuery();

  console.log("dashboardData", dashboardData);

  // Extract data with proper null checks
  const weeklyEarnings = dashboardData?.data?.last7DaysEarning || [];
  const weeklyDeliveryAccepted =
    dashboardData?.data?.last7DaysTotalDeliveryAcceptProject || [];
  const totalActiveProject =
    dashboardData?.data?.totalActiveProjects?.length || 0;
  const totalFreelancer = dashboardData?.data?.totalFreelancer || 0;
  const totalClient = dashboardData?.data?.totalClient || 0;
  const totalProjectAccepted = dashboardData?.data?.totalAcceptProject || 0;
  const totalProjectDelivered = dashboardData?.data?.totalDeliveryProject || 0;
  const totalRevenue = dashboardData?.data?.totalRevenue || 0;
  const totalUsers = dashboardData?.data?.totalUsers || 0;

  const { data: clientFreelancerByRegion } =
    useGetClientFreelancerByRegionQuery(undefined, {
      refetchOnFocus: true,
      refetchOnReconnect: true,
    });

  // Transform client and freelancer region data
  const transformRegionData = (regionData) => {
    // Null check for regionData
    if (!regionData || !Array.isArray(regionData)) {
      console.warn("Invalid region data received");
      return {};
    }

    // Dynamic transformation
    return regionData
      .filter((item) => item)
      .reduce((acc, item) => {
        // Normalize country name
        const country =
          item.country && item.country.trim() !== ""
            ? item.country.charAt(0).toUpperCase() +
              item.country.slice(1).toLowerCase()
            : "Not Specified";

        // Accumulate counts
        acc[country] =
          (acc[country] || 0) + (item.freelancerCount || item.clientCount || 0);
        return acc;
      }, {});
  };

  // Transform region data
  const freelancerRegionData = transformRegionData(
    clientFreelancerByRegion?.data?.freelancers || []
  );

  const clientRegionData = transformRegionData(
    clientFreelancerByRegion?.data?.clients || []
  );

  // Log transformed data for debugging
  console.log("Freelancer Region Data:", freelancerRegionData);
  console.log("Client Region Data:", clientRegionData);

  const analysisCards = [
    {
      value: totalUsers,
      title: "Total Users",
      icon: "/icons/users.svg",
    },
    {
      value: `$${totalRevenue.toFixed(2)}`,
      title: "Total Revenue",
      icon: "/icons/order.svg",
      percentage: "Last Update",
    },
    {
      value: totalProjectAccepted,
      title: "Total Accepted Projects",
      icon: "/icons/sell.svg",
    },
    {
      value: totalProjectDelivered,
      title: "Total Delivered Projects",
      icon: "/icons/spot.svg",
    },
  ];

  return (
    <div className="flex flex-col gap-10">
      {/* Revenue and CustomerMap */}
      <div className="flex items-center justify-between gap-10">
        <div className="w-full">
          <Suspense fallback={<Skeleton active />}>
            <WeeklyEarnings weeklyEarnings={weeklyEarnings} />
          </Suspense>
        </div>
        <div className="w-full">
          <Suspense fallback={<Skeleton active />}>
            <DeliveryAcceptedChart
              weeklyDeliveryAccepted={weeklyDeliveryAccepted}
            />
          </Suspense>
        </div>

        <div className="w-full">
          <AdminStatistics
            totalUsers={totalUsers}
            totalEarning={totalRevenue}
            totalFreelancer={totalFreelancer}
            totalClient={totalClient}
            totalProjectAccepted={totalProjectAccepted}
            totalProjectDelivered={totalProjectDelivered}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-10">
        <div className="w-8/12 ">
          <Suspense fallback={<Skeleton active />}>
            <Revenue />
          </Suspense>
        </div>

        <div className="w-4/12">
          <ActiveProduct />
        </div>
      </div>

      <div className="flex gap-5">
        <FreelancersWorldMap
          title={"Freelancers Region"}
          freelancersData={freelancerRegionData}
        />
        <WorldMap title={"Clients Region"} clientsData={clientRegionData} />
      </div>
    </div>
  );
};

export default Dashboard;
