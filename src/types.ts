export interface Post {
  id: string;
  description: string;
  likes: number;
  dislikes: number;
  hide: boolean;
  likedBy: string[];
  dislikedBy?: string[];
  timestamp: any;
}

export interface Message {
  id: string;
  message: string;
  user: string;
  timestamp: any;
}