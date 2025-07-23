export interface Guild {
  id: string;
  name: string;
  icon?: string;
  owner: boolean;
  permissions: string;
}

export interface Channel {
  id: string;
  name: string;
  type: number;
  position: number;
  parent_id?: string;
  topic?: string;
}

export interface Message {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
    bot?: boolean;
  };
  timestamp: string;
  edited_timestamp?: string;
  attachments: any[];
  embeds: any[];
}

export class DiscordAPI {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  private getHeaders() {
    return {
      'Authorization': `Bot ${this.token}`,
      'Content-Type': 'application/json',
    };
  }

  async getGuilds(): Promise<Guild[]> {
    const response = await fetch('/api/guilds', {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch guilds');
    }

    return response.json();
  }

  async getChannels(guildId: string): Promise<Channel[]> {
    const response = await fetch(`/api/guilds/${guildId}/channels`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch channels');
    }

    return response.json();
  }

  async getMessages(channelId: string, limit = 50, before?: string): Promise<Message[]> {
    let url = `/api/channels/${channelId}/messages?limit=${limit}`;
    if (before) {
      url += `&before=${before}`;
    }

    const response = await fetch(url, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }

    return response.json();
  }

  async sendMessage(channelId: string, content: string): Promise<Message> {
    const response = await fetch(`/api/channels/${channelId}/messages`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return response.json();
  }

  getAvatarUrl(userId: string, avatar?: string): string {
    if (!avatar) {
      return `https://cdn.discordapp.com/embed/avatars/${parseInt(userId) % 5}.png`;
    }
    return `https://cdn.discordapp.com/avatars/${userId}/${avatar}.png`;
  }

  getGuildIconUrl(guildId: string, icon?: string): string | null {
    if (!icon) return null;
    return `https://cdn.discordapp.com/icons/${guildId}/${icon}.png`;
  }
}
