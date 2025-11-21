import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const UserSubscriptionBreakdown = ({ data = [] }) => {
  // Colors for the chart sections
  const COLORS = ["#00A819", "#FFD700", "#B0BEC5"];

  // Default data if none provided
  const chartData = data.length > 0 ? data : [
    { type: "Premium", count: 345 },
    { type: "Basic", count: 705 },
    { type: "Free", count: 200 },
  ];

  return (
    <div className="rounded-2xl shadow-md p-4 bg-white border border-gray-200">
      {/* Header */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-xl font-semibold">User Subscription Breakdown</h3>
      </div>

      {/* Pie Chart */}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="type"
              outerRadius={110}
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserSubscriptionBreakdown;

