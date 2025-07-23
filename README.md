# Discord Bot Client

A Discord client that allows you to sign in with a bot token and interact with Discord servers through a web interface. This application can be hosted on Vercel and provides a Discord-like interface for bot accounts.

## Features

- 🤖 **Bot Token Authentication**: Secure login using Discord bot tokens
- 🏠 **Server Management**: View and navigate between Discord servers
- 💬 **Channel Navigation**: Browse text and voice channels
- 📝 **Message Viewing**: Read messages in channels
- ✉️ **Message Sending**: Send messages as your bot
- 🎨 **Discord-like UI**: Familiar interface similar to Discord
- ☁️ **Vercel Ready**: Optimized for Vercel deployment

## Getting Started

### Prerequisites

- Node.js 18+ 
- A Discord bot token (see setup instructions below)

### Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd discord-bot-client
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Getting a Discord Bot Token

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application or select an existing one
3. Navigate to the "Bot" section
4. Copy the token under "Token"
5. Make sure your bot has the necessary permissions and is added to servers

### Deployment on Vercel

1. Fork this repository
2. Connect your GitHub account to Vercel
3. Import the project in Vercel
4. Deploy! No environment variables needed.

## Usage

1. When you first visit the application, you'll be prompted to enter your Discord bot token
2. After successful authentication, you'll see the Discord-like interface
3. Select a server from the left sidebar
4. Choose a channel to view messages
5. Send messages using the input field at the bottom

## Security

- Bot tokens are stored locally in your browser's localStorage
- Tokens are never sent to any external servers except Discord's API
- All API calls are made through secure HTTPS connections

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **API**: Discord REST API v10
- **Deployment**: Vercel

## API Routes

- `POST /api/validate-token` - Validates Discord bot tokens
- `GET /api/guilds` - Fetches bot's guilds
- `GET /api/guilds/[guildId]/channels` - Fetches guild channels
- `GET /api/channels/[channelId]/messages` - Fetches channel messages
- `POST /api/channels/[channelId]/messages` - Sends messages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Disclaimer

This application is not affiliated with Discord Inc. Use responsibly and in accordance with Discord's Terms of Service and API Terms of Service.
