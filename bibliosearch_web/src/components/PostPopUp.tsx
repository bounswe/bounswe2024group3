import React, { useState } from 'react';
import FormInput from './FormInput';

function PostPopup() {
    const [isOpen, setIsOpen] = useState(false);

    const handlePost = () => {
        // Add your logic to handle posting here
        // For example, you can send a request to your backend API
        // to save the post data
        console.log('Post submitted');
        // Close the popup after posting
        setIsOpen(false);
    };

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
