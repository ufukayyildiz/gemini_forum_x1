
import React, { useState, useEffect, useRef } from 'react';
import type { Category, User } from '../types';
import { fetchCategories } from '../services/api';
import { Icon } from './Icon';

interface HeaderProps {
  currentUser: User | null;
  onLogoClick: () => void;
  onSelectCategory: (category: Category) => void;
  onLoginClick: () => void;
  onLogout: () => void;
  onProfileClick: (userId: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogoClick, onSelectCategory, onLoginClick, onLogout, onProfileClick }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  return (
    <header className="bg-surface border-b border-border sticky top-0 z-20 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <button onClick={onLogoClick} className="flex items-center space-x-2 text-primary">
              <Icon name="forum" className="w-8 h-8" />
              <span className="font-bold text-xl text-on-surface">Forum</span>
            </button>
            <nav className="hidden md:flex items-center space-x-4">
              {categories.map(cat => (
                 <button 
                    key={cat.id} 
                    onClick={() => onSelectCategory(cat)}
                    className="flex items-center space-x-2 text-on-surface-secondary hover:text-on-surface transition-colors"
                 >
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: `#${cat.color}` }}></span>
                    <span>{cat.name}</span>
                 </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <input 
                type="text" 
                placeholder="Search..."
                className="bg-background border border-border rounded-full py-1.5 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-40 md:w-64 transition-all"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-secondary">
                 <Icon name="search" className="w-5 h-5" />
              </div>
            </div>
            {currentUser ? (
              <div className="relative" ref={menuRef}>
                <button onClick={() => setProfileMenuOpen(prev => !prev)}>
                   <img 
                    src={currentUser.avatarUrl} 
                    alt="User Avatar"
                    className="w-9 h-9 rounded-full cursor-pointer ring-2 ring-transparent hover:ring-primary transition"
                  />
                </button>
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-surface rounded-md shadow-lg py-1 border border-border z-30">
                    <button 
                      onClick={() => { onProfileClick(currentUser.id); setProfileMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-background flex items-center space-x-2"
                    >
                      <Icon name="user" className="w-4 h-4" />
                      <span>Profile</span>
                    </button>
                    <button 
                      onClick={() => { onLogout(); setProfileMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-background flex items-center space-x-2"
                    >
                       <Icon name="logout" className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
               <button 
                  onClick={onLoginClick}
                  className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
               >
                Log In
               </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
