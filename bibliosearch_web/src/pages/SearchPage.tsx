import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { req } from "../utils/client";
import BookCard from "../components/BookCard";

export type BookDetails = {
  id: number;
  coverImageUrl: string | null;
  ISBN13: string;
  title: string;
  authors: string;
};

export const SearchPage = () => {
  const { query } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [books, setBooks] = useState<BookDetails[]>([]);

  useEffect(() => {
    const handleQuery = async () => {
      setIsLoading(true);
      setError("");
      setBooks([]);
      try {
        const searchQuery = `book/search?keyword=${query}`;
        const response = await req(searchQuery, "get", {});
        console.log("Search response:", response.data);
        const books: BookDetails[] = response.data.data.map(
          (book: any, idx: number) => ({
            id: idx,
            ISBN13: book.ISBN13.value,
            title: book.title.value,
            authors: book.authors.value,
            coverImageUrl: book.cover?.value,
          })
        );
        if (books.length === 0) {
            throw new Error("No books found");
        }
        setBooks(books);
      } catch (error: any) {
        console.error("Search failed:", error);
        setError(error.message);
      }
      setIsLoading(false);
    };
    handleQuery();
  }, [query]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center pt-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center pt-5">
      {/* <h1>Search Page {query}</h1> */}
      {error && <p className="text-red-500">{error}</p>}
      {/* {JSON.stringify(books, null, 2)} */}

      <div className="flex flex-col gap-4">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};
