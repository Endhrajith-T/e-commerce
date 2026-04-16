"use client";

export default function Toast({ message }: any) {
  if (!message) return null;

  return (
    <div className="fixed bottom-5 right-5 bg-ink text-white px-4 py-2 rounded shadow">
      {message}
    </div>
  );
}