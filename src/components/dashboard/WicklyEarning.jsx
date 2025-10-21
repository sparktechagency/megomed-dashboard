import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useMemo } from "react";

// Default colors for the chart
const DEFAULT_COLORS = [
  "#8B5CF6",
  "#10B981",
  "#F59E0B",
  "#06B6D4",
  "#A855F7",
  "#3B82F6",
  "#F87171",
];

export default function WeeklyEarningsChart({ weeklyEarnings }) {
  // Transform the weekly earnings data into a format suitable for the pie chart
  const chartData = useMemo(() => {
    if (
      !weeklyEarnings ||
      weeklyEarnings.length === 0 ||
      weeklyEarnings === 0
    ) {
      return [{ name: "No Earnings", value: 0, color: "#E0E0E0" }];
    }

    // If weeklyEarnings is a number (total earnings)
    if (typeof weeklyEarnings === "number") {
      return [{ name: "Earnings", value: weeklyEarnings, color: "#10B981" }];
    }

    // If weeklyEarnings is an array - handle the correct data structure
    return weeklyEarnings.map((item, index) => ({
      name: item.day || "Unknown", // Use the 'day' field from API
      value: item.amount || 0, // Use the 'amount' field from API
      color: DEFAULT_COLORS[index % DEFAULT_COLORS.length],
    }));
  }, [weeklyEarnings]);

  // Calculate total earnings
  const totalEarnings = useMemo(
    () => chartData.reduce((sum, item) => sum + item.value, 0),
    [chartData]
  );

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="text-gray-800 font-semibold">{data.name}</p>
          <p className="text-blue-600 font-bold">
            ${data.value.toLocaleString()}
          </p>
          <p className="text-gray-500 text-sm">
            {((data.value / totalEarnings) * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-col space-y-2 ml-8">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600 text-sm font-medium">
              {entry.value} ($
              {entry.payload.value === 0
                ? "0"
                : entry.payload.value.toLocaleString()}
              )
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#0170DA] max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Weekly Earning</h2>
        <div className="w-12 h-1 bg-cyan-400 rounded-full mt-1"></div>
      </div>

      <div className="flex items-center justify-center">
        <div className="w-80 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={140}
                paddingAngle={3}
                dataKey="value"
                startAngle={90}
                endAngle={450}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="central"
                className="text-3xl font-bold fill-gray-800 pointer-events-none"
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  fill: "#1f2937",
                }}
              >
                {totalEarnings === 0
                  ? "$0"
                  : `$${totalEarnings.toLocaleString()}`}
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <CustomLegend
          payload={chartData.map((item) => ({
            value: item.name,
            color: item.color,
            payload: item,
          }))}
        />
      </div>
    </div>
  );
}
