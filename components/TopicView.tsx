
import React, { useState, useEffect, useCallback } from 'react';
import { fetchPostsForTopic, createPost } from '../services/api';
import type { Topic, Post, User } from '../types';
import PostComponent from './Post';
import PostEditor from './PostEditor';
import Spinner from './Spinner';
import { Icon } from './Icon';

interface TopicViewProps {
  topic: Topic;
  currentUser: User | null;
  onBack: () => void;
  onUserClick: (userId: string) => void;
  onLoginClick: () => void;
}

const TopicView: React.FC<TopicViewProps> = ({ topic, currentUser, onBack, onUserClick, onLoginClick }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = useCallback(() => {
    setLoading(true);
    fetchPostsForTopic(topic.id)
      .then(setPosts)
      .finally(() => setLoading(false));
  }, [topic.id]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleCreatePost = async (content: string) => {
    if (!currentUser) return;
    await createPost(topic.id, content, currentUser);
    loadPosts(); // Reload posts to show the new one
  };

  return (
    <div>
       <div className="flex items-center mb-4">
        <button onClick={onBack} className="text-on-surface-secondary hover:text-primary transition-colors flex items-center space-x-2">
            <Icon name="arrowLeft" className="w-5 h-5" />
            <span>Back</span>
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-grow">
          <header className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{topic.title}</h1>
            <div className="flex items-center space-x-2">
              <span className="w-4 h-4 rounded" style={{ backgroundColor: `#${topic.category.color}` }}></span>
              <span className="text-on-surface-secondary">{topic.category.name}</span>
            </div>
          </header>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner />
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map(post => (
                <PostComponent key={post.id} post={post} onUserClick={onUserClick} />
              ))}
            </div>
          )}

          <div className="mt-8">
            <PostEditor currentUser={currentUser} onSubmit={handleCreatePost} onLoginClick={onLoginClick} />
          </div>
        </div>
        <aside className="w-full md:w-64 lg:w-72 flex-shrink-0">
          <div className="sticky top-24 space-y-4">
              <div className="bg-surface rounded-lg shadow-md p-4">
                  <h3 className="font-bold mb-2">Topic Stats</h3>
                  <div className="text-sm space-y-2">
                     <div className="flex justify-between"><span>Replies:</span> <strong>{topic.replyCount}</strong></div>
                     <div className="flex justify-between"><span>Views:</span> <strong>{topic.viewCount}</strong></div>
                     <div className="flex justify-between"><span>Users:</span> <strong>{new Set(posts.map(p => p.author.id)).size}</strong></div>
                     <div className="flex justify-between"><span>Likes:</span> <strong>{posts.reduce((sum, p) => sum + p.likes, 0)}</strong></div>
                  </div>
              </div>
              <button className="w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2">
                  <Icon name="reply" className="w-5 h-5"/>
                  <span>Reply</span>
              </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default TopicView;
