import { createProxyGoogle } from "@ai-proxy/google";
import { streamText } from "ai";

const google = createProxyGoogle({
  apiKey: process.env.TYPOMONSTER_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google("gemini-2.5-flash"),
    messages,
  });

  return result.toUIMessageStreamResponse();
}
