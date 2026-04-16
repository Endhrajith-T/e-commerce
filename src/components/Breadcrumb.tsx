import Link from "next/link";

export default function Breadcrumb({ title }: any) {
  return (
    <div className="text-sm text-gray-500">
      <Link href="/">Home</Link> / {title}
    </div>
  );
}