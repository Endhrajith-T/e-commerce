"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#facc15", "#3b82f6", "#22c55e", "#ef4444"];

export default function StatusChart({ data }: any) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border">
      <h2 className="font-serif text-lg mb-4">Order Status</h2>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="value" outerRadius={100}>
            {data.map((_: any, index: number) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}