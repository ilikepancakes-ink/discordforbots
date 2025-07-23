'use client';

import { useState, useEffect, useCallback } from 'react';
import { TokenManager } from '@/lib/auth';
import { DiscordAPI, Guild, Channel, Message } from '@/lib/discord-api';
import ServerList from './ServerList';
import ChannelList from './ChannelList';
import MessageArea from './MessageArea';

interface DiscordClientProps {
  onLogout: () => void;
}

export default function DiscordClient({ onLogout }: DiscordClientProps) {
  const [api, setApi] = useState<DiscordAPI | null>(null);
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [selectedGuild, setSelectedGuild] = useState<Guild | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize API
  useEffect(() => {
    const token = TokenManager.getToken();
    if (token) {
      setApi(new DiscordAPI(token));
    }
  }, []);

  // Load guilds
  useEffect(() => {
    if (api) {
      loadGuilds();
    }
  }, [api]);

  const loadGuilds = async () => {
    if (!api) return;
    
    try {
      setIsLoading(true);
      const guildsData = await api.getGuilds();
      setGuilds(guildsData);
      
      // Auto-select first guild
      if (guildsData.length > 0) {
        handleGuildSelect(guildsData[0].id);
      }
    } catch (error) {
      console.error('Failed to load guilds:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuildSelect = async (guildId: string) => {
    if (!api) return;

    const guild = guilds.find(g => g.id === guildId);
    if (!guild) return;

    try {
      setIsLoading(true);
      setSelectedGuild(guild);
      setSelectedChannel(null);
      setMessages([]);

      const channelsData = await api.getChannels(guildId);
      setChannels(channelsData);

      // Auto-select first text channel
      const firstTextChannel = channelsData.find(c => c.type === 0);
      if (firstTextChannel) {
        handleChannelSelect(firstTextChannel.id);
      }
    } catch (error) {
      console.error('Failed to load channels:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChannelSelect = async (channelId: string) => {
    if (!api) return;

    const channel = channels.find(c => c.id === channelId);
    if (!channel) return;

    try {
      setIsLoading(true);
      setSelectedChannel(channel);

      const messagesData = await api.getMessages(channelId);
      setMessages(messagesData.reverse()); // Discord returns messages in reverse order
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!api || !selectedChannel) return;

    try {
      setIsLoading(true);
      const newMessage = await api.sendMessage(selectedChannel.id, content);
      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    TokenManager.clearToken();
    onLogout();
  };

  return (
    <div className="h-screen flex bg-discord-darker">
      <ServerList
        guilds={guilds}
        selectedGuildId={selectedGuild?.id}
        onGuildSelect={handleGuildSelect}
        onLogout={handleLogout}
      />
      <ChannelList
        guild={selectedGuild}
        channels={channels}
        selectedChannelId={selectedChannel?.id}
        onChannelSelect={handleChannelSelect}
      />
      <MessageArea
        channel={selectedChannel}
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
}
