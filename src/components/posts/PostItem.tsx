import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Post } from '../../types';

interface PostItemProps {
  post: Post;
  onLike: () => void;
  onDislike: () => void;
  currentUser: string;
}

export function PostItem({ post, onLike, onDislike, currentUser }: PostItemProps) {
  const hasLiked = post.likedBy?.includes(currentUser);
  const hasDisliked = post.dislikedBy?.includes(currentUser);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 rounded-lg"
    >
      <p className="mb-4">{post.description}</p>
      <div className="flex gap-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onLike}
          disabled={hasLiked}
          className={`flex items-center gap-2 ${
            hasLiked ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'
          } transition-colors duration-200`}
        >
          <ThumbsUp className="w-5 h-5" />
          {post.likes}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onDislike}
          disabled={hasDisliked}
          className={`flex items-center gap-2 ${
            hasDisliked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
          } transition-colors duration-200`}
        >
          <ThumbsDown className="w-5 h-5" />
          {post.dislikes}
        </motion.button>
      </div>
    </motion.div>
  );
}