import React, { useState } from 'react';
import FormInput from './FormInput';
import { BookDetails } from '../pages/SearchPage';
import { req } from '../utils/client';

function PostPopup({ book, isOpen, setIsOpen }: { book: any, isOpen: boolean, setIsOpen: (isOpen: boolean) => void }) {

    const [error, setError] = useState("");
    const [content, setContent] = useState("");
    


    const handlePost = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            await req("create_post", "post", {
              book_data: book.book_data,
              content: content
            });
            console.log('Post submitted');
          } catch (error: any) {
            setError(error.message);
          }
        // Add your logic to handle posting here
        // For example, you can send a request to your backend API
        // to save the post data
        
        // Close the popup after posting
        setIsOpen(false);
    };

    if(!isOpen) return null;
    return (
        <div className="post-popup">
           
            {(
                <div className="card bg-base-100 shadow-xl">
                          <FormInput  type="text" placeholder ="Write your post" value ={content} onChange ={(e:any) => setContent(e.target.value)} /> 
                    <div className="button-container">
                        <button className="btn btn-primary mt-4" onClick={handlePost}>Submit</button>
                        <button className="btn btn-primary mt-4" onClick={() => setIsOpen(false)}>Cancel</button>
                    </div>
                    <p className="text-red-500">{error}</p>
                </div>
            )}
        </div>
    );
}

export default PostPopup;
