
import React from 'react';
import type { User } from '../types';
import Avatar from './Avatar';

interface HeaderProps {
  currentUser: User | null;
  onLoginClick: () => void;
  onLogout: () => void;
  onHomeClick: () => void;
  onAdminClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLoginClick, onLogout, onHomeClick, onAdminClick }) => {
  return (
    <header className="bg-surface shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <button onClick={onHomeClick} className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
          Gemini Forum
        </button>
        <div className="flex items-center space-x-4">
          {currentUser ? (
            <>
              {currentUser.isAdmin && (
                <button
                  onClick={onAdminClick}
                  className="px-4 py-2 text-sm font-semibold rounded-md hover:bg-background transition-colors"
                >
                  Admin
                </button>
              )}
              <div className="flex items-center space-x-2">
                <Avatar user={currentUser} size="sm" />
                <span className="font-semibold hidden sm:inline">{currentUser.username}</span>
              </div>
              <button
                onClick={onLogout}
                className="px-4 py-2 text-sm font-semibold bg-secondary text-on-surface rounded-md hover:bg-red-500 hover:text-white transition-colors"
              >
                Log Out
              </button>
            </>
          ) : (
            <button
              onClick={onLoginClick}
              className="px-4 py-2 text-sm font-bold bg-primary text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Log In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
