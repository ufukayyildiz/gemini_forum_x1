
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Category, Topic, Post } from '../types';
import Spinner from './Spinner';

interface AdminDashboardProps {
  categories: Category[];
  topics: Topic[];
  posts: Post[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ categories, topics, posts }) => {
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
      // FIX: Initialize GoogleGenAI with apiKey from environment variables.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `
        You are an admin assistant for an online forum. 
        Summarize the recent activity of the forum based on the following data.
        Provide a high-level overview and highlight any interesting trends.

        - Total Categories: ${categories.length}
        - Total Topics: ${topics.length}
        - Total Posts: ${posts.length}

        Recent Topics (titles):
        ${topics.slice(0, 5).map(t => `- ${t.title}`).join('\n')}

        Recent Posts (content snippets):
        ${posts.slice(0, 5).map(p => `- "${p.content.substring(0, 50)}..."`).join('\n')}
      `;

      // FIX: Use ai.models.generateContent to generate content.
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      // FIX: Extract text from response using the .text property.
      setSummary(response.text);
    } catch (e) {
      console.error(e);
      setError('Failed to generate summary. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-surface rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-center">
        <div className="bg-background p-4 rounded-lg">
          <div className="text-3xl font-bold">{categories.length}</div>
          <div className="text-on-surface-secondary">Categories</div>
        </div>
        <div className="bg-background p-4 rounded-lg">
          <div className="text-3xl font-bold">{topics.length}</div>
          <div className="text-on-surface-secondary">Topics</div>
        </div>
        <div className="bg-background p-4 rounded-lg">
          <div className="text-3xl font-bold">{posts.length}</div>
          <div className="text-on-surface-secondary">Posts</div>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">AI-Powered Activity Summary</h2>
        <button
          onClick={generateSummary}
          disabled={isLoading}
          className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-secondary mb-4"
        >
          {isLoading ? 'Generating...' : 'Generate Summary'}
        </button>
        {isLoading && <div className="flex justify-center my-4"><Spinner /></div>}
        {error && <div className="text-red-500 bg-red-100 p-3 rounded-md">{error}</div>}
        {summary && (
          <div className="bg-background p-4 rounded-lg border border-border">
             <p className="whitespace-pre-wrap">{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
