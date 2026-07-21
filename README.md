# KidVideos

Safe, curated YouTube for kids. Parents pick the videos. Kids watch only what's approved.

## Features

- **Google OAuth** - Sign in with Google, no passwords to remember
- **Family-based** - Each family has its own curated video library
- **Category organization** - Group videos by Science, Math, Geography, and more
- **Per-kid assignments** - Control which kids can see which videos
- **Distraction-free player** - No YouTube recommendations, no sidebar, no rabbit holes
- **AI recommendations** - Daily suggestions based on your library, powered by Claude
- **Kid mode** - Simple, colorful interface for kids to browse and watch

## Tech Stack

- Next.js 16 (App Router, TypeScript)
- Tailwind CSS
- Prisma ORM + PostgreSQL
- NextAuth.js (Google provider)
- YouTube Data API v3
- Claude API (Anthropic) for recommendations
- Railway for deployment

## Setup

1. Clone the repo
2. Copy `.env.example` to `.env.local` and fill in the values
3. Run `npm install`
4. Run `npx prisma migrate dev` to set up the database
5. Run `npx prisma db seed` to seed default categories
6. Run `npm run dev`

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_URL` | App URL (e.g., `https://kidvideos.farmtolocker.com`) |
| `NEXTAUTH_SECRET` | Random secret for NextAuth |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `YOUTUBE_API_KEY` | YouTube Data API v3 key |
| `ANTHROPIC_API_KEY` | Anthropic API key for recommendations |
| `CRON_SECRET` | Secret for the daily recommendations cron endpoint |

## Deployment

Deployed on Railway at `kidvideos.farmtolocker.com`. The `railway.json` and `nixpacks.toml` files configure the build and deploy process. Railway's PostgreSQL plugin provides the database.
