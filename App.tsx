import React, { useState, useEffect, useCallback } from 'react';
import type { User, Category, Topic, Post } from './types';
import * as api from './services/api';
import Header from './components/Header';
import TopicList from './components/TopicList';
import TopicView from './components/TopicView';
import LoginPage from './components/LoginPage';
import ProfilePage from './components/ProfilePage';
import AdminDashboard from './components/AdminDashboard';
import Spinner from './components/Spinner';
import { Icon } from './components/Icon';
import CreateTopicModal from './components/CreateTopicModal';

type View =
  | { name: 'home' }
  | { name: 'category'; category: Category }
  | { name: 'topic'; topicId: string }
  | { name: 'profile'; userId: string }
  | { name: 'login' }
  | { name: 'admin' };

const App: React.FC = () => {
  const [view, setView] = useState<View>({ name: 'home' });
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [catData, topicData, userData, postData] = await Promise.all([
        api.fetchAllCategories(),
        api.fetchAllTopics(),
        api.fetchAllUsers(),
        api.fetchAllPosts(),
      ]);
      setCategories(catData);
      setTopics(topicData);
      setUsers(userData);
      setPosts(postData);
    } catch (error) {
      console.error("Failed to load initial data", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setView({ name: 'home' });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView({ name: 'home' });
  };

  const handleSelectTopic = (topic: Topic) => {
    setView({ name: 'topic', topicId: topic.id });
  };
  
  const handleSelectUser = (userId: string) => {
    setView({ name: 'profile', userId });
  };

  const handleCreateTopic = async (title: string, content: string, categoryId: string) => {
    if (!currentUser) return;
    const newTopic = await api.createTopic(title, content, categoryId, currentUser);
    await loadData(); // Reload all data to reflect changes
    handleSelectTopic(newTopic);
  };

  const renderView = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-96"><Spinner /></div>;
    }

    switch (view.name) {
      case 'login':
        return <LoginPage onLogin={handleLogin} />;
      
      case 'topic':
        const selectedTopic = topics.find(t => t.id === view.topicId);
        if (!selectedTopic) return <div>Topic not found. <button onClick={() => setView({ name: 'home' })}>Go Home</button></div>;
        return <TopicView 
                  topic={selectedTopic} 
                  currentUser={currentUser} 
                  onBack={() => setView({ name: 'home' })} 
                  onUserClick={handleSelectUser}
                  onLoginClick={() => setView({ name: 'login'})}
                />;
      
      case 'profile':
        return <ProfilePage userId={view.userId} onSelectTopic={handleSelectTopic} onUserClick={handleSelectUser} />;

      case 'admin':
        if (!currentUser?.isAdmin) {
          return <div className="text-center p-8">You are not authorized to view this page.</div>
        }
        return <AdminDashboard categories={categories} topics={topics} posts={posts} users={users} onDataUpdate={loadData} />
      
      case 'home':
      case 'category':
      default:
        const selectedCategory = view.name === 'category' ? view.category : null;
        return (
          <div className="flex gap-8 items-start">
            <aside className="w-56 flex-shrink-0 hidden md:block">
              <div className="bg-surface rounded-lg shadow-md p-4 sticky top-24">
                <h2 className="text-sm font-bold mb-2 px-2 uppercase tracking-wider text-on-surface-secondary">Categories</h2>
                <nav className="flex flex-col space-y-1">
                  <button 
                    onClick={() => setView({ name: 'home' })}
                    className={`px-3 py-2 rounded-md text-sm font-semibold w-full text-left transition-colors ${!selectedCategory ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 text-on-surface'}`}
                  >
                    All Topics
                  </button>
                  {categories.map(cat => (
                     <button 
                      key={cat.id} 
                      onClick={() => setView({ name: 'category', category: cat })}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-semibold w-full text-left transition-colors ${selectedCategory?.id === cat.id ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 text-on-surface'}`}
                    >
                       <span className="w-3 h-3 rounded-full" style={{ backgroundColor: `#${cat.color}` }}></span>
                       <span>{cat.name}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </aside>
            <div className="flex-grow min-w-0">
               <TopicList category={selectedCategory} onSelectTopic={handleSelectTopic} onUserClick={handleSelectUser} />
            </div>
          </div>
        )
    }
  };

  return (
    <div className="bg-background text-on-surface min-h-screen">
      <Header 
        currentUser={currentUser} 
        onLoginClick={() => setView({ name: 'login' })}
        onLogout={handleLogout}
        onHomeClick={() => setView({ name: 'home' })}
        onAdminClick={() => setView({ name: 'admin' })}
      />
      <main className="container mx-auto px-4 py-8">
        {renderView()}
      </main>

      {currentUser && (
        <button 
          onClick={() => setShowCreateModal(true)}
          className="fixed bottom-8 right-8 bg-primary text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 transition-transform hover:scale-110"
          title="Create New Topic"
        >
          <Icon name="plus" className="w-7 h-7" />
        </button>
      )}

      {showCreateModal && currentUser && (
        <CreateTopicModal 
          currentUser={currentUser}
          categories={categories}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateTopic}
        />
      )}
    </div>
  );
};

export default App;
