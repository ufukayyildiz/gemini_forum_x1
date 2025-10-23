
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import TopicList from './components/TopicList';
import TopicView from './components/TopicView';
import LoginPage from './components/LoginPage';
import ProfilePage from './components/ProfilePage';
import type { Category, Topic, User } from './types';

type View = 'home' | 'category' | 'topic' | 'login' | 'profile';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);
  const [currentProfileId, setCurrentProfileId] = useState<string | null>(null);

  const handleLogin = useCallback((user: User) => {
    setCurrentUser(user);
    setView('home');
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setView('home');
  }, []);

  const handleSelectTopic = useCallback((topic: Topic) => {
    setCurrentTopic(topic);
    setView('topic');
  }, []);
  
  const handleSelectCategory = useCallback((category: Category) => {
    setCurrentCategory(category);
    setCurrentTopic(null);
    setView('category');
  }, []);
  
  const navigateToLogin = useCallback(() => setView('login'), []);
  
  const navigateToProfile = useCallback((userId: string) => {
    setCurrentProfileId(userId);
    setView('profile');
  }, []);

  const navigateHome = useCallback(() => {
    setCurrentCategory(null);
    setCurrentTopic(null);
    setView('home');
  }, []);
  
  const handleBack = useCallback(() => {
      if (currentTopic) {
          setCurrentTopic(null);
          // If we were in a category view before, go back to it
          if (currentCategory) {
              setView('category');
          } else {
              setView('home');
          }
      } else if (currentCategory) {
          setCurrentCategory(null);
          setView('home');
      } else {
          navigateHome();
      }
  }, [currentTopic, currentCategory, navigateHome]);


  const renderContent = () => {
    switch (view) {
      case 'login':
        return <LoginPage onLogin={handleLogin} />;
      case 'profile':
        return currentProfileId ? <ProfilePage userId={currentProfileId} onSelectTopic={handleSelectTopic} onUserClick={navigateToProfile}/> : <TopicList onSelectTopic={handleSelectTopic} onUserClick={navigateToProfile} />;
      case 'topic':
        return currentTopic ? <TopicView topic={currentTopic} currentUser={currentUser} onBack={handleBack} onUserClick={navigateToProfile} onLoginClick={navigateToLogin}/> : <TopicList onSelectTopic={handleSelectTopic} onUserClick={navigateToProfile} />;
      case 'category':
        return <TopicList onSelectTopic={handleSelectTopic} category={currentCategory} onUserClick={navigateToProfile} />;
      case 'home':
      default:
        return <TopicList onSelectTopic={handleSelectTopic} onUserClick={navigateToProfile} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        currentUser={currentUser}
        onLogoClick={navigateHome} 
        onSelectCategory={handleSelectCategory}
        onLoginClick={navigateToLogin}
        onLogout={handleLogout}
        onProfileClick={navigateToProfile}
      />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
