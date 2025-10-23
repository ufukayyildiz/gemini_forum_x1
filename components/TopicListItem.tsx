
import React from 'react';
import type { Topic } from '../types';
import Avatar from './Avatar';
import { formatRelativeTime } from '../utils/formatters';

interface TopicListItemProps {
  topic: Topic;
  onSelectTopic: (topic: Topic) => void;
  onUserClick: (userId: string) => void;
  showCategory?: boolean;
}

const TopicListItem: React.FC<TopicListItemProps> = ({ topic, onSelectTopic, onUserClick, showCategory = false }) => {
  
  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent topic navigation
    onUserClick(topic.author.id);
  };

  return (
    <tr 
      onClick={() => onSelectTopic(topic)} 
      className="hover:bg-background cursor-pointer transition-colors"
    >
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="font-semibold text-on-surface hover:text-primary">{topic.title}</span>
          <div className="flex items-center space-x-2 text-xs text-on-surface-secondary mt-1">
             <button onClick={handleUserClick} className="flex items-center space-x-2 hover:underline">
               <Avatar user={topic.author} size="xs" />
               <span>{topic.author.username}</span>
            </button>
          </div>
        </div>
      </td>
      {showCategory && (
        <td className="px-6 py-4 hidden md:table-cell">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: `#${topic.category.color}` }}></span>
            <span className="text-on-surface-secondary">{topic.category.name}</span>
          </div>
        </td>
      )}
       {!showCategory && <td className="px-6 py-4 hidden md:table-cell"></td>}
      <td className="px-6 py-4 text-center font-medium">{topic.replyCount}</td>
      <td className="px-6 py-4 text-center text-on-surface-secondary hidden sm:table-cell">{topic.viewCount}</td>
      <td className="px-6 py-4 text-on-surface-secondary whitespace-nowrap hidden md:table-cell">
        {formatRelativeTime(topic.lastPostedAt)}
      </td>
    </tr>
  );
};

export default TopicListItem;
