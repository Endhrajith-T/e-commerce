export default function BookSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-60 bg-gray-200 animate-pulse rounded" />
      ))}
    </div>
  );
}