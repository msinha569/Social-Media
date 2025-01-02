import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Post } from '../../types';
import { useFirebase } from '../../contexts/FirebaseContext';
import { animations } from '../../utils/animations';

interface PostListProps {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

export function PostList({ posts, setPosts }: PostListProps) {
  const { handleLikeCount, handleDislikeCount, loggedInUser } = useFirebase();

  return (
    <div className="space-y-4">
      {posts.map((post, index) => (
        <div 
          key={post.id} 
          className="glass-card p-6 rounded-lg"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <p className="mb-4 text-gray-800">{post.description}</p>
          <div className="flex gap-4">
            <button
              onClick={() => handleLikeCount(post.likes, (count: number) => {
                const newPosts = [...posts];
                const index = newPosts.findIndex(p => p.id === post.id);
                newPosts[index] = { ...post, likes: count };
                setPosts(newPosts);
              }, post, loggedInUser!)}
              className={`flex items-center gap-2 text-gray-600 hover:text-blue-500 ${animations.likeButton}`}
            >
              <ThumbsUp className="w-5 h-5" />
              <span className={animations.likeCount}>{post.likes}</span>
            </button>
            <button
              onClick={() => handleDislikeCount(post.dislikes, (count: number) => {
                const newPosts = [...posts];
                const index = newPosts.findIndex(p => p.id === post.id);
                newPosts[index] = { ...post, dislikes: count };
                setPosts(newPosts);
              }, post, loggedInUser!)}
              className={`flex items-center gap-2 text-gray-600 hover:text-red-500 ${animations.likeButton}`}
            >
              <ThumbsDown className="w-5 h-5" />
              <span className={animations.likeCount}>{post.dislikes}</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}