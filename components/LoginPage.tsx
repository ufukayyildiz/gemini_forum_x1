
import React, { useState } from 'react';
import { login } from '../services/api';
import type { User } from '../types';
import Spinner from './Spinner';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const user = await login(username);
      onLogin(user);
    } catch (err) {
      setError('Invalid username. Try "react_guru" or "tailwind_fan".');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-surface rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Log In</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-on-surface-secondary font-bold mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g., react_guru"
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-secondary flex justify-center items-center"
          >
            {isLoading ? <Spinner /> : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
