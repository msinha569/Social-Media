import { Post } from '../types';

export type SortOption = 'recent' | 'popular' | 'oldest';

export const sortPosts = (posts: Post[], sortBy: SortOption): Post[] => {
  const sortedPosts = [...posts];

  switch (sortBy) {
    case 'recent':
      return sortedPosts.sort((a, b) => 
        b.timestamp?.seconds - a.timestamp?.seconds
      );
    
    case 'popular':
      return sortedPosts.sort((a, b) => 
        (b.likes - b.dislikes) - (a.likes - a.dislikes)
      );
      
    case 'oldest':
      return sortedPosts.sort((a, b) => 
        a.timestamp?.seconds - b.timestamp?.seconds
      );
      
    default:
      return sortedPosts;
  }
};