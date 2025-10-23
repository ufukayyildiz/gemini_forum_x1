
export interface User {
  id: string;
  username: string;
  name: string;
  avatarUrl: string;
  joinedAt: string;
  isAdmin?: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface Topic {
  id: string;
  title: string;
  author: User;
  category: Category;
  createdAt: string;
  lastPostedAt: string;
  replyCount: number;
  viewCount: number;
}

export interface Post {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  likes: number;
  topicId: string;
  topicTitle?: string;
}
