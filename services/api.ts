import { User, Category, Topic, Post } from '../types';

// --- MOCK DATABASE ---
let db = {
  users: [
    { id: '124562', username: 'react_guru', name: 'Alice', avatarUrl: 'https://i.pravatar.cc/150?u=react_guru', joinedAt: '2023-01-15T10:00:00Z', isAdmin: true },
    { id: '145698', username: 'tailwind_fan', name: 'Bob', avatarUrl: 'https://i.pravatar.cc/150?u=tailwind_fan', joinedAt: '2023-02-20T14:30:00Z', isAdmin: false },
    { id: '789012', username: 'gemini_user', name: 'Charlie', avatarUrl: 'https://i.pravatar.cc/150?u=gemini_user', joinedAt: '2023-03-10T09:00:00Z', isAdmin: false },
  ],
  categories: [
    { id: 'c1', name: 'React', description: 'Discussions about the React library and its ecosystem.', color: '61DAFB' },
    { id: 'c2', name: 'Tailwind CSS', description: 'Everything related to the utility-first CSS framework.', color: '38B2AC' },
    { id: 'c3', name: 'General', description: 'Off-topic conversations.', color: '9CA3AF' },
  ],
  topics: [
    { id: 't1', title: 'React Server Components: A Game Changer?', authorId: '124562', categoryId: 'c1', createdAt: '2023-10-26T10:00:00Z' },
    { id: 't2', title: 'Best Practices for Responsive Design with Tailwind', authorId: '145698', categoryId: 'c2', createdAt: '2023-10-25T15:30:00Z' },
    { id: 't3', title: 'What is everyone working on?', authorId: '789012', categoryId: 'c3', createdAt: '2023-10-24T12:00:00Z' },
  ],
  posts: [
    { id: 'p1', topicId: 't1', authorId: '124562', content: "I've been exploring React Server Components lately and they seem incredibly powerful. The ability to fetch data on the server and render components without shipping JS to the client is amazing for performance. What are your thoughts?", createdAt: '2023-10-26T10:00:00Z', likes: 15 },
    { id: 'p2', topicId: 't1', authorId: '145698', content: "Totally agree! It simplifies data fetching logic a lot. I'm a bit concerned about the learning curve for teams used to the traditional CSR/SPA model though.", createdAt: '2023-10-26T11:20:00Z', likes: 8 },
    { id: 'p3', topicId: 't2', authorId: '145698', content: "Hey everyone, I wanted to start a discussion on Tailwind best practices. I find using `@apply` can get messy. I prefer creating custom components with variants using libraries like CVA. How do you all approach it?", createdAt: '2023-10-25T15:30:00Z', likes: 22 },
    { id: 'p4', topicId: 't3', authorId: '789012', content: "Just kicking off a general thread. I'm currently building a forum application (meta, I know!) with React, TypeScript, and Tailwind. It's been a fun project to learn more about state management.", createdAt: '2023-10-24T12:00:00Z', likes: 10 },
    { id: 'p5', topicId: 't1', authorId: '789012', content: "It feels like a step back towards PHP/Rails-style rendering, but with the component model of React. I'm excited to see how the ecosystem adapts.", createdAt: '2023-10-26T14:00:00Z', likes: 5 },
  ]
};

const SIMULATED_DELAY = 500;

const simulateApi = <T,>(data: T): Promise<T> => {
    return new Promise(resolve => setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), SIMULATED_DELAY));
};

const enrichTopic = (topic: any): Topic => {
    const posts = db.posts.filter(p => p.topicId === topic.id);
    return {
        ...topic,
        author: db.users.find(u => u.id === topic.authorId)!,
        category: db.categories.find(c => c.id === topic.categoryId)!,
        replyCount: posts.length > 0 ? posts.length - 1 : 0,
        viewCount: Math.floor(Math.random() * 2000) + posts.length,
        lastPostedAt: posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]?.createdAt || topic.createdAt,
    };
};

const enrichPost = (post: any): Post => {
    const topic = db.topics.find(t => t.id === post.topicId)!;
    return {
        ...post,
        author: db.users.find(u => u.id === post.authorId)!,
        topicTitle: topic.title,
    };
};

export const fetchAllCategories = (): Promise<Category[]> => simulateApi(db.categories);
export const fetchAllUsers = (): Promise<User[]> => simulateApi(db.users);
export const fetchAllTopics = (): Promise<Topic[]> => simulateApi(db.topics.map(enrichTopic).sort((a,b) => new Date(b.lastPostedAt).getTime() - new Date(a.lastPostedAt).getTime()));
export const fetchAllPosts = (): Promise<Post[]> => simulateApi(db.posts.map(enrichPost));

export const fetchTopics = (categoryId?: string): Promise<Topic[]> => {
  let topics = categoryId ? db.topics.filter(t => t.categoryId === categoryId) : [...db.topics];
  const enrichedTopics = topics.map(enrichTopic);
  return simulateApi(enrichedTopics.sort((a, b) => new Date(b.lastPostedAt).getTime() - new Date(a.lastPostedAt).getTime()));
};

export const fetchPostsForTopic = (topicId: string): Promise<Post[]> => {
  const posts = db.posts.filter(p => p.topicId === topicId);
  const enrichedPosts = posts.map(enrichPost);
  return simulateApi(enrichedPosts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
};

export const createPost = (topicId: string, content: string, author: User): Promise<Post> => {
  const newPost = {
    id: `p${db.posts.length + 1}`,
    topicId,
    authorId: author.id,
    content,
    createdAt: new Date().toISOString(),
    likes: 0,
  };
  db.posts.push(newPost);
  return simulateApi(enrichPost(newPost));
};

export const createTopic = (title: string, content: string, categoryId: string, author: User): Promise<Topic> => {
    const newTopic = {
        id: `t${db.topics.length + 1}`,
        title,
        authorId: author.id,
        categoryId,
        createdAt: new Date().toISOString(),
    };
    db.topics.push(newTopic);
    createPost(newTopic.id, content, author);
    return simulateApi(enrichTopic(newTopic));
}

export const login = (username: string): Promise<User> => {
  const user = db.users.find(u => u.username.toLowerCase() === username.toLowerCase());
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (user) {
        resolve(JSON.parse(JSON.stringify(user)));
      } else {
        reject(new Error("User not found"));
      }
    }, SIMULATED_DELAY);
  });
};

export const fetchUserById = (userId: string): Promise<User | undefined> => {
    return simulateApi(db.users.find(u => u.id === userId));
}

export const fetchTopicsByUser = (userId: string): Promise<Topic[]> => {
    const topics = db.topics.filter(t => t.authorId === userId);
    return simulateApi(topics.map(enrichTopic).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
}

export const fetchPostsByUser = (userId: string): Promise<Post[]> => {
    const posts = db.posts.filter(p => p.authorId === userId && db.topics.find(t => t.id === p.topicId)?.authorId !== userId);
    return simulateApi(posts.map(enrichPost).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
}


// --- ADMIN FUNCTIONS ---
export const adminDeleteUser = (userId: string): Promise<void> => {
    const user = db.users.find(u => u.id === userId);
    if (user?.isAdmin) {
        return Promise.reject(new Error("Cannot delete an admin user."));
    }
    db.users = db.users.filter(u => u.id !== userId);
    // In a real app, you'd handle re-assigning or deleting user content
    return simulateApi(undefined);
}

export const adminToggleAdminStatus = (userId: string): Promise<void> => {
    const user = db.users.find(u => u.id === userId);
    if (!user) {
        return Promise.reject(new Error("User not found."));
    }
    if (user.id === '124562') { // Prevent demoting the main admin
        return Promise.reject(new Error("Cannot change status for the main admin."));
    }
    user.isAdmin = !user.isAdmin;
    return simulateApi(undefined);
}

export const adminDeleteTopic = (topicId: string): Promise<void> => {
    db.topics = db.topics.filter(t => t.id !== topicId);
    db.posts = db.posts.filter(p => p.topicId !== topicId);
    return simulateApi(undefined);
}

export const adminDeleteCategory = (categoryId: string): Promise<void> => {
    const topicsInCategory = db.topics.filter(t => t.categoryId === categoryId);
    if (topicsInCategory.length > 0) {
        return Promise.reject(new Error("Cannot delete category with existing topics. Please reassign or delete them first."));
    }
    db.categories = db.categories.filter(c => c.id !== categoryId);
    return simulateApi(undefined);
}

export const adminCreateCategory = (name: string, description: string, color: string): Promise<Category> => {
    const newCategory: Category = {
        id: `c${db.categories.length + 1 + Math.random()}`,
        name,
        description,
        color: color.replace('#', ''),
    };
    db.categories.push(newCategory);
    return simulateApi(newCategory);
}

export const adminEditCategory = (categoryId: string, data: { name: string; description: string; color: string; }): Promise<Category> => {
    const category = db.categories.find(c => c.id === categoryId);
    if (!category) {
        return Promise.reject(new Error("Category not found."));
    }
    category.name = data.name;
    category.description = data.description;
    category.color = data.color.replace('#', '');
    return simulateApi(category);
}

export const adminCreateTopic = (title: string, content: string, authorId: string, categoryId: string): Promise<Topic> => {
    const author = db.users.find(u => u.id === authorId);
    if (!author) {
        return Promise.reject(new Error("Author not found"));
    }
    const newTopic = {
        id: `t${db.topics.length + 1 + Math.random()}`,
        title,
        authorId,
        categoryId,
        createdAt: new Date().toISOString(),
    };
    db.topics.push(newTopic);
    createPost(newTopic.id, content, author);
    return simulateApi(enrichTopic(newTopic));
};