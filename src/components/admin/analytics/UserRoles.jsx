import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const UserRoles = ({ data = [] }) => {
  // Colors for the chart sections
  const COLORS = ["#4CAF50", "#2196F3", "#FF9800", "#9C27B0"];

  // Default data if none provided
  const chartData = data.length > 0 ? data : [
    { role: "Reader", count: 980 },
    { role: "Author", count: 245 },
    { role: "Admin", count: 25 },
  ];

  return (
    <div className="rounded-2xl shadow-md p-4 bg-white border border-gray-200">
      {/* Header */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-xl font-semibold">User Roles Distribution</h3>
      </div>

      {/* Pie Chart */}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="role"
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

export default UserRoles;

