import React from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

const NewUsersByDay = ({ data = [] }) => {
  // Default data if none provided
  const chartData = data.length > 0 ? data : [
    { day: "Mon", users: 5 },
    { day: "Tue", users: 12 },
    { day: "Wed", users: 8 },
    { day: "Thu", users: 15 },
    { day: "Fri", users: 7 },
    { day: "Sat", users: 10 },
    { day: "Sun", users: 4 },
  ];

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
      <h2 className="text-2xl font-bold mb-4">New Users by Day</h2>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />

            <Bar dataKey="users">
              {chartData.map((entry, index) => {
                const day = entry.day;
                const greenDays = ["Mon", "Wed", "Fri", "Sun"];
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={greenDays.includes(day) ? "#00A819" : "#FFFFFF"}
                    stroke="#000000"
                    strokeWidth={2}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default NewUsersByDay;

