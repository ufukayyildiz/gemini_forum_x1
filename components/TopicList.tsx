// Fix: Restoring the component's content to fix parsing errors caused by a corrupted file.
import React, { useState, useEffect } from 'react';
import { fetchTopics } from '../services/api';
import type { Category, Topic } from '../types';
import TopicListItem from './TopicListItem';
import Spinner from './Spinner';

interface TopicListProps {
  category?: Category | null;
  onSelectTopic: (topic: Topic) => void;
  onUserClick: (userId: string) => void;
}

const TopicList: React.FC<TopicListProps> = ({ category, onSelectTopic, onUserClick }) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchTopics(category?.id)
      .then(setTopics)
      .finally(() => setLoading(false));
  }, [category]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-lg shadow-md overflow-hidden">
      <header className="px-6 py-4 border-b border-border">
         <h1 className="text-xl font-bold">
            {category ? `Topics in ${category.name}` : 'All Topics'}
         </h1>
         {category && <p className="text-on-surface-secondary mt-1">{category.description}</p>}
      </header>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-on-surface-secondary uppercase tracking-wider bg-background border-b border-border">
            <tr>
              <th className="py-3 px-6 font-semibold">Topic</th>
              <th className="py-3 px-6 font-semibold hidden md:table-cell">Category</th>
              <th className="py-3 px-6 font-semibold text-center">Replies</th>
              <th className="py-3 px-6 font-semibold text-center hidden sm:table-cell">Views</th>
              <th className="py-3 px-6 font-semibold hidden md:table-cell">Activity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {topics.map(topic => (
              <TopicListItem key={topic.id} topic={topic} onSelectTopic={onSelectTopic} showCategory={!category} onUserClick={onUserClick}/>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopicList;
