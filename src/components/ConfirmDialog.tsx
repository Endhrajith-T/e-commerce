"use client";

export default function ConfirmDialog({ open, onConfirm }: any) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50">
      <div className="bg-white p-4">
        <p>Are you sure?</p>
        <button onClick={onConfirm}>Yes</button>
      </div>
    </div>
  );
}