import React, { useState } from "react";
import { BookDetails } from "../pages/SearchPage";
import { Link } from "react-router-dom";
import PostPopup from "./PostPopUp";
import AddToBooklist from "./AddToBooklist";

const handleDetailsClick = (book: BookDetails) => {
  localStorage.setItem("book", JSON.stringify(book));
}

// BookCard component
const BookCard = ({ book }: { book: BookDetails }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBookListOpen, setIsBookListOpen] = useState(false);
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
          <Link to={`/get_book/?isbn=${book.ISBN13}`} onClick={() => handleDetailsClick(book)} className="btn btn-primary">
            {" "}
            Details{" "}
          </Link>
          <button className="btn btn-ghost" onClick={() => setIsBookListOpen(true)}> Bookmark </button>
          <button onClick={() => setIsOpen(true)} className="btn btn-ghost">
            {" "}
            Write Post{" "}
          </button>
        </div>
        <PostPopup book={book} isOpen={isOpen} setIsOpen={setIsOpen} />
        <AddToBooklist book={book} isOpen={isBookListOpen} setIsOpen={setIsBookListOpen} />
      </div>
    </div>
  );
};

export default BookCard;
