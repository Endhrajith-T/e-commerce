export default function StockBadge({ stock }: any) {
  return (
    <p className={`mt-3 text-sm ${stock > 5 ? "text-green-600" : "text-red-500"}`}>
      {stock > 0 ? "In Stock" : "Out of Stock"}
    </p>
  );
}