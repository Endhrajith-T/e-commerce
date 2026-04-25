"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", revenue: 12000 },
  { month: "Feb", revenue: 18000 },
  { month: "Mar", revenue: 15000 },
  { month: "Apr", revenue: 22000 },
];

export default function RevenueChart() {
  return (
    <div className="bg-[#fffdf7] border border-[#e5d9c5] p-5 rounded-xl shadow-md">
      <h3 className="font-semibold mb-1">Revenue Trend</h3>
      <p className="text-xs text-[#8d7657] mb-4">Month-over-month gross sales</p>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="month" stroke="#8f7a5e" tickLine={false} axisLine={false} />
          <YAxis stroke="#8f7a5e" tickLine={false} axisLine={false} />
          <Tooltip formatter={(v) => `₹ ${Number(v).toLocaleString("en-IN")}`} />
          <Line type="monotone" dataKey="revenue" stroke="#9A7230" strokeWidth={3} dot={{ r: 4, fill: "#9A7230" }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}