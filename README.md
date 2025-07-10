# Zuo's Svelte Portfolio

SvelteKit 5 web application with interactive demos and AI chat functionality.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Groq API Key for AI chat functionality
GROQ_API_KEY=your_groq_api_key_here

# Neon Database Connection (get this from Neon console)
DATABASE_URL=postgresql://username:password@host.neon.tech/dbname?sslmode=require

# Alternative environment variable name (Vercel/Neon integration uses this)
POSTGRES_URL=postgresql://username:password@host.neon.tech/dbname?sslmode=require
```

## Database Setup

This application uses Neon PostgreSQL for chat storage. The database will be automatically initialized on the first request.

### For Local Development

1. Sign up for a free Neon account at [neon.tech](https://neon.tech)
2. Create a new project and database
3. Copy the connection string to your `.env` file
4. The application will automatically create the required tables

### For Vercel Deployment

1. Go to your Vercel project dashboard
2. Navigate to the **Storage** tab
3. Browse **All Storage** and find **Neon**
4. Click **Add** and follow the integration setup
5. This will automatically add the `DATABASE_URL` environment variable

## Development

```bash
npm install
npm run dev
```

## Features

- 🤖 **AI Chat**: Persistent chat with virtual Zuo using Groq/Llama
- 🎮 **Wordle Clone**: Full game implementation with state persistence
- 🗺️ **Interactive World Map**: 3D globe showing places Zuo has lived
- 👥 **Admin Interface**: View all user chat conversations
- 📱 **Responsive Design**: Works on all devices

## Tech Stack

- **Frontend**: SvelteKit 5, TypeScript, CSS Grid/Flexbox
- **Backend**: SvelteKit server routes, Neon PostgreSQL
- **AI**: Groq API with Llama 3.1 model
- **Deployment**: Vercel with automatic CI/CD

built with DeepSeek instead of reading Svelte docs
