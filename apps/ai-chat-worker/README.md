# Fujipp AI Chat Worker

Cloudflare Worker backend for the Fujipp AI chat widget. It keeps the OpenRouter API key server-side and exposes a small `POST` endpoint for the frontend.

## Why Cloudflare Workers

Cloudflare Workers has a free plan suitable for this portfolio chatbot: 100,000 requests per day, 10 ms CPU time per request, 128 MB memory, and environment secrets. The Worker mostly waits for OpenRouter over `fetch()`, so it is a good fit.

## Setup

```bash
cd apps/ai-chat-worker
npm install
npm run secret:openrouter
npm run deploy
```

When prompted by `secret:openrouter`, paste your OpenRouter API key.

## Frontend env

Set this in `apps/frontend/fujipp-frontend/.env.local`:

```bash
VITE_CHAT_API_URL=https://fujipp-ai-chat.<your-cloudflare-subdomain>.workers.dev
```

If `VITE_CHAT_API_URL` is not set, the frontend uses a local preview reply so development and builds still work without secrets.

## Recommended production setting

In `wrangler.jsonc`, keep your production and local frontend origins:

```jsonc
"ALLOWED_ORIGINS": "https://www.fujipp.com,http://localhost:5173,http://127.0.0.1:5173"
```

After changing `ALLOWED_ORIGINS`, redeploy the Worker:

```bash
npm run deploy
```
