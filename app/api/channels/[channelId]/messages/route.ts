import { NextRequest, NextResponse } from 'next/server';

const DISCORD_API_BASE = 'https://discord.com/api/v10';

export async function GET(
  request: NextRequest,
  { params }: { params: { channelId: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bot ', '');
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '50';
    const before = searchParams.get('before');

    if (!token) {
      return NextResponse.json({ error: 'Authorization required' }, { status: 401 });
    }

    let url = `${DISCORD_API_BASE}/channels/${params.channelId}/messages?limit=${limit}`;
    if (before) {
      url += `&before=${before}`;
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bot ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch messages' }, { status: response.status });
    }

    const messages = await response.json();
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Messages fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { channelId: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bot ', '');
    const { content } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Authorization required' }, { status: 401 });
    }

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    }

    const response = await fetch(`${DISCORD_API_BASE}/channels/${params.channelId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bot ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: content.trim() }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to send message' }, { status: response.status });
    }

    const message = await response.json();
    return NextResponse.json(message);
  } catch (error) {
    console.error('Message send error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
