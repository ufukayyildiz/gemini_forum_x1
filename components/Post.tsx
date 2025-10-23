
import React from 'react';
import type { Post as PostType } from '../types';
import Avatar from './Avatar';
import { formatRelativeTime } from '../utils/formatters';
import { Icon } from './Icon';

interface PostProps {
  post: PostType;
  onUserClick: (userId: string) => void;
}

const PostComponent: React.FC<PostProps> = ({ post, onUserClick }) => {
  return (
    <div className="flex space-x-4">
      <div className="flex-shrink-0">
        <button onClick={() => onUserClick(post.author.id)}>
            <Avatar user={post.author} size="lg" />
        </button>
      </div>
      <div className="flex-grow bg-surface rounded-lg shadow-md border border-border">
        <header className="px-5 py-3 border-b border-border flex justify-between items-center">
          <button onClick={() => onUserClick(post.author.id)} className="font-semibold hover:underline">{post.author.username}</button>
          <div className="text-sm text-on-surface-secondary">{formatRelativeTime(post.createdAt)}</div>
        </header>
        <div className="p-5 text-on-surface prose max-w-none">
          {/* A simple markdown renderer - in a real app, use a library like 'marked' or 'react-markdown' */}
          {post.content.split('\n').map((line, index) => {
            if (line.startsWith('`') && line.endsWith('`')) {
              return <pre key={index} className="bg-background p-2 rounded text-sm whitespace-pre-wrap font-mono">{line.slice(1, -1)}</pre>;
            }
             if (line.trim() === '') return null;
            return <p key={index} className="mb-4">{line}</p>;
          })}
        </div>
        <footer className="px-5 py-3 flex justify-end items-center space-x-4">
          <button className="flex items-center space-x-1 text-on-surface-secondary hover:text-red-500 transition-colors">
            <Icon name="heart" className="w-5 h-5"/>
            <span>{post.likes}</span>
          </button>
           <button className="flex items-center space-x-1 text-on-surface-secondary hover:text-primary transition-colors">
            <Icon name="reply" className="w-5 h-5"/>
            <span>Reply</span>
          </button>
        </footer>
      </div>
    </div>
  );
};

export default PostComponent;
