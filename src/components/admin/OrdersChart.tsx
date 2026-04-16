"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Mon", orders: 20 },
  { day: "Tue", orders: 35 },
  { day: "Wed", orders: 28 },
  { day: "Thu", orders: 40 },
  { day: "Fri", orders: 32 },
];

export default function OrdersChart() {
  return (
    <div className="bg-[#fffdf7] border border-[#e5d9c5] p-5 rounded-xl shadow-md">
      <h3 className="font-semibold mb-1">Weekly Orders</h3>
      <p className="text-xs text-[#8d7657] mb-4">Order volume by weekday</p>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="day" stroke="#8f7a5e" tickLine={false} axisLine={false} />
          <YAxis stroke="#8f7a5e" tickLine={false} axisLine={false} />
          <Tooltip />
          <Bar dataKey="orders" fill="#7A5030" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}