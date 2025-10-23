
import React, { useState } from 'react';
import { Icon } from './Icon';
import type { User } from '../types';

interface PostEditorProps {
  currentUser: User | null;
  onSubmit: (content: string) => Promise<void>;
  onLoginClick: () => void;
}

const PostEditor: React.FC<PostEditorProps> = ({ currentUser, onSubmit, onLoginClick }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting || !currentUser) return;

    setIsSubmitting(true);
    try {
      await onSubmit(content);
      setContent('');
    } catch (error) {
      console.error("Failed to submit post:", error);
      // Here you would show an error to the user
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) {
    return (
        <div className="bg-surface rounded-lg shadow-md border border-border p-6 text-center">
            <p className="text-on-surface-secondary mb-4">You must be logged in to reply.</p>
            <button
                onClick={onLoginClick}
                className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors"
            >
                Log In
            </button>
        </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface rounded-lg shadow-md border border-border">
      <div className="p-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type your reply here..."
          className="w-full h-32 p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
          disabled={isSubmitting}
        />
      </div>
      <div className="flex justify-between items-center px-4 py-3 bg-background rounded-b-lg border-t border-border">
        <div className="flex items-center space-x-2 text-on-surface-secondary">
          {/* Add markdown toolbar buttons here */}
          <button type="button" className="p-2 hover:bg-gray-200 rounded"><Icon name="bold" className="w-5 h-5" /></button>
          <button type="button" className="p-2 hover:bg-gray-200 rounded"><Icon name="italic" className="w-5 h-5" /></button>
          <button type="button" className="p-2 hover:bg-gray-200 rounded"><Icon name="link" className="w-5 h-5" /></button>
        </div>
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-secondary disabled:cursor-not-allowed flex items-center"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Posting...
            </>
          ) : 'Reply'}
        </button>
      </div>
    </form>
  );
};

export default PostEditor;
