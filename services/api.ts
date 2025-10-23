
import type { Category, Post, Topic, User } from '../types';

const generateRandomId = () => Math.floor(100000 + Math.random() * 900000).toString();

// MOCK DATA - This simulates a PostgreSQL database.
const users: User[] = [
  { id: generateRandomId(), username: 'react_guru', name: 'Alice', avatarUrl: 'https://i.pravatar.cc/150?u=1', joinedAt: '2023-01-15T10:00:00Z' },
  { id: generateRandomId(), username: 'tailwind_fan', name: 'Bob', avatarUrl: 'https://i.pravatar.cc/150?u=2', joinedAt: '2023-02-20T11:30:00Z' },
  { id: generateRandomId(), username: 'ts_master', name: 'Charlie', avatarUrl: 'https://i.pravatar.cc/150?u=3', joinedAt: '2023-03-05T14:00:00Z' },
  { id: generateRandomId(), username: 'ux_designer', name: 'Diana', avatarUrl: 'https://i.pravatar.cc/150?u=4', joinedAt: '2023-04-10T18:45:00Z' },
];

const categories: Category[] = [
  { id: 1, name: 'React', slug: 'react', color: '61DAFB', description: 'Discussions about the React library.' },
  { id: 2, name: 'Tailwind CSS', slug: 'tailwind-css', color: '38B2AC', description: 'Styling with Tailwind CSS.' },
  { id: 3, name: 'General', slug: 'general', color: 'F6E05E', description: 'Off-topic and general chat.' },
  { id: 4, name: 'TypeScript', slug: 'typescript', color: '3178C6', description: 'All about TypeScript.' },
];

const topics: Topic[] = [
  {
    id: 1,
    title: 'Getting Started with React Hooks',
    author: users[0],
    category: categories[0],
    createdAt: '2023-10-26T10:00:00Z',
    lastPostedAt: '2023-10-27T12:30:00Z',
    replyCount: 5,
    viewCount: 152,
    posts: [
      { id: 1, author: users[0], content: 'Hey everyone, I\'m new to React Hooks. What are the best resources to get started? I\'ve read the official docs, but looking for more practical examples.\n\n`useEffect` is a bit confusing!', createdAt: '2023-10-26T10:00:00Z', likes: 12, replyToPostNumber: null, postNumber: 1 },
    ],
  },
  {
    id: 2,
    title: 'Best Practices for Tailwind CSS in Large Projects',
    author: users[1],
    category: categories[1],
    createdAt: '2023-10-25T14:20:00Z',
    lastPostedAt: '2023-10-27T09:15:00Z',
    replyCount: 8,
    viewCount: 230,
    posts: [
       { id: 6, author: users[1], content: 'How do you organize your Tailwind classes in a large-scale application? Using `@apply` in CSS files? Or utility classes directly in the HTML?', createdAt: '2023-10-25T14:20:00Z', likes: 25, replyToPostNumber: null, postNumber: 1 },
    ]
  },
  {
    id: 3,
    title: 'Favorite TypeScript Utility Types?',
    author: users[2],
    category: categories[3],
    createdAt: '2023-10-27T11:00:00Z',
    lastPostedAt: '2023-10-27T11:00:00Z',
    replyCount: 0,
    viewCount: 45,
    posts: [
      { id: 11, author: users[2], content: 'What are some of your most-used utility types in TypeScript? I\'m a big fan of `Pick` and `Omit`.', createdAt: '2023-10-27T11:00:00Z', likes: 8, replyToPostNumber: null, postNumber: 1 },
    ]
  },
    {
    id: 4,
    title: 'Weekend Plans Discussion',
    author: users[3],
    category: categories[2],
    createdAt: '2023-10-24T18:00:00Z',
    lastPostedAt: '2023-10-26T19:45:00Z',
    replyCount: 12,
    viewCount: 450,
    posts: [
       { id: 12, author: users[3], content: 'It\'s almost the weekend! Anyone have exciting plans?', createdAt: '2023-10-24T18:00:00Z', likes: 3, replyToPostNumber: null, postNumber: 1 },
    ]
  },
   {
    id: 5,
    title: 'Custom Hooks for everything!',
    author: users[0],
    category: categories[0],
    createdAt: '2023-10-28T09:00:00Z',
    lastPostedAt: '2023-10-28T09:00:00Z',
    replyCount: 0,
    viewCount: 25,
    posts: [
      { id: 14, author: users[0], content: 'I\'ve started abstracting almost all my component logic into custom hooks. It\'s making my components so much cleaner!', createdAt: '2023-10-28T09:00:00Z', likes: 15, replyToPostNumber: null, postNumber: 1 },
    ],
  },
];

