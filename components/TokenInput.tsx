'use client';

import { useState } from 'react';
import { Eye, EyeOff, Bot, AlertCircle } from 'lucide-react';
import { validateBotToken, TokenManager } from '@/lib/auth';

interface TokenInputProps {
  onTokenValidated: () => void;
}

export default function TokenInput({ onTokenValidated }: TokenInputProps) {
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      setError('Please enter a bot token');
      return;
    }

    setIsValidating(true);
    setError('');

    try {
      const botData = await validateBotToken(token.trim());
      if (botData) {
        TokenManager.saveToken(botData);
        onTokenValidated();
      } else {
        setError('Invalid bot token. Please check your token and try again.');
      }
    } catch (err) {
      setError('Failed to validate token. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="min-h-screen bg-discord-darker flex items-center justify-center p-4">
      <div className="bg-discord-dark rounded-lg p-8 w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-discord-blurple rounded-full mb-4">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Discord Bot Client</h1>
          <p className="text-discord-light">
            Enter your Discord bot token to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="token" className="block text-sm font-medium text-discord-light mb-2">
              Bot Token
            </label>
            <div className="relative">
              <input
                id="token"
                type={showToken ? 'text' : 'password'}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter your Discord bot token..."
                className="w-full px-3 py-2 pr-10 bg-discord-darker border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-discord-blurple focus:border-transparent"
                disabled={isValidating}
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                disabled={isValidating}
              >
                {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-discord-red text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isValidating || !token.trim()}
            className="w-full bg-discord-blurple hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
          >
            {isValidating ? 'Validating...' : 'Connect Bot'}
          </button>
        </form>

        <div className="mt-6 text-xs text-discord-light">
          <p className="mb-2">
            <strong>How to get your bot token:</strong>
          </p>
          <ol className="list-decimal list-inside space-y-1 text-gray-400">
            <li>Go to the Discord Developer Portal</li>
            <li>Select your application/bot</li>
            <li>Go to the "Bot" section</li>
            <li>Copy the token under "Token"</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
