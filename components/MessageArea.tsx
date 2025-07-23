'use client';

import { useState, useEffect, useRef } from 'react';
import { Message, Channel } from '@/lib/discord-api';
import { Hash, Send, Bot } from 'lucide-react';

interface MessageAreaProps {
  channel: Channel | null;
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}

export default function MessageArea({ channel, messages, onSendMessage, isLoading }: MessageAreaProps) {
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim() && !isLoading) {
      onSendMessage(messageInput.trim());
      setMessageInput('');
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' +
             date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  const getAvatarUrl = (message: Message) => {
    if (message.author.avatar) {
      return `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`;
    }
    return `https://cdn.discordapp.com/embed/avatars/${parseInt(message.author.id) % 5}.png`;
  };

  if (!channel) {
    return (
      <div className="flex-1 bg-discord-dark flex items-center justify-center">
        <div className="text-center">
          <Hash className="w-16 h-16 text-discord-light mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Welcome to Discord Bot Client</h2>
          <p className="text-discord-light">Select a channel to start viewing messages</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-discord-dark flex flex-col">
      {/* Channel Header */}
      <div className="h-12 border-b border-discord-darker flex items-center px-4 shadow-sm">
        <Hash className="w-5 h-5 text-discord-light mr-2" />
        <h2 className="text-white font-semibold">{channel.name}</h2>
        {channel.topic && (
          <>
            <div className="w-px h-4 bg-discord-light mx-2" />
            <p className="text-discord-light text-sm truncate">{channel.topic}</p>
          </>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-discord-light">Loading messages...</div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              const prevMessage = messages[index - 1];
              const showAvatar = !prevMessage || 
                prevMessage.author.id !== message.author.id ||
                new Date(message.timestamp).getTime() - new Date(prevMessage.timestamp).getTime() > 300000; // 5 minutes

              return (
                <div key={message.id} className={`flex ${showAvatar ? 'mt-4' : 'mt-1'}`}>
                  <div className="w-10 mr-3 flex-shrink-0">
                    {showAvatar && (
                      <img
                        src={getAvatarUrl(message)}
                        alt={message.author.username}
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    {showAvatar && (
                      <div className="flex items-baseline mb-1">
                        <span className="font-medium text-white mr-2">
                          {message.author.username}
                        </span>
                        {message.author.bot && (
                          <span className="bg-discord-blurple text-white text-xs px-1 py-0.5 rounded mr-2">
                            <Bot className="w-3 h-3 inline mr-1" />
                            BOT
                          </span>
                        )}
                        <span className="text-xs text-discord-light">
                          {formatTimestamp(message.timestamp)}
                        </span>
                      </div>
                    )}
                    <div className="text-white message-content">
                      {message.content || <em className="text-discord-light">No content</em>}
                    </div>
                    {message.attachments.length > 0 && (
                      <div className="mt-2">
                        {message.attachments.map((attachment: any) => (
                          <div key={attachment.id} className="text-discord-blurple text-sm">
                            📎 {attachment.filename}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4">
        <form onSubmit={handleSendMessage} className="relative">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder={`Message #${channel.name}`}
            className="w-full bg-discord-light/10 border-none rounded-lg px-4 py-3 pr-12 text-white placeholder-discord-light focus:outline-none focus:ring-2 focus:ring-discord-blurple"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!messageInput.trim() || isLoading}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-discord-light hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
