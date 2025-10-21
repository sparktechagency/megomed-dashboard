import { Card, Select, Spin } from "antd";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { useOrderChartAnalysisQuery } from "../../features/dashboard/dashboardApi";

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-white border border-gray-300 rounded-md shadow-lg">
        <p className="font-semibold text-gray-700">{label}</p>
        <p className="font-bold text-blue-500">Orders: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const OrderChart = () => {
  const [selectedWeek, setSelectedWeek] = useState("Weekly");
  const {
    data: orderChart,
    error: queryError,
    isLoading: queryLoading,
  } = useOrderChartAnalysisQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  

  const handleWeekChange = (value) => {
    setSelectedWeek(value);
  };


  const parkingData =  [
    {
        "day": "Sunday",
        "totalOrders": 0
    },
    {
        "day": "Monday",
        "totalOrders": 0
    },
    {
        "day": "Tuesday",
        "totalOrders": 0
    },
    {
        "day": "Wednesday",
        "totalOrders": 0
    },
    {
        "day": "Thursday",
        "totalOrders": 6
    },
    {
        "day": "Friday",
        "totalOrders": 0
    },
    {
        "day": "Saturday",
        "totalOrders": 0
    }
]

  return (
    <section className="w-full rounded-[10px] border border-primary bg-white">
      <Card
        className="w-full"
        title={<span className="text-lg md:text-xl lg:text-[24px] font-bold">Parking Chart</span>}
        extra={
          <Select
            defaultValue={selectedWeek}
            style={{ width: 120 }}
            onChange={handleWeekChange}
          >
            <Select.Option value="Weekly">Weekly</Select.Option>
            <Select.Option value="Monthly">Monthly</Select.Option>
          </Select>
        }
      >
        <p className="mb-4 text-sm text-gray-500 md:text-base">
          Order trends for the selected time period.
        </p>
        {queryLoading ? (
          <div className="flex items-center justify-center h-48 md:h-64">
            <Spin />
          </div>
        ) : (
          <div className="h-48 md:h-64 lg:h-[248px] w-full overflow-x-auto">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                margin={{ left: 0, right: 5, top: 5, bottom: 5 }}
                data={parkingData}
              >
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2D9CDB" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#2D9CDB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  tick={{ fontSize: 10, dy: 10 }}
                  height={50}
                />
                <Tooltip content={<CustomTooltip />} />
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <Area
                  type="monotone"
                  dataKey="totalOrders"
                  stroke="#2D9CDB"
                  fillOpacity={1}
                  fill="url(#colorOrders)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </section>
  );
};

export default OrderChart;