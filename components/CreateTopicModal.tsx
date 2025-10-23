import React, { useState } from 'react';
import type { User, Category } from '../types';
import Spinner from './Spinner';

interface CreateTopicModalProps {
  currentUser: User;
  categories: Category[];
  onClose: () => void;
  onSubmit: (title: string, content: string, categoryId: string) => Promise<void>;
}

const CreateTopicModal: React.FC<CreateTopicModalProps> = ({ currentUser, categories, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !categoryId || isSubmitting) {
      setError("Please fill out all fields.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit(title, content, categoryId);
      onClose();
    } catch (err) {
      console.error("Failed to create topic:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-20 flex justify-center items-center" onClick={onClose}>
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-2xl m-4" onClick={e => e.stopPropagation()}>
        <header className="px-6 py-4 border-b border-border">
          <h2 className="text-xl font-bold">Create New Topic</h2>
        </header>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="topic-title" className="block text-sm font-bold mb-1">Topic Title</label>
              <input
                id="topic-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's the discussion about?"
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label htmlFor="topic-category" className="block text-sm font-bold mb-1">Category</label>
              <select
                id="topic-category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                required
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="topic-content" className="block text-sm font-bold mb-1">First Post</label>
              <textarea
                id="topic-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start the conversation..."
                className="w-full h-40 p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <footer className="px-6 py-4 bg-background rounded-b-lg border-t border-border flex justify-end items-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-secondary disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? <Spinner /> : 'Create Topic'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default CreateTopicModal;
