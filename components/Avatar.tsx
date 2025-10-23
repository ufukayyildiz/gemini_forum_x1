
import React from 'react';
import type { User } from '../types';

interface AvatarProps {
  user: User;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const sizeMap = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

const Avatar: React.FC<AvatarProps> = ({ user, size = 'md' }) => {
  const sizeClasses = sizeMap[size];
  return (
    <img
      src={user.avatarUrl}
      alt={`${user.username}'s avatar`}
      className={`${sizeClasses} rounded-full object-cover`}
    />
  );
};

export default Avatar;
