import React, { useState } from 'react';
import { Post } from '../../types';
import { PostItem } from './PostItem';
import { sortPosts, SortOption } from '../../utils/postSorting';
import { ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PostListProps {
  posts: Post[];
  onLike: (post: Post) => void;
  onDislike: (post: Post) => void;
  currentUser: string;
}

export function PostList({ posts, onLike, onDislike, currentUser }: PostListProps) {
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const sortedPosts = sortPosts(posts, sortBy);

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'oldest', label: 'Oldest First' },
  ];

  return (
    <div className="space-y-4">
      <div className="relative">
        <button
          onClick={() => setShowSortMenu(!showSortMenu)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/30 hover:bg-white/40 backdrop-blur-sm border border-white/20 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <ArrowUpDown className="w-4 h-4" />
          <span>{sortOptions.find(opt => opt.value === sortBy)?.label}</span>
        </button>

        <AnimatePresence>
          {showSortMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute left-0 top-12 z-50 w-48 py-2 rounded-lg bg-white/80 backdrop-blur-md shadow-xl border border-white/20"
            >
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortBy(option.value as SortOption);
                    setShowSortMenu(false);
                  }}
                  className={`w-full px-4 py-2 text-left hover:bg-indigo-500/10 transition-colors duration-200 ${
                    sortBy === option.value ? 'text-indigo-600 bg-indigo-500/5' : 'text-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {sortedPosts.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          onLike={() => onLike(post)}
          onDislike={() => onDislike(post)}
          currentUser={currentUser}
        />
      ))}
    </div>
  );
}