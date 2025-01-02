import React, { useState } from 'react';
import { useFirebase } from '../../contexts/FirebaseContext';
import { animations } from '../../utils/animations';
import { Post } from '../../types';

export function CreatePost({setPosts}: {setPosts: React.Dispatch<React.SetStateAction<Post[]>>}) {
  const { handlePostEvent, readData } = useFirebase();
  const [newPost, setNewPost] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    
    setIsSubmitting(true);
    await handlePostEvent(newPost, setNewPost);
    await readData((posts) => setPosts(posts));
    setIsSubmitting(false);
  };

  return (
    <div className={`glass-card p-6 rounded-lg ${animations.newPost}`}>
      <h2 className="text-xl font-bold mb-4 text-gray-800">Create Post</h2>
      <form onSubmit={handlePost} className="space-y-4">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-3 rounded-lg glass-effect resize-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
          rows={4}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className={`bg-blue-500/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-blue-600/80 
            ${animations.buttonPress} ${animations.formSubmit}
            ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  );
}