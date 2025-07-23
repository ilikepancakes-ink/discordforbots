'use client';

import { useState, useEffect } from 'react';
import { TokenManager } from '@/lib/auth';
import TokenInput from '@/components/TokenInput';
import DiscordClient from '@/components/DiscordClient';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user already has a token
    const hasToken = TokenManager.hasToken();
    setIsAuthenticated(hasToken);
    setIsLoading(false);
  }, []);

  const handleTokenValidated = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-discord-darker flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <TokenInput onTokenValidated={handleTokenValidated} />;
  }

  return <DiscordClient onLogout={handleLogout} />;
}