const posts: { [topicId: number]: Post[] } = {
  1: [
    { id: 1, author: users[0], content: 'Hey everyone, I\'m new to React Hooks. What are the best resources to get started? I\'ve read the official docs, but looking for more practical examples.\n\n`useEffect` is a bit confusing!', createdAt: '2023-10-26T10:00:00Z', likes: 12, replyToPostNumber: null, postNumber: 1 },
    { id: 2, author: users[2], content: 'I highly recommend Kent C. Dodds\' blog. He has some amazing deep dives into hooks.', createdAt: '2023-10-26T10:15:00Z', likes: 8, replyToPostNumber: 1, postNumber: 2 },
    { id: 3, author: users[1], content: 'For `useEffect`, the key is to understand the dependency array. An empty array `[]` means it runs only once on mount. If you pass variables, it re-runs when they change.', createdAt: '2023-10-26T11:00:00Z', likes: 15, replyToPostNumber: 1, postNumber: 3 },
    { id: 4, author: users[0], content: '@ts_master Thanks for the tip! I\'ll check it out. @tailwind_fan That makes sense, I think I was missing that part.', createdAt: '2023-10-26T11:30:00Z', likes: 2, replyToPostNumber: 3, postNumber: 4 },
    { id: 5, author: users[3], content: 'Don\'t forget custom hooks! They are a superpower for reusing logic.', createdAt: '2023-10-27T12:30:00Z', likes: 7, replyToPostNumber: 1, postNumber: 5 },
  ],
  2: [
    { id: 6, author: users[1], content: 'How do you organize your Tailwind classes in a large-scale application? Using `@apply` in CSS files? Or utility classes directly in the HTML?', createdAt: '2023-10-25T14:20:00Z', likes: 25, replyToPostNumber: null, postNumber: 1 },
    { id: 7, author: users[0], content: 'We stick to utility classes directly in JSX. It feels weird at first but becomes very productive. We use component libraries like Headless UI to encapsulate complex components.', createdAt: '2023-10-25T15:00:00Z', likes: 10, replyToPostNumber: 1, postNumber: 2 },
    { id: 8, author: users[3], content: 'I agree. We found `@apply` can lead to the same issues as custom CSS, where you have to jump between files. Keeping styles co-located with the markup is a big win.', createdAt: '2023-10-25T16:00:00Z', likes: 12, replyToPostNumber: 1, postNumber: 3 },
     { id: 9, author: users[2], content: 'There is a `prettier-plugin-tailwindcss` that automatically sorts your classes. It\'s a life-saver for keeping things clean!', createdAt: '2023-10-26T09:15:00Z', likes: 18, replyToPostNumber: 1, postNumber: 4 },
  ],
  3: [
      { id: 11, author: users[2], content: 'What are some of your most-used utility types in TypeScript? I\'m a big fan of `Pick` and `Omit`.', createdAt: '2023-10-27T11:00:00Z', likes: 8, replyToPostNumber: null, postNumber: 1 },
  ],
  4: [
       { id: 12, author: users[3], content: 'It\'s almost the weekend! Anyone have exciting plans?', createdAt: '2023-10-24T18:00:00Z', likes: 3, replyToPostNumber: null, postNumber: 1 },
       { id: 13, author: users[0], content: 'Going for a hike on Saturday!', createdAt: '2023-10-25T09:00:00Z', likes: 5, replyToPostNumber: 1, postNumber: 2 },
  ],
  5: [
      { id: 14, author: users[0], content: 'I\'ve started abstracting almost all my component logic into custom hooks. It\'s making my components so much cleaner!', createdAt: '2023-10-28T09:00:00Z', likes: 15, replyToPostNumber: null, postNumber: 1 },
  ]
};

const simulateDelay = <T,>(data: T, delay = 500): Promise<T> =>
  new Promise(resolve => setTimeout(() => resolve(data), delay));

export const login = (username: string): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
            if (user) {
                resolve(user);
            } else {
                reject(new Error('User not found'));
            }
        }, 500);
    });
};

export const fetchCategories = (): Promise<Category[]> => {
  return simulateDelay(categories);
};

export const fetchTopics = (categoryId?: number): Promise<Topic[]> => {
  const sortedTopics = [...topics].sort((a, b) => new Date(b.lastPostedAt).getTime() - new Date(a.lastPostedAt).getTime());
  if (categoryId) {
    const filteredTopics = sortedTopics.filter(t => t.category.id === categoryId);
    return simulateDelay(filteredTopics);
  }
  return simulateDelay(sortedTopics);
};

export const fetchTopicById = (topicId: number): Promise<Topic | undefined> => {
  const topic = topics.find(t => t.id === topicId);
  return simulateDelay(topic);
};

export const fetchPostsForTopic = (topicId: number): Promise<Post[]> => {
  return simulateDelay(posts[topicId] || []);
};

export const fetchUserById = (userId: string): Promise<User | undefined> => {
    return simulateDelay(users.find(u => u.id === userId));
};

export const fetchTopicsByUser = (userId: string): Promise<Topic[]> => {
    return simulateDelay(topics.filter(t => t.author.id === userId));
};

export const fetchPostsByUser = (userId: string): Promise<Post[]> => {
    const userPosts: Post[] = [];
    for (const topicId in posts) {
        const topic = topics.find(t => t.id === parseInt(topicId));
        if (topic) {
            posts[topicId].forEach(post => {
                if (post.author.id === userId) {
                    userPosts.push({ ...post, topicTitle: topic.title, topicId: topic.id });
                }
            });
        }
    }
    return simulateDelay(userPosts.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
};


export const createPost = (topicId: number, content: string, author: User): Promise<Post> => {
    const topic = topics.find(t => t.id === topicId);
    
    if (!topic || !author) {
        return Promise.reject('Topic or author not found');
    }

    const topicPosts = posts[topicId] || [];
    const newPost: Post = {
        id: Math.random(), // In a real DB this would be auto-incrementing
        author,
        content,
        createdAt: new Date().toISOString(),
        likes: 0,
        replyToPostNumber: null,
        postNumber: topicPosts.length + 1,
    };

    if (!posts[topicId]) {
      posts[topicId] = [];
    }

    posts[topicId].push(newPost);
    topic.replyCount += 1;
    topic.lastPostedAt = newPost.createdAt;

    return simulateDelay(newPost);
};
