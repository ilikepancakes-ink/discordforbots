'use client';

import { Channel, Guild } from '@/lib/discord-api';
import { Hash, Volume2, ChevronDown, Settings } from 'lucide-react';

interface ChannelListProps {
  guild: Guild | null;
  channels: Channel[];
  selectedChannelId?: string;
  onChannelSelect: (channelId: string) => void;
}

export default function ChannelList({ guild, channels, selectedChannelId, onChannelSelect }: ChannelListProps) {
  if (!guild) {
    return (
      <div className="w-60 bg-discord-dark flex items-center justify-center">
        <p className="text-discord-light">Select a server</p>
      </div>
    );
  }

  const textChannels = channels.filter(channel => channel.type === 0);
  const voiceChannels = channels.filter(channel => channel.type === 2);

  const ChannelIcon = ({ type }: { type: number }) => {
    if (type === 0) return <Hash className="w-4 h-4" />;
    if (type === 2) return <Volume2 className="w-4 h-4" />;
    return <Hash className="w-4 h-4" />;
  };

  const ChannelItem = ({ channel }: { channel: Channel }) => {
    const isSelected = channel.id === selectedChannelId;
    
    return (
      <div
        onClick={() => onChannelSelect(channel.id)}
        className={`flex items-center px-2 py-1 mx-2 rounded cursor-pointer group ${
          isSelected
            ? 'bg-discord-light/10 text-white'
            : 'text-discord-light hover:bg-discord-light/5 hover:text-white'
        }`}
      >
        <ChannelIcon type={channel.type} />
        <span className="ml-2 text-sm font-medium truncate">{channel.name}</span>
      </div>
    );
  };

  return (
    <div className="w-60 bg-discord-dark flex flex-col">
      {/* Server Header */}
      <div className="h-12 border-b border-discord-darker flex items-center justify-between px-4 shadow-sm">
        <h2 className="text-white font-semibold truncate">{guild.name}</h2>
        <ChevronDown className="w-4 h-4 text-discord-light" />
      </div>

      {/* Channels */}
      <div className="flex-1 overflow-y-auto py-2">
        {/* Text Channels */}
        {textChannels.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between px-4 py-1">
              <h3 className="text-xs font-semibold text-discord-light uppercase tracking-wide">
                Text Channels
              </h3>
            </div>
            <div className="space-y-0.5">
              {textChannels.map(channel => (
                <ChannelItem key={channel.id} channel={channel} />
              ))}
            </div>
          </div>
        )}

        {/* Voice Channels */}
        {voiceChannels.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between px-4 py-1">
              <h3 className="text-xs font-semibold text-discord-light uppercase tracking-wide">
                Voice Channels
              </h3>
            </div>
            <div className="space-y-0.5">
              {voiceChannels.map(channel => (
                <ChannelItem key={channel.id} channel={channel} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User Panel */}
      <div className="h-14 bg-discord-darker flex items-center px-2">
        <div className="flex items-center flex-1 min-w-0">
          <div className="w-8 h-8 bg-discord-blurple rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">B</span>
          </div>
          <div className="ml-2 min-w-0 flex-1">
            <p className="text-white text-sm font-medium truncate">Bot Client</p>
            <p className="text-xs text-discord-light">Online</p>
          </div>
        </div>
        <button className="p-1 text-discord-light hover:text-white">
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
