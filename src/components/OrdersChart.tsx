"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function OrdersChart({ data }: any) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border">
      <h2 className="font-serif text-lg mb-4">Orders Over Time</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <CartesianGrid stroke="#e5e5e5" />
          <Line
            type="monotone"
            dataKey="orders"
            stroke="#C8A96A"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}