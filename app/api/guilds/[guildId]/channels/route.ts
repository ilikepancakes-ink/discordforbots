import { NextRequest, NextResponse } from 'next/server';

const DISCORD_API_BASE = 'https://discord.com/api/v10';

export async function GET(
  request: NextRequest,
  { params }: { params: { guildId: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bot ', '');

    if (!token) {
      return NextResponse.json({ error: 'Authorization required' }, { status: 401 });
    }

    const response = await fetch(`${DISCORD_API_BASE}/guilds/${params.guildId}/channels`, {
      headers: {
        'Authorization': `Bot ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch channels' }, { status: response.status });
    }

    const channels = await response.json();
    
    // Filter and sort channels
    const sortedChannels = channels
      .filter((channel: any) => channel.type === 0 || channel.type === 2) // Text and voice channels
      .sort((a: any, b: any) => a.position - b.position);

    return NextResponse.json(sortedChannels);
  } catch (error) {
    console.error('Channels fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
