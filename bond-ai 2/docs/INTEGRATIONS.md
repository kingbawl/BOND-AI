# Integrations roadmap

No third-party service is marked connected by default. The UI is a setup surface, not a fake OAuth flow.

Suggested sequence:

1. Shopify Admin OAuth — orders, products, customers.
2. Stripe restricted API key/OAuth — payments, subscriptions, refunds.
3. Google Analytics 4 OAuth — sessions, traffic sources, conversions.
4. Gmail and Google Drive OAuth — only requested scopes, user-authorized access.
5. Slack/Discord — workspace bot or OAuth with explicit channel permissions.

For each connector, register a callback URL, validate OAuth `state`, encrypt refresh tokens at rest, request minimum scopes, implement disconnect/revoke, and log access. Keep client secrets in the backend environment/secret manager. Never claim a service is connected until the provider confirms authorization.
