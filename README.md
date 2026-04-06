# ai-proxy

Drop-in SDK replacements for [Vercel AI SDK](https://sdk.vercel.ai/) that route requests through the TypoMonster Chat proxy. Swap one import, add your API key, and get unified token tracking, automatic prefix caching, and rate limiting.

## Packages

| Package | Description |
|---------|-------------|
| `@ai-proxy/core` | Base proxy fetch wrapper — works with any `@ai-sdk/*` provider |
| `@ai-proxy/google` | Drop-in replacement for `@ai-sdk/google` |

## Install

```bash
npm install https://github.com/typomonster/ai-proxy/releases/download/v0.1.0/ai-proxy-core-0.1.0.tgz
npm install https://github.com/typomonster/ai-proxy/releases/download/v0.1.0/ai-proxy-google-0.1.0.tgz
```

## Quick Start

### `@ai-proxy/google` (Recommended)

The simplest integration — one import change from `@ai-sdk/google`:

```typescript
import { createProxyGoogle } from "@ai-proxy/google";
import { generateText } from "ai";

const google = createProxyGoogle({
  apiKey: "tmk_your_api_key",
  contextKey: "my-chat-session-123", // optional, improves cache hits
});

const { text } = await generateText({
  model: google("gemini-2.5-flash"),
  prompt: "Hello!",
});

console.log(text);
```

#### What changed from `@ai-sdk/google`

```diff
- import { createGoogleGenerativeAI } from "@ai-sdk/google";
+ import { createProxyGoogle } from "@ai-proxy/google";
  import { generateText } from "ai";

- const google = createGoogleGenerativeAI({
-   apiKey: "YOUR_GOOGLE_API_KEY",
+ const google = createProxyGoogle({
+   apiKey: "tmk_your_api_key",
+   contextKey: "my-chat-session-123", // optional, improves cache hits
  });

  // Everything below stays exactly the same
  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    prompt: "Hello!",
  });
```

### `@ai-proxy/core` (Any Provider)

Use `createProxyFetch` with any Vercel AI SDK provider:

```typescript
import { createProxyFetch } from "@ai-proxy/core";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

const proxyFetch = createProxyFetch({
  apiKey: "tmk_your_api_key",
  contextKey: "my-chat-session-123", // optional, improves cache hits
});

const google = createGoogleGenerativeAI({
  fetch: proxyFetch,
  apiKey: "proxy-managed",
});

const { text } = await generateText({
  model: google("gemini-2.5-flash"),
  prompt: "Hello!",
});
```

## Context Keys

The optional `contextKey` parameter groups related requests to improve Gemini's prefix cache hit rate. Cached input tokens are billed at a 75% discount.

Good choices for context keys:

| Use Case | Context Key | Why |
|----------|------------|-----|
| Chat app | Session/conversation ID | Messages in a conversation share the same prefix |
| Coding assistant | `"coding-assistant-v2"` | Same system prompt across users |
| Batch processing | Job or batch ID | Related requests share context |

If no context key is provided, the proxy derives one from the first two messages automatically.

## Demo

A full working chat app is available in [`demo/nextjs/`](./demo/nextjs) — a Next.js app with streaming Gemini 2.5 Flash responses and a shadcn/ui chat interface.

```bash
cd demo/nextjs
cp .env.local.example .env.local   # add your API key
npm install
npm run dev
```

## API Access

To get an API key, contact [help@wordbricks.ai](mailto:help@wordbricks.ai).

## License

MIT
