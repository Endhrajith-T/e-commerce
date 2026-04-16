"use client";

type Props = {
  value: string;
  onChange: (val: string) => void;
};

export default function SearchBar({ value, onChange }: Props) {
  return (
    <input
      type="text"
      placeholder="Search books..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border px-4 py-2 rounded mb-6"
    />
  );
}