export interface BotTokenData {
  token: string;
  botId: string;
  botUsername: string;
  botAvatar?: string;
}

export class TokenManager {
  private static readonly TOKEN_KEY = 'discord_bot_token';
  private static readonly BOT_DATA_KEY = 'discord_bot_data';

  static saveToken(tokenData: BotTokenData): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, tokenData.token);
      localStorage.setItem(this.BOT_DATA_KEY, JSON.stringify(tokenData));
    }
  }

  static getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  static getBotData(): BotTokenData | null {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(this.BOT_DATA_KEY);
      return data ? JSON.parse(data) : null;
    }
    return null;
  }

  static clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.BOT_DATA_KEY);
    }
  }

  static hasToken(): boolean {
    return this.getToken() !== null;
  }
}

export async function validateBotToken(token: string): Promise<BotTokenData | null> {
  try {
    const response = await fetch('/api/validate-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error('Invalid token');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Token validation failed:', error);
    return null;
  }
}
