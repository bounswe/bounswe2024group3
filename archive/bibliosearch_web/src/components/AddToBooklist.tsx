import React, { useState, useEffect } from "react";
import axios from "axios";
import { BookDetails } from "../pages/SearchPage";
import { req } from "../utils/client";
import { Booklist } from "../pages/Profile";
import { useUser } from "../providers/UserContest";

const AddToBooklist = ({ book, isOpen, setIsOpen }: { book: BookDetails, isOpen: boolean, setIsOpen: (isOpen: boolean) => void }) => {
  const [booklists, setBooklists] = useState<Booklist[]>([]);
  const [selectedBooklist, setSelectedBooklist] = useState("");
  const { userId } = useUser();


  useEffect(() => {
    if (isOpen && userId) {
      req('get_booklists_of_user/?user_id=' + userId, 'get', {}).then((response) => {
        console.log("Booklists fetched:", response);
        setBooklists(response.data.booklists);
      }).catch((error) => {
        console.error('Failed to fetch booklists:', error);
      });
    }
  }, [isOpen]);

  const handleSave = () => {
    if (selectedBooklist) {
      req(`add_books_to_booklist`, 'post', { booklist_id: selectedBooklist, isbns: [book.ISBN13.replace(/-/g,"")] })
        .then((response) => {
          console.log("Book added to booklist:", response);
          setIsOpen(false);
        })
        .catch((error) => {
          console.error("Failed to add book to booklist:", error);
        });
    }
  };

  return (
    <div className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box">
        <h2 className="font-bold text-lg">Add {book.title} to Booklist</h2>
        <div className="mt-4">
          {booklists.length === 0 ? (
            <p>No booklists found. Create one first.</p>
          ) : (
            <select 
              className="select select-bordered w-full"
              value={selectedBooklist}
              onChange={(e) => setSelectedBooklist(e.target.value)}
            >
              <option value="" disabled>Select a booklist</option>
              {booklists.map((booklist) => (
                <option key={booklist.booklist_id} value={booklist.booklist_id}>
                  {booklist.booklist_name}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="modal-action">
          <button onClick={() => setIsOpen(false)} className="btn">Cancel</button>
          <button onClick={handleSave} className="btn btn-primary" disabled={!selectedBooklist}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default AddToBooklist;
