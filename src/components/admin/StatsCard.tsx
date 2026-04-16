"use client";

type Props = {
  title: string;
  value: string;
  subtitle?: string;
  trend?: string;
};

export default function StatsCard({ title, value, subtitle, trend }: Props) {
  return (
    <div className="bg-[#fffdf7] border border-[#e5d9c5] p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow">
      <p className="text-xs tracking-[0.14em] uppercase text-[#9A7230]">{title}</p>
      <h2 className="text-3xl font-semibold mt-2 text-[#2E1E0F]">{value}</h2>
      {subtitle && (
        <p className="text-xs text-[#8d7657] mt-1">{subtitle}</p>
      )}
      {trend && <p className="text-xs text-[#5a3820] mt-2">{trend}</p>}
    </div>
  );
}