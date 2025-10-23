import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Category, Topic, Post, User } from '../types';
import Spinner from './Spinner';
import { Icon } from './Icon';
import { adminCreateCategory, adminDeleteCategory, adminDeleteTopic, adminDeleteUser, adminToggleAdminStatus, adminEditCategory, adminCreateTopic } from '../services/api';
import Avatar from './Avatar';
import { formatRelativeTime } from '../utils/formatters';

interface AdminDashboardProps {
  categories: Category[];
  topics: Topic[];
  posts: Post[];
  users: User[];
  onDataUpdate: () => void;
}

type AdminView = 'overview' | 'users' | 'topics' | 'categories';

const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
    const [activeView, setActiveView] = useState<AdminView>('overview');

    const renderView = () => {
        switch (activeView) {
            case 'users':
                return <UserManagement users={props.users} onDataUpdate={props.onDataUpdate} />;
            case 'topics':
                return <TopicManagement topics={props.topics} users={props.users} categories={props.categories} onDataUpdate={props.onDataUpdate} />;
            case 'categories':
                return <CategoryManagement categories={props.categories} onDataUpdate={props.onDataUpdate} />;
            case 'overview':
            default:
                return <OverviewPanel {...props} />;
        }
    };

    return (
        <div className="flex gap-8 items-start">
            <aside className="w-56 flex-shrink-0 bg-surface rounded-lg shadow-md p-4 sticky top-24">
                <h2 className="text-lg font-bold mb-4 px-2">Admin Menu</h2>
                <nav className="flex flex-col space-y-1">
                    <AdminNavLink icon="dashboard" label="Overview" view="overview" activeView={activeView} onClick={setActiveView} />
                    <AdminNavLink icon="users" label="Users" view="users" activeView={activeView} onClick={setActiveView} />
                    <AdminNavLink icon="topics" label="Topics" view="topics" activeView={activeView} onClick={setActiveView} />
                    <AdminNavLink icon="category" label="Categories" view="categories" activeView={activeView} onClick={setActiveView} />
                </nav>
            </aside>
            <div className="flex-grow bg-surface rounded-lg shadow-md p-6 min-w-0">
                {renderView()}
            </div>
        </div>
    );
};

