import React, { useState } from 'react';
import { useFirebase } from '../../contexts/FirebaseContext';

export function CreatePost() {
  const { handlePostEvent, readData } = useFirebase();
  const [newPost, setNewPost] = useState('');

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    await handlePostEvent(newPost, setNewPost);
    readData((posts) => posts); // Trigger data refresh
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Create Post</h2>
      <form onSubmit={handlePost} className="space-y-4">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-3 border rounded-lg resize-none"
          rows={4}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Post
        </button>
      </form>
    </div>
  );
}