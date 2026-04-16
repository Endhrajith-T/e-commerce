import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-200 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
        <Link href="/" className="bg-gray-900 text-white px-6 py-2 rounded-lg">
          Go Home
        </Link>
      </div>
    </div>
  );
}
