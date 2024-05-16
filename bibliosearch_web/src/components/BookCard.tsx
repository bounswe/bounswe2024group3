import React from "react";
import { BookDetails } from "../pages/SearchPage";
import { Link } from "react-router-dom";

// BookCard component
const BookCard = ({ book }: { book: BookDetails }) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      {/* Conditional rendering for the image */}
      <figure>
        {book.coverImageUrl ? (
          <img src={book.coverImageUrl} alt={book.title} />
        ) : (
          <></>
        )}
      </figure>
      <div className="card-body">
        <h2 className="card-title">{book.title}</h2>
        <p>ISBN: {book.ISBN13}</p>
        <p>Author: {book.authors}</p>
        <div className="card-actions justify-end">
          <Link to={`/book/${book.ISBN13}`} className="btn btn-primary"> Details </Link>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
