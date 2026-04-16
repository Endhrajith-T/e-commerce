import { Book } from "@/types";
import BookCard from "./BookCard";

export default function BookGrid({ books }: { books: Book[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}