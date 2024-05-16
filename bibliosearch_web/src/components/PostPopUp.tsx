import React, { useState } from 'react';
import FormInput from './FormInput';
import { BookDetails } from '../pages/SearchPage';

function PostPopup({ book, isOpen, setIsOpen }: { book: BookDetails, isOpen: boolean, setIsOpen: (isOpen: boolean) => void }) {

    const handlePost = () => {
        // Add your logic to handle posting here
        // For example, you can send a request to your backend API
        // to save the post data
        console.log('Post submitted');
        // Close the popup after posting
        setIsOpen(false);
    };

    if(!isOpen) return null;
    return (
        <div className="post-popup">
           
            {(
                <div className="card bg-base-100 shadow-xl">
                    <FormInput
                        placeholder="Write your post..."
                        type="text"
                        
                        // You can use state to capture the input value
                        // For example: value={postContent} onChange={(e) => setPostContent(e.target.value)}
                    />
                    <div>{ JSON.stringify(book)}</div>
                    <div className="button-container">
                        <button className="btn btn-primary mt-4" onClick={handlePost}>Submit</button>
                        <button className="btn btn-primary mt-4" onClick={() => setIsOpen(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PostPopup;
