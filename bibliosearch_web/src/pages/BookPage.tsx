import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { req } from "../utils/client";
import BookCard from "../components/BookCard";
import { useLocation } from 'react-router-dom';

export type BookType = {
  id: number;
  cover: string | null;
  isbn: string;
  title: string;
  authors: string;
  publication_date: string;
};

export const BookPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isbn = searchParams.get('isbn');
  


  const [isBook, setIsBook] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [book, setBook] = useState<BookType>();

  useEffect(() => {
    const handleQuery = async () => {
      setIsLoading(true);
      setError("");
      setBook(undefined!);
      try {
        const BookQuery = `get_book/?isbn=${isbn}`;
        const response = await req(BookQuery, "get", {});
        console.log("Book response:", response.data);
        setBook(response.data);
       
        setIsBook(true);
      } catch (error: any) {
        console.error("Book failed:", error);
        setError(error.message);
      }
      setIsLoading(false);
    };
    handleQuery();
  }, [isbn]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center pt-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center pt-5">
      {isBook&&  <div className="card bg-base-100 shadow-xl">
      {/* Conditional rendering for the image */}
      <figure>
        {book!.cover ? (
          <img src={book!.cover!}  />
        ) : (
          <></>
        )}
      </figure>
      <div className="card-body">
        <h2 className="card-title">{book!.title}</h2>
        <p>ISBN: {book!.isbn}</p>
        <p>Author: {book!.authors}</p>
        {book!.publication_date ? (<p>Publication Date: {book!.publication_date}</p>) :(
          <></>
        ) }
      
      
      </div>
    </div>}
      {error && <p className="text-red-500">{error}</p>}
    
   
    </div>
  );
};
