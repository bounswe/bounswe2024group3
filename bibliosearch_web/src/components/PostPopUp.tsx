import React, { useState } from 'react';

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
            <button className="post-popup-btn" onClick={() => setIsOpen(true)}>
                Post
            </button>
            {isOpen && (
                <div className="post-popup-card">
                    <textarea
                        placeholder="Write your post..."
                        rows={4} 
                        cols={50}
                        // You can use state to capture the input value
                        // For example: value={postContent} onChange={(e) => setPostContent(e.target.value)}
                    />
                    <button onClick={handlePost}>Submit</button>
                    <button onClick={() => setIsOpen(false)}>Cancel</button>
                </div>
            )}
        </div>
    );
}

export default PostPopup;
