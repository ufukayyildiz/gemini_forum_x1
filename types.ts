
export interface User {
  id: string;
  username: string;
  avatarUrl: string;
  name: string;
  joinedAt: string;
}

export interface Category {
  id: number;
  name:string;
  slug: string;
  color: string;
  description: string;
}

export interface Post {
  id: number;
  author: User;
  content: string; // Markdown content
  createdAt: string; // ISO 8601 date string
  likes: number;
  replyToPostNumber: number | null;
  postNumber: number;
  topicTitle?: string; // For replies list in profile
  topicId?: number; // For replies list in profile
}

export interface Topic {
  id: number;
  title: string;
  author: User;
  category: Category;
  createdAt: string; // ISO 8601 date string
  lastPostedAt: string; // ISO 8601 date string
  replyCount: number;
  viewCount: number;
  posts: Post[]; // Typically only the first post is included in list view.
}
