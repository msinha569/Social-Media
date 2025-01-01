import React, { useState } from 'react';
import { useFirebase } from '../../contexts/FirebaseContext';
import { animations } from '../../utils/animations';

export function CreatePost() {
  const { handlePostEvent, readData } = useFirebase();
  const [newPost, setNewPost] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    
    setIsSubmitting(true);
    await handlePostEvent(newPost, setNewPost);
    await readData((posts) => posts);
    setIsSubmitting(false);
  };

  return (
    <div className={`bg-white p-6 rounded-lg shadow-md ${animations.newPost}`}>
      <h2 className="text-xl font-bold mb-4">Create Post</h2>
      <form onSubmit={handlePost} className="space-y-4">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          rows={4}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 
            ${animations.buttonPress} ${animations.formSubmit}
            ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  );
}