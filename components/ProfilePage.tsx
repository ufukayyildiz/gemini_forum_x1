
import React, { useState, useEffect } from 'react';
import { fetchUserById, fetchTopicsByUser, fetchPostsByUser } from '../services/api';
import type { User, Topic, Post } from '../types';
import Spinner from './Spinner';
import Avatar from './Avatar';
import { formatRelativeTime } from '../utils/formatters';

interface ProfilePageProps {
  userId: string;
  onSelectTopic: (topic: Topic) => void;
  onUserClick: (userId: string) => void;
}

type ActiveTab = 'topics' | 'replies';

const ProfilePage: React.FC<ProfilePageProps> = ({ userId, onSelectTopic }) => {
  const [user, setUser] = useState<User | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('topics');

  useEffect(() => {
    const loadProfileData = async () => {
      setLoading(true);
      try {
        const [userData, userTopics, userPosts] = await Promise.all([
          fetchUserById(userId),
          fetchTopicsByUser(userId),
          fetchPostsByUser(userId),
        ]);
        setUser(userData || null);
        setTopics(userTopics);
        setPosts(userPosts);
      } catch (error) {
        console.error("Failed to load profile data", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadProfileData();
  }, [userId]);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Spinner /></div>;
  }

  if (!user) {
    return <div className="text-center text-on-surface-secondary">User not found.</div>;
  }

  const formattedJoinedDate = new Date(user.joinedAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="max-w-4xl mx-auto">
      <header className="bg-surface rounded-lg shadow-md p-6 mb-8 flex items-center space-x-6">
        <Avatar user={user} size="lg" />
        <div>
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <h2 className="text-xl text-on-surface-secondary">u/{user.id} ({user.username})</h2>
          <p className="text-sm text-on-surface-secondary mt-2">Joined on {formattedJoinedDate}</p>
        </div>
      </header>
      
      <div className="bg-surface rounded-lg shadow-md">
        <div className="border-b border-border">
          <nav className="flex space-x-4 px-6">
             <TabButton name="Topics" count={topics.length} isActive={activeTab === 'topics'} onClick={() => setActiveTab('topics')} />
             <TabButton name="Replies" count={posts.length} isActive={activeTab === 'replies'} onClick={() => setActiveTab('replies')} />
          </nav>
        </div>
        <div className="p-6">
          {activeTab === 'topics' && <UserTopics topics={topics} onSelectTopic={onSelectTopic} />}
          {activeTab === 'replies' && <UserReplies posts={posts} onSelectTopic={onSelectTopic} />}
        </div>
      </div>
    </div>
  );
};

interface TabButtonProps {
    name: string;
    count: number;
    isActive: boolean;
    onClick: () => void;
}
const TabButton: React.FC<TabButtonProps> = ({ name, count, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`py-4 px-1 border-b-2 font-semibold transition-colors ${
        isActive
            ? 'border-primary text-primary'
            : 'border-transparent text-on-surface-secondary hover:border-gray-300 hover:text-on-surface'
        }`}
    >
        {name} <span className="text-xs bg-background rounded-full px-2 py-0.5">{count}</span>
    </button>
);

const UserTopics: React.FC<{ topics: Topic[], onSelectTopic: (topic: Topic) => void }> = ({ topics, onSelectTopic }) => {
    if (topics.length === 0) return <p className="text-on-surface-secondary">This user hasn't created any topics yet.</p>;
    return (
        <ul className="space-y-4">
            {topics.map(topic => (
                <li key={topic.id} onClick={() => onSelectTopic(topic)} className="p-4 rounded-lg hover:bg-background cursor-pointer border border-border">
                    <div className="flex justify-between items-center">
                        <div>
                            <span className="font-semibold text-on-surface hover:text-primary">{topic.title}</span>
                             <div className="flex items-center space-x-2 text-sm mt-1">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: `#${topic.category.color}` }}></span>
                                <span className="text-on-surface-secondary">{topic.category.name}</span>
                            </div>
                        </div>
                        <div className="text-right text-sm text-on-surface-secondary">
                            <div>{topic.replyCount} replies</div>
                            <div>{formatRelativeTime(topic.lastPostedAt)}</div>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
};

const UserReplies: React.FC<{ posts: Post[], onSelectTopic: (topic: Topic) => void }> = ({ posts, onSelectTopic }) => {
    if (posts.length === 0) return <p className="text-on-surface-secondary">This user hasn't replied to any topics yet.</p>;
    return (
        <ul className="space-y-4">
            {posts.map(post => (
                <li key={post.id} onClick={() => onSelectTopic({id: post.topicId} as Topic)} className="p-4 rounded-lg hover:bg-background cursor-pointer border border-border">
                    <div className="text-sm text-on-surface-secondary mb-2">
                        Replied in <span className="font-semibold text-on-surface hover:text-primary">{post.topicTitle}</span>
                        <span className="ml-2">{formatRelativeTime(post.createdAt)}</span>
                    </div>
                    <p className="text-on-surface italic border-l-4 border-border pl-4">
                        "{post.content.length > 150 ? `${post.content.substring(0, 150)}...` : post.content}"
                    </p>
                </li>
            ))}
        </ul>
    );
};


export default ProfilePage;
