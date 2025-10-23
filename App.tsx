
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TopicList from './components/TopicList';
import TopicView from './components/TopicView';
import LoginPage from './components/LoginPage';
import ProfilePage from './components/ProfilePage';
import AdminDashboard from './components/AdminDashboard';
import { fetchCategories, fetchTopics, fetchPosts } from './services/api';
import type { Category, Topic, User, Post as PostType } from './types';
import Spinner from './components/Spinner';

type View = 'home' | 'topic' | 'profile' | 'login' | 'admin';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allTopics, setAllTopics] = useState<Topic[]>([]);
  const [allPosts, setAllPosts] = useState<PostType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [cats, topics, posts] = await Promise.all([
          fetchCategories(),
          fetchTopics(),
          fetchPosts(),
        ]);
        setCategories(cats);
        setAllTopics(topics);
        setAllPosts(posts);
      } catch (error) {
        console.error("Failed to load initial data", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);
  
  const handleSelectCategory = (category: Category | null) => {
    setSelectedCategory(category);
    setView('home');
    setSelectedTopic(null);
    setSelectedUserId(null);
  };

  const handleSelectTopic = (topic: Topic) => {
    setSelectedTopic(topic);
    setView('topic');
  };
  
  const handleUserClick = (userId: string) => {
    setSelectedUserId(userId);
    setView('profile');
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setView('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('home');
  };

  const navigateTo = (newView: View) => {
    setSelectedTopic(null);
    setSelectedUserId(null);
    setSelectedCategory(null);
    setView(newView);
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-96"><Spinner /></div>;
    }

    switch (view) {
      case 'topic':
        return selectedTopic && <TopicView topic={selectedTopic} currentUser={currentUser} onBack={() => navigateTo('home')} onUserClick={handleUserClick} onLoginClick={() => setView('login')} />;
      case 'profile':
        return selectedUserId && <ProfilePage userId={selectedUserId} onSelectTopic={handleSelectTopic} onUserClick={handleUserClick} />;
      case 'login':
        return <LoginPage onLogin={handleLogin} />;
      case 'admin':
        return currentUser?.isAdmin ? <AdminDashboard categories={categories} topics={allTopics} posts={allPosts} /> : <p>You do not have access to this page.</p>;
      case 'home':
      default:
        return <TopicList category={selectedCategory} onSelectTopic={handleSelectTopic} onUserClick={handleUserClick} />;
    }
  };

  return (
    <div className="bg-background text-on-surface min-h-screen">
      <Header 
        currentUser={currentUser}
        onLoginClick={() => setView('login')}
        onLogout={handleLogout}
        onHomeClick={() => navigateTo('home')}
        onAdminClick={() => navigateTo('admin')}
      />
      <main className="container mx-auto p-4 md:p-6">
        <div className="flex gap-6">
            <aside className="w-64 hidden md:block flex-shrink-0">
                <nav className="sticky top-24">
                    <h2 className="text-sm font-bold uppercase text-on-surface-secondary px-4 mb-2">Categories</h2>
                    <ul>
                        <li>
                            <button onClick={() => handleSelectCategory(null)} className={`w-full text-left px-4 py-2 rounded-md font-semibold ${!selectedCategory ? 'bg-primary-container text-on-primary-container' : 'hover:bg-background'}`}>
                                All Topics
                            </button>
                        </li>
                        {categories.map(cat => (
                            <li key={cat.id}>
                                <button onClick={() => handleSelectCategory(cat)} className={`w-full text-left px-4 py-2 rounded-md font-semibold flex items-center space-x-2 ${selectedCategory?.id === cat.id ? 'bg-primary-container text-on-primary-container' : 'hover:bg-background'}`}>
                                    <span className="w-3 h-3 rounded-full" style={{backgroundColor: `#${cat.color}`}}></span>
                                    <span>{cat.name}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
            <div className="flex-grow">
              {renderContent()}
            </div>
        </div>
      </main>
    </div>
  );
}

export default App;
