import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Post } from '../../types';
import { useFirebase } from '../../contexts/FirebaseContext';

interface PostListProps {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

export function PostList({ posts, setPosts }: PostListProps) {
  const { handleLikeCount, handleDislikeCount, loggedInUser } = useFirebase();

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="bg-white p-6 rounded-lg shadow-md">
          <p className="mb-4">{post.description}</p>
          <div className="flex gap-4">
            <button
              onClick={() => handleLikeCount(post.likes, (count: number) => {
                const newPosts = [...posts];
                const index = newPosts.findIndex(p => p.id === post.id);
                newPosts[index] = { ...post, likes: count };
                setPosts(newPosts);
              }, post, loggedInUser!)}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-500"
            >
              <ThumbsUp className="w-5 h-5" />
              {post.likes}
            </button>
            <button
              onClick={() => handleDislikeCount(post.dislikes, (count: number) => {
                const newPosts = [...posts];
                const index = newPosts.findIndex(p => p.id === post.id);
                newPosts[index] = { ...post, dislikes: count };
                setPosts(newPosts);
              }, post, loggedInUser!)}
              className="flex items-center gap-2 text-gray-600 hover:text-red-500"
            >
              <ThumbsDown className="w-5 h-5" />
              {post.dislikes}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}