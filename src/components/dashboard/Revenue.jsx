import React, { useState } from "react";
import { Card, Typography, Select } from "antd";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useGetTotalRevenueChartdataQuery } from "../../features/dashboard/dashboardApi";

const { Title } = Typography;
const { Option } = Select;

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const Revenue = () => {
  // Get current year dynamically each time the component renders
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Fetch revenue data
  const { data, error, isLoading } = useGetTotalRevenueChartdataQuery(
    selectedYear,
    {
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  // Transform data to include month names and handle zero values
  const chartData = React.useMemo(() => {
    if (!data?.data) return [];

    return data.data.map((item) => ({
      month: MONTHS[item.month - 1],
      revenue: item.totalIncome || 0,
    }));
  }, [data]);

  // Calculate max value for Y-axis
  const maxRevenue = React.useMemo(() => {
    const revenues = chartData.map((item) => item.revenue);
    return Math.max(100, Math.max(...revenues));
  }, [chartData]);

  // Year options (dynamically update based on current year)
  const yearOptions = React.useMemo(() => {
    const years = [];
    // Add current year and previous 10 years
    for (let i = currentYear; i >= currentYear - 10; i--) {
      years.push(i);
    }

    return years;
  }, [currentYear]);

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "#fff",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <p style={{ color: "#336C79" }}>
            <strong>{label}</strong>
          </p>
          <p style={{ color: "#336C79" }}>
            <strong>${payload[0].value.toLocaleString()}</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="w-full">
        <Card
          className="border border-primary"
          title={
            <div className="flex justify-between items-center">
              <Title level={5}>Total Revenue</Title>
            </div>
          }
        >
          <div className="text-center">Loading revenue data...</div>
        </Card>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="w-full">
        <Card
          className="border border-primary"
          title={
            <div className="flex justify-between items-center">
              <Title level={5}>Total Revenue</Title>
            </div>
          }
        >
          <div className="text-center text-red-500">
            Error loading revenue data
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Card
        className="border border-[#0170DA]"
        title={
          <div className="flex justify-between items-center">
            <Title level={5}>Total Revenue</Title>
            <Select
              value={selectedYear}
              onChange={(value) => setSelectedYear(value)}
              style={{ width: 120 }}
            >
              {yearOptions.map((year) => (
                <Option key={year} value={year}>
                  {year}
                </Option>
              ))}
            </Select>
          </div>
        }
      >
        <ResponsiveContainer width="100%" height={330}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis
              domain={[0, maxRevenue]}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#041B44"
              strokeWidth={2}
              dot={{ r: 5 }}
              name="Monthly Revenue"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default Revenue;
