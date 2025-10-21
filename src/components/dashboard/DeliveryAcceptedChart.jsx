import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const DAYS_MAP = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="text-gray-800 font-semibold">{data.payload.fullDay}</p>
        <p className="text-blue-600 font-bold">
          {data.value} deliveries accepted
        </p>
      </div>
    );
  }
  return null;
};

const CustomYAxisTick = ({ x, y, payload }) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={4}
        textAnchor="end"
        fill="#9CA3AF"
        fontSize="12"
        fontWeight="400"
      >
        {payload.value}
      </text>
    </g>
  );
};

const CustomXAxisTick = ({ x, y, payload }) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="middle"
        fill="#9CA3AF"
        fontSize="12"
        fontWeight="400"
      >
        {payload.value}
      </text>
    </g>
  );
};

export default function DeliveryAcceptedChart({ weeklyDeliveryAccepted = [] }) {
  // Debug: Log the received data
  console.log("DeliveryAcceptedChart - Received data:", weeklyDeliveryAccepted);

  // Transform the delivery data
  const chartData = useMemo(() => {
    if (!weeklyDeliveryAccepted || weeklyDeliveryAccepted.length === 0) {
      return [
        { day: "Mon", value: 0, fullDay: "Monday" },
        { day: "Tue", value: 0, fullDay: "Tuesday" },
        { day: "Wed", value: 0, fullDay: "Wednesday" },
        { day: "Thu", value: 0, fullDay: "Thursday" },
        { day: "Fri", value: 0, fullDay: "Friday" },
        { day: "Sat", value: 0, fullDay: "Saturday" },
        { day: "Sun", value: 0, fullDay: "Sunday" },
      ];
    }

    // Create a map of all days of the week
    const allDays = [
      { day: "Sun", value: 0, fullDay: "Sunday" },
      { day: "Mon", value: 0, fullDay: "Monday" },
      { day: "Tue", value: 0, fullDay: "Tuesday" },
      { day: "Wed", value: 0, fullDay: "Wednesday" },
      { day: "Thu", value: 0, fullDay: "Thursday" },
      { day: "Fri", value: 0, fullDay: "Friday" },
      { day: "Sat", value: 0, fullDay: "Saturday" },
    ];

    // Map the API data to chart format
    weeklyDeliveryAccepted.forEach((item) => {
      // Handle delivery data structure (dateHour, totalDeliveries)
      const date = new Date(item.dateHour);
      const dayShort = date.toLocaleDateString("en-US", { weekday: "short" });
      const value = item.totalDeliveries || 0;

      // Find the corresponding day in our allDays array
      const dayData = allDays.find((d) => d.day === dayShort);
      if (dayData) {
        dayData.value = value;
      }
    });

    console.log("DeliveryAcceptedChart - Transformed data:", allDays);
    return allDays;
  }, [weeklyDeliveryAccepted]);

  // Calculate max value for dynamic Y-axis
  const maxValue = useMemo(
    () => Math.max(100, Math.max(...chartData.map((item) => item.value))),
    [chartData]
  );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#0170DA] max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Delivery Accepted
        </h2>
        <div className="bg-gray-100 rounded-full px-4 py-2">
          <span className="text-sm text-gray-600 font-medium">Last 7 Days</span>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            barCategoryGap="20%"
          >
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={<CustomXAxisTick />}
              height={40}
            />
            <YAxis
              domain={[0, maxValue]}
              ticks={[
                0,
                Math.floor(maxValue / 4),
                Math.floor(maxValue / 2),
                Math.floor((maxValue * 3) / 4),
                maxValue,
              ]}
              axisLine={false}
              tickLine={false}
              tick={<CustomYAxisTick />}
              width={40}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
            />
            <Bar
              dataKey="value"
              fill="#002282"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
