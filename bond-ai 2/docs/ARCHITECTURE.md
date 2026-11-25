# BOND architecture and extension points

## Boundary

- **React client:** presentation, local UI state, microphone permission request, and API calls. It must never contain provider API keys or database credentials.
- **Express API:** authentication, authorization, validation, business logic, AI provider selection, and persistence.
- **Prisma:** database abstraction. SQLite is the local default; PostgreSQL can be selected by changing the Prisma datasource provider and database URL.
- **AI provider interface:** `server/src/providers/types.ts`. Providers implement `reply(messages, agentName, instructions)`; add new model vendors without coupling UI components to vendor APIs.

## Add an AI vendor

1. Implement `AIProvider` in `server/src/providers/`.
2. Add its environment variables to `.env.example`.
3. Add a selection branch in `provider()` in `server/src/index.ts`.
4. Never pass secret keys to the React client.
5. Add provider error handling, timeouts, usage limits, and tests.

## Add a business-data connector

Build each connector as a server-side module with:

- OAuth authorization URL and callback with state/PKCE validation.
- Encrypted token storage scoped to a user and integration.
- Explicit scopes and disconnect/revoke support.
- A normalized data adapter (orders, customers, products, payments, traffic).
- Sync cursor, retry/backoff, rate-limit handling, and audit events.
- Source timestamps and currency/timezone metadata.

Never synthesize sales figures. Analytics queries must return source-backed values or a clear no-data state.

## Multi-tenant rules

Every database query for private resources must be scoped by the authenticated user or by verified community membership. Do not trust user IDs supplied by the browser. Add role checks for owner/admin/member actions before exposing community content.
