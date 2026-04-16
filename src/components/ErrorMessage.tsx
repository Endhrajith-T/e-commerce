export default function ErrorMessage({ message }: any) {
  return (
    <p className="text-red-500 text-sm mt-2">
      {message}
    </p>
  );
}