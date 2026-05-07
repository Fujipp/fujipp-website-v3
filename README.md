# Fujipp Website

## AI Chat Bot

This repo includes a Fujipp AI chat widget in the frontend and a Cloudflare Worker backend in `apps/ai-chat-worker`.

- Frontend env: `VITE_CHAT_API_URL`
- Backend secret: `OPENROUTER_API_KEY`
- Default model: `openrouter/free`

The API key must stay in the Worker secret, not in frontend env files. For free backend hosting, Cloudflare Workers is recommended for this chatbot because the free plan includes 100,000 requests per day and is enough for a portfolio assistant.