// --- Navigation Link Component ---
interface AdminNavLinkProps {
    icon: React.ComponentProps<typeof Icon>['name'];
    label: string;
    view: AdminView;
    activeView: AdminView;
    onClick: (view: AdminView) => void;
}
const AdminNavLink: React.FC<AdminNavLinkProps> = ({ icon, label, view, activeView, onClick }) => (
    <button
        onClick={() => onClick(view)}
        className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-semibold w-full text-left transition-colors ${
            activeView === view ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 text-on-surface-secondary'
        }`}
    >
        <Icon name={icon} className="w-5 h-5" />
        <span>{label}</span>
    </button>
);


// --- Overview Panel ---
const OverviewPanel: React.FC<AdminDashboardProps> = ({ categories, topics, posts }) => {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generateSummary = async () => {
    setIsLoading(true);
    setError('');
    setSummary('');

    if (!process.env.API_KEY) {
      setError('API key is not configured.');
      setIsLoading(false);
      return;
    }
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `You are an admin assistant for an online forum. Summarize the recent activity of the forum based on the following data. Provide a high-level overview and highlight any interesting trends.
        - Total Categories: ${categories.length}, Total Topics: ${topics.length}, Total Posts: ${posts.length}
        Recent Topics: ${topics.slice(0, 5).map(t => `- ${t.title}`).join('\n')}
        Recent Posts: ${posts.slice(0, 5).map(p => `- "${p.content.substring(0, 50)}..."`).join('\n')}`;
      const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
      setSummary(response.text);
    } catch (e) {
      console.error(e);
      setError('Failed to generate summary. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
        <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-center">
            <div className="bg-background p-4 rounded-lg"><div className="text-3xl font-bold">{categories.length}</div><div className="text-on-surface-secondary">Categories</div></div>
            <div className="bg-background p-4 rounded-lg"><div className="text-3xl font-bold">{topics.length}</div><div className="text-on-surface-secondary">Topics</div></div>
            <div className="bg-background p-4 rounded-lg"><div className="text-3xl font-bold">{posts.length}</div><div className="text-on-surface-secondary">Posts</div></div>
        </div>
        <div>
            <h2 className="text-xl font-semibold mb-2">AI-Powered Activity Summary</h2>
            <button onClick={generateSummary} disabled={isLoading} className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-secondary mb-4">
                {isLoading ? 'Generating...' : 'Generate Summary'}
            </button>
            {isLoading && <div className="flex justify-center my-4"><Spinner /></div>}
            {error && <div className="text-red-500 bg-red-100 p-3 rounded-md">{error}</div>}
            {summary && <div className="bg-background p-4 rounded-lg border border-border"><p className="whitespace-pre-wrap">{summary}</p></div>}
        </div>
    </div>
  );
};

// --- User Management Panel ---
const UserManagement: React.FC<{ users: User[], onDataUpdate: () => void }> = ({ users, onDataUpdate }) => {
    const handleDelete = async (user: User) => {
        if (window.confirm(`Are you sure you want to delete user ${user.username}? This is irreversible.`)) {
            try {
                await adminDeleteUser(user.id);
                onDataUpdate();
            } catch (error: any) { alert(error.message); }
        }
    };
    const handleToggleAdmin = async (user: User) => {
        try {
            await adminToggleAdminStatus(user.id);
            onDataUpdate();
        } catch (error: any) { alert(error.message); }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">User Management</h1>
            <div className="overflow-x-auto border border-border rounded-lg">
                <table className="min-w-full text-sm">
                    <thead className="bg-background">
                        <tr>
                            <th className="p-3 text-left font-semibold">User</th>
                            <th className="p-3 text-left font-semibold">Joined</th>
                            <th className="p-3 text-center font-semibold">Admin</th>
                            <th className="p-3 text-right font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="p-3"><div className="flex items-center gap-3"><Avatar user={user} size="sm" /><div><div className="font-bold">{user.username}</div><div className="text-xs text-on-surface-secondary">{user.name}</div></div></div></td>
                                <td className="p-3 text-on-surface-secondary">{new Date(user.joinedAt).toLocaleDateString()}</td>
                                <td className="p-3 text-center">{user.isAdmin ? '✅' : '❌'}</td>
                                <td className="p-3"><div className="flex justify-end gap-2">
                                    <button onClick={() => handleToggleAdmin(user)} className="text-xs font-bold py-1 px-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200">{user.isAdmin ? 'Revoke Admin' : 'Make Admin'}</button>
                                    <button disabled={user.isAdmin} onClick={() => handleDelete(user)} className="text-xs font-bold py-1 px-2 rounded bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed">Delete</button>
                                </div></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- Topic Management Panel ---
const TopicManagement: React.FC<{ topics: Topic[], users: User[], categories: Category[], onDataUpdate: () => void }> = ({ topics, users, categories, onDataUpdate }) => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [authorId, setAuthorId] = useState(users[0]?.id || '');
    const [categoryId, setCategoryId] = useState(categories[0]?.id || '');

    const handleDelete = async (topic: Topic) => {
        if (window.confirm(`Are you sure you want to delete the topic "${topic.title}"? This will also delete all its posts.`)) {
            try {
                await adminDeleteTopic(topic.id);
                onDataUpdate();
            } catch (error: any) { alert(error.message); }
        }
    };
    
    const handleCreateTopic = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim() || !authorId || !categoryId) {
            alert("All fields are required.");
            return;
        }
        try {
            await adminCreateTopic(title, content, authorId, categoryId);
            setTitle('');
            setContent('');
            setShowCreateForm(false);
            onDataUpdate();
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Topic Management</h1>
                <button onClick={() => setShowCreateForm(!showCreateForm)} className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
                    <Icon name="plus" className="w-5 h-5" />
                    <span>{showCreateForm ? 'Cancel' : 'Create Topic'}</span>
                </button>
            </div>

            {showCreateForm && (
                <div className="bg-background p-4 rounded-lg border border-border mb-6">
                    <form onSubmit={handleCreateTopic} className="space-y-4">
                        <div><label className="text-sm font-bold">Title</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full mt-1 p-2 border border-border rounded" required /></div>
                        <div><label className="text-sm font-bold">Initial Post Content</label><textarea value={content} onChange={e => setContent(e.target.value)} className="w-full mt-1 p-2 border border-border rounded" rows={4} required></textarea></div>
                        <div className="grid grid-cols-2 gap-4">
                           <div><label className="text-sm font-bold">Author</label><select value={authorId} onChange={e => setAuthorId(e.target.value)} className="w-full mt-1 p-2 border border-border rounded bg-white"><option value="" disabled>Select User</option>{users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}</select></div>
                           <div><label className="text-sm font-bold">Category</label><select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full mt-1 p-2 border border-border rounded bg-white"><option value="" disabled>Select Category</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                        </div>
                        <div className="flex justify-end"><button type="submit" className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600">Create</button></div>
                    </form>
                </div>
            )}

             <div className="overflow-x-auto border border-border rounded-lg">
                <table className="min-w-full text-sm">
                    <thead className="bg-background">
                        <tr>
                            <th className="p-3 text-left font-semibold">Topic</th>
                            <th className="p-3 text-left font-semibold">Author</th>
                            <th className="p-3 text-left font-semibold">Category</th>
                            <th className="p-3 text-right font-semibold">Activity</th>
                            <th className="p-3 text-right font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {topics.map(topic => (
                            <tr key={topic.id}>
                                <td className="p-3 font-bold">{topic.title}</td>
                                <td className="p-3">{topic.author.username}</td>
                                <td className="p-3"><span className="text-xs font-bold py-1 px-2 rounded-full" style={{backgroundColor: `#${topic.category.color}20`, color: `#${topic.category.color}`}}>{topic.category.name}</span></td>
                                <td className="p-3 text-right text-on-surface-secondary">{formatRelativeTime(topic.lastPostedAt)}</td>
                                <td className="p-3 text-right"><button onClick={() => handleDelete(topic)} className="text-xs font-bold py-1 px-2 rounded bg-red-100 text-red-700 hover:bg-red-200">Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- Category Management Panel ---
const CategoryManagement: React.FC<{ categories: Category[], onDataUpdate: () => void }> = ({ categories, onDataUpdate }) => {
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [color, setColor] = useState('#cccccc');
    
    useEffect(() => {
        if (editingCategory) {
            setName(editingCategory.name);
            setDesc(editingCategory.description);
            setColor(`#${editingCategory.color}`);
        } else {
            resetForm();
        }
    }, [editingCategory]);

    const resetForm = () => {
        setEditingCategory(null);
        setName('');
        setDesc('');
        setColor('#cccccc');
    };

    const handleDelete = async (cat: Category) => {
        if (window.confirm(`Are you sure you want to delete the category "${cat.name}"?`)) {
            try {
                await adminDeleteCategory(cat.id);
                onDataUpdate();
            } catch (error: any) { alert(error.message); }
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        try {
            if (editingCategory) {
                await adminEditCategory(editingCategory.id, { name, description: desc, color });
            } else {
                await adminCreateCategory(name, desc, color);
            }
            resetForm();
            onDataUpdate();
        } catch (error: any) { alert(error.message); }
    };
    
    return (
        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <h1 className="text-2xl font-bold mb-4">Manage Categories</h1>
                 <div className="overflow-x-auto border border-border rounded-lg">
                    <table className="min-w-full text-sm">
                        <thead className="bg-background"><tr><th className="p-3 text-left font-semibold">Category</th><th className="p-3 text-left font-semibold">Description</th><th className="p-3 text-right font-semibold">Actions</th></tr></thead>
                        <tbody className="divide-y divide-border">
                            {categories.map(cat => (
                                <tr key={cat.id}>
                                    <td className="p-3"><div className="flex items-center gap-2"><span className="w-4 h-4 rounded" style={{backgroundColor: `#${cat.color}`}}></span><span className="font-bold">{cat.name}</span></div></td>
                                    <td className="p-3 text-on-surface-secondary">{cat.description}</td>
                                    <td className="p-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => setEditingCategory(cat)} className="text-xs font-bold py-1 px-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200">Edit</button>
                                            <button onClick={() => handleDelete(cat)} className="text-xs font-bold py-1 px-2 rounded bg-red-100 text-red-700 hover:bg-red-200">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div>
                 <h2 className="text-xl font-bold mb-4">{editingCategory ? 'Edit Category' : 'New Category'}</h2>
                 <form onSubmit={handleFormSubmit} className="space-y-4 bg-background p-4 rounded-lg">
                     <div><label className="text-sm font-bold">Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full mt-1 p-2 border border-border rounded" required /></div>
                     <div><label className="text-sm font-bold">Description</label><textarea value={desc} onChange={e => setDesc(e.target.value)} className="w-full mt-1 p-2 border border-border rounded" rows={3}></textarea></div>
                     <div><label className="text-sm font-bold">Color</label><input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-full mt-1 p-1 h-10 border border-border rounded" /></div>
                     <div className="flex gap-2">
                        {editingCategory && <button type="button" onClick={resetForm} className="w-full bg-gray-200 text-on-surface font-bold py-2 rounded hover:bg-gray-300">Cancel</button>}
                        <button type="submit" className="w-full bg-primary text-white font-bold py-2 rounded hover:bg-blue-600">{editingCategory ? 'Update' : 'Create'}</button>
                     </div>
                 </form>
            </div>
        </div>
    );
};


export default AdminDashboard;