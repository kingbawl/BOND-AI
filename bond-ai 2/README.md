# BOND — AI Business Operating System

A GitHub-ready, extensible starter for BOND: a dark, macOS-inspired AI business workspace with a separate API server, per-user authentication, persistent local database, multi-provider AI adapter, agent naming, conversation history, starter analytics, and community creation/invites.

> **Honest status:** this is a working foundation, not the finished autonomous business platform. The app currently supports email/password authentication, persistent local SQLite data, agent naming, chat history, AI provider adapters (demo/Gemini/OpenAI/Anthropic), analytics empty states, and basic community creation/joining. Google OAuth, production PostgreSQL deployment, real-time community chat, file storage/RAG, live voice, external business integrations, and the native macOS companion still require configuration/implementation. The UI labels unavailable integrations as not connected rather than fabricating success or business data.

## Requirements

- Node.js 20.11+ (Node 22 LTS recommended)
- npm 10+
- A Gemini, OpenAI, or Anthropic API key to enable live AI (optional; demo mode works without one)

## Run locally

```bash
# 1. Install dependencies from the project root
npm install

# 2. Create server environment file
cp .env.example .env

# 3. Generate Prisma client and create the local SQLite database
npm run db:generate
npm run db:migrate

# 4. Start API + frontend
npm run dev
```

Open **http://localhost:5173**. The API runs at **http://localhost:8787**.

If Prisma asks to install/generate its client, run `npm run db:generate` again. Keep `.env` private; it is ignored by Git.

## Enable an AI provider

Edit the root `.env` file. Only the selected provider's key is required.

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash
```

Or use:

```env
AI_PROVIDER=openai
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4.1-mini
```

```env
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=your_key_here
ANTHROPIC_MODEL=claude-sonnet-4-20250514
```

Restart the server after changing `.env`. The server-side provider adapter keeps API keys out of browser code. `AI_PROVIDER=demo` works without an API key.

## Connect a production database later

The app uses Prisma as its data-access layer. Local development defaults to SQLite. For PostgreSQL deployment:

1. Provision a managed PostgreSQL database (for example Neon, Supabase Postgres, or a cloud PostgreSQL service).
2. In `server/prisma/schema.prisma`, change the datasource `provider` from `sqlite` to `postgresql`.
3. Set `DATABASE_URL` in the server deployment environment to the provider's PostgreSQL connection string. Use a separate migration/direct URL if your provider requires it.
4. Run `npm run db:generate` and create/deploy migrations (`prisma migrate dev` for development, `prisma migrate deploy` for production).
5. Back up and migrate existing SQLite data if you have created any accounts you need to retain. Changing the provider does not automatically transfer data.

Do not put database credentials in `client/` or any `VITE_` variable.

## Authentication

Email/password registration and login are implemented. Passwords are hashed with bcrypt and API routes use signed bearer tokens. For production, set a long random `JWT_SECRET`, use HTTPS, configure rate limiting, email verification, password reset, and secure refresh/session handling.

Google sign-in uses Google Identity Services when `GOOGLE_CLIENT_ID` is configured. Create a Web OAuth client in Google Cloud Console, add your development and production origins to Authorized JavaScript origins, and set `GOOGLE_CLIENT_ID` on the API server. The API verifies the Google ID token server-side before creating/signing in the account. If no client ID is configured, the UI shows setup guidance. Do not treat a client-supplied email as proof of identity.

## What's included

- `client/` — React + TypeScript + Vite UI.
- `server/` — Express API and AI provider adapters.
- `server/prisma/schema.prisma` — User, agent, message, and community schema.
- `docs/legacy-dashboard-reference.html` — The original supplied BOND HTML dashboard, preserved as a design/behavior reference.
- `docs/ARCHITECTURE.md` — System boundaries and extension points.
- `docs/INTEGRATIONS.md` — Integration roadmap and safe connector pattern.
- `docs/MARK-LVII-REFERENCE.md` — What was taken as architectural inspiration from the supplied Python assistant ZIP.
- `desktop/README.md` — Planned native desktop companion.

## Current API routes

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/me` (authenticated)
- `PATCH /api/agent` (authenticated)
- `GET /api/chat/history` (authenticated)
- `POST /api/chat` (authenticated)
- `GET /api/analytics/summary` (authenticated; truthful no-data response)
- `GET /api/communities` (authenticated)
- `POST /api/communities` (authenticated)
- `POST /api/communities/join` (authenticated)

## GitHub

1. Create an empty GitHub repository named `bond-ai`.
2. Extract/download this project folder.
3. From this folder run:

```bash
git init
git add .
git commit -m "Initial BOND AI application"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/bond-ai.git
git push -u origin main
```

4. Do not commit `.env`, API keys, database files, or user data.

## Deployment outline

Deploy the frontend and API as separate services or deploy the API with the built frontend. Configure the frontend origin, API base/proxy, database URL, JWT secret, and selected AI key in the hosting provider's secret manager. Use PostgreSQL for production, enable backups, configure CORS to the real domain, and add rate limiting and monitoring before inviting real users.

## Important limitations before production

- Google OAuth is wired through Google Identity Services but requires your own OAuth Web Client ID and authorized origins.
- Voice currently uses browser speech recognition for transcription; it is not Gemini Live streaming and does not provide a system-wide floating Mac overlay.
- Community creation and invite-code joining are persisted; channel messages, realtime transport, moderation, and invite URL routing are not yet implemented.
- Analytics intentionally shows no revenue/order/customer data until a real commerce/analytics connector is authorized.
- File upload, object storage, document parsing, vector search/RAG, scheduled tasks, and native desktop packaging are future phases.
- Add authorization tests, rate limits, audit logs, CSRF protections as appropriate, data deletion/export, and security review before production use.
