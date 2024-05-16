import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { req } from "../utils/client";
import BookCard from "../components/BookCard";

export type BookType = {
  id: number;
  coverImageUrl: string | null;
  ISBN13: string;
  title: string;
  authors: string;
};

export const BookPage = () => {
  const { ISBN13 } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [book, setBook] = useState<BookType>(undefined!);

  useEffect(() => {
    const handleQuery = async () => {
      setIsLoading(true);
      setError("");
      setBook(undefined!);
      try {
        const BookQuery = `get_book/${ISBN13}`;
        const response = await req(BookQuery, "get", {});
        console.log("Book response:", response.data);
        setBook(book);
      } catch (error: any) {
        console.error("Book failed:", error);
        setError(error.message);
      }
      setIsLoading(false);
    };
    handleQuery();
  }, [ISBN13]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center pt-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center pt-5">
      {/* <h1>Book Page {query}</h1> */}
      {error && <p className="text-red-500">{error}</p>}
    
   
    </div>
  );
};
