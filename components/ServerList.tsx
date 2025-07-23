'use client';

import { Guild } from '@/lib/discord-api';
import { Hash, Settings, LogOut } from 'lucide-react';
import { TokenManager } from '@/lib/auth';

interface ServerListProps {
  guilds: Guild[];
  selectedGuildId?: string;
  onGuildSelect: (guildId: string) => void;
  onLogout: () => void;
}

export default function ServerList({ guilds, selectedGuildId, onGuildSelect, onLogout }: ServerListProps) {
  const getGuildIcon = (guild: Guild) => {
    if (guild.icon) {
      return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`;
    }
    return null;
  };

  const getGuildInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="w-18 bg-discord-darker flex flex-col items-center py-3 space-y-2">
      {/* Home/DM Button */}
      <div className="relative group">
        <div className="w-12 h-12 bg-discord-blurple rounded-full flex items-center justify-center cursor-pointer hover:rounded-2xl transition-all duration-200">
          <Hash className="w-6 h-6 text-white" />
        </div>
        <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
          Direct Messages
        </div>
      </div>

      {/* Separator */}
      <div className="w-8 h-0.5 bg-discord-dark rounded-full" />

      {/* Guild List */}
      <div className="flex flex-col space-y-2 flex-1 overflow-y-auto">
        {guilds.map((guild) => {
          const isSelected = guild.id === selectedGuildId;
          const iconUrl = getGuildIcon(guild);

          return (
            <div key={guild.id} className="relative group">
              <div
                onClick={() => onGuildSelect(guild.id)}
                className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'rounded-2xl bg-discord-blurple'
                    : 'hover:rounded-2xl bg-discord-dark hover:bg-discord-blurple'
                }`}
              >
                {iconUrl ? (
                  <img
                    src={iconUrl}
                    alt={guild.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-semibold text-sm">
                    {getGuildInitials(guild.name)}
                  </span>
                )}
              </div>
              
              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full -ml-1" />
              )}

              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                {guild.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* Settings and Logout */}
      <div className="space-y-2">
        <div className="relative group">
          <div className="w-12 h-12 bg-discord-dark rounded-full flex items-center justify-center cursor-pointer hover:rounded-2xl hover:bg-gray-600 transition-all duration-200">
            <Settings className="w-5 h-5 text-discord-light" />
          </div>
          <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
            Settings
          </div>
        </div>

        <div className="relative group">
          <div
            onClick={onLogout}
            className="w-12 h-12 bg-discord-red rounded-full flex items-center justify-center cursor-pointer hover:rounded-2xl hover:bg-red-600 transition-all duration-200"
          >
            <LogOut className="w-5 h-5 text-white" />
          </div>
          <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
            Logout
          </div>
        </div>
      </div>
    </div>
  );
}
