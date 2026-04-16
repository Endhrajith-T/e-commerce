"use client";

export default function Modal({ children, open }: any) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white p-6 rounded">{children}</div>
    </div>
  );
}