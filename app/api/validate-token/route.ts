import { NextRequest, NextResponse } from 'next/server';

const DISCORD_API_BASE = 'https://discord.com/api/v10';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // Validate token by fetching bot user info
    const response = await fetch(`${DISCORD_API_BASE}/users/@me`, {
      headers: {
        'Authorization': `Bot ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const botUser = await response.json();

    // Check if it's actually a bot
    if (!botUser.bot) {
      return NextResponse.json({ error: 'Token must be for a bot account' }, { status: 400 });
    }

    return NextResponse.json({
      token,
      botId: botUser.id,
      botUsername: botUser.username,
      botAvatar: botUser.avatar,
    });
  } catch (error) {
    console.error('Token validation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
