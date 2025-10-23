
import type { User, Category, Topic, Post } from '../types';

// Mock Data
const USERS: User[] = [
  { id: 'user-1', username: 'react_guru', name: 'Alice', avatarUrl: `https://i.pravatar.cc/150?u=user-1`, joinedAt: '2023-01-15T10:00:00Z', isAdmin: true },
  { id: 'user-2', username: 'tailwind_fan', name: 'Bob', avatarUrl: `https://i.pravatar.cc/150?u=user-2`, joinedAt: '2023-02-20T14:30:00Z' },
  { id: 'user-3', username: 'node_ninja', name: 'Charlie', avatarUrl: `https://i.pravatar.cc/150?u=user-3`, joinedAt: '2023-03-10T09:00:00Z' },
];

const CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'React', description: 'Discussions about the React library and its ecosystem.', color: '61DAFB' },
  { id: 'cat-2', name: 'Tailwind CSS', description: 'Tips, tricks, and showcases for Tailwind CSS.', color: '38B2AC' },
  { id: 'cat-3', name: 'General Discussion', description: 'Talk about anything and everything web dev.', color: 'F6E05E' },
];

let TOPICS: Topic[] = [
  { id: 'topic-1', title: 'What are React Server Components?', author: USERS[0], category: CATEGORIES[0], createdAt: '2023-10-26T10:00:00Z', lastPostedAt: '2023-10-26T12:30:00Z', replyCount: 1, viewCount: 150 },
  { id: 'topic-2', title: 'Best way to handle forms in 2024?', author: USERS[0], category: CATEGORIES[0], createdAt: '2023-10-25T14:00:00Z', lastPostedAt: '2023-10-25T18:45:00Z', replyCount: 1, viewCount: 250 },
  { id: 'topic-3', title: 'Show off your latest Tailwind project!', author: USERS[1], category: CATEGORIES[1], createdAt: '2023-10-24T09:00:00Z', lastPostedAt: '2023-10-24T15:20:00Z', replyCount: 1, viewCount: 500 },
  { id: 'topic-4', title: 'Is HTMX the future?', author: USERS[2], category: CATEGORIES[2], createdAt: '2023-10-26T11:00:00Z', lastPostedAt: '2023-10-26T11:00:00Z', replyCount: 0, viewCount: 80 },
];

let POSTS: Post[] = [
  { id: 'post-1', topicId: 'topic-1', content: 'This is the first post about RSCs. They seem interesting but also complex.', author: USERS[0], createdAt: '2023-10-26T10:00:00Z', likes: 10, topicTitle: TOPICS[0].title },
  { id: 'post-2', topicId: 'topic-1', content: 'I agree! The learning curve might be steep.', author: USERS[1], createdAt: '2023-10-26T12:30:00Z', likes: 5, topicTitle: TOPICS[0].title },
  { id: 'post-3', topicId: 'topic-2', content: "I'm a big fan of React Hook Form combined with Zod for validation. It's a powerful combo.", author: USERS[0], createdAt: '2023-10-25T14:00:00Z', likes: 25, topicTitle: TOPICS[1].title },
  { id: 'post-4', topicId: 'topic-2', content: "I've been using Formik for years and it's still great.", author: USERS[2], createdAt: '2023-10-25T18:45:00Z', likes: 8, topicTitle: TOPICS[1].title },
  { id: 'post-5', topicId: 'topic-3', content: "Just launched my new portfolio site using Tailwind and Next.js! Check it out.", author: USERS[1], createdAt: '2023-10-24T09:00:00Z', likes: 50, topicTitle: TOPICS[2].title },
  { id: 'post-6', topicId: 'topic-3', content: "Wow, that looks amazing! The animations are so smooth.", author: USERS[0], createdAt: '2023-10-24T15:20:00Z', likes: 12, topicTitle: TOPICS[2].title },
];


const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const fetchCategories = async (): Promise<Category[]> => {
  await delay(300);
  return [...CATEGORIES];
};

export const fetchTopics = async (categoryId?: string): Promise<Topic[]> => {
  await delay(500);
  const topicsWithCounts = TOPICS.map(topic => ({
    ...topic,
    replyCount: POSTS.filter(p => p.topicId === topic.id).length - 1
  })).sort((a, b) => new Date(b.lastPostedAt).getTime() - new Date(a.lastPostedAt).getTime());
  if (!categoryId) {
    return topicsWithCounts;
  }
  return topicsWithCounts.filter(topic => topic.category.id === categoryId);
};

export const fetchPosts = async (): Promise<Post[]> => {
    await delay(200);
    return [...POSTS];
}

export const fetchPostsForTopic = async (topicId: string): Promise<Post[]> => {
  await delay(400);
  return POSTS.filter(post => post.topicId === topicId).sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
};

export const fetchUserById = async (userId: string): Promise<User | undefined> => {
  await delay(200);
  return USERS.find(user => user.id === userId);
};

export const fetchTopicsByUser = async (userId: string): Promise<Topic[]> => {
  await delay(400);
  return TOPICS.filter(topic => topic.author.id === userId).sort((a,b) => new Date(b.lastPostedAt).getTime() - new Date(a.lastPostedAt).getTime());
};

export const fetchPostsByUser = async (userId: string): Promise<Post[]> => {
  await delay(400);
  return POSTS
    .filter(post => post.author.id === userId)
    .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map(p => ({...p, topicTitle: TOPICS.find(t => t.id === p.topicId)?.title}));
};

export const createPost = async (topicId: string, content: string, author: User): Promise<Post> => {
  await delay(600);
  const topic = TOPICS.find(t => t.id === topicId);
  if (!topic) throw new Error("Topic not found");
  
  const newPost: Post = {
    id: `post-${Date.now()}`,
    topicId,
    content,
    author,
    createdAt: new Date().toISOString(),
    likes: 0,
    topicTitle: topic.title,
  };
  POSTS.push(newPost);
  
  // Update topic lastPostedAt
  const topicIndex = TOPICS.findIndex(t => t.id === topicId);
  if (topicIndex !== -1) {
    TOPICS[topicIndex] = { ...TOPICS[topicIndex], lastPostedAt: newPost.createdAt };
  }
  
  return newPost;
};

export const login = async (username: string): Promise<User> => {
    await delay(500);
    const user = USERS.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (user) {
        return user;
    }
    throw new Error('User not found');
}
