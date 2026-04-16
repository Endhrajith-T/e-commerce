export default function StatusBadge({ status }: any) {
  const colors: any = {
    pending: "bg-yellow-200 text-yellow-800",
    confirmed: "bg-blue-200 text-blue-800",
    shipped: "bg-purple-200 text-purple-800",
    delivered: "bg-green-200 text-green-800",
    failed: "bg-red-200 text-red-800",
  };

  return (
    <span className={`px-2 py-1 rounded text-xs ${colors[status]}`}>
      {status}
    </span>
  );
}