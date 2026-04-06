import { createProxyGoogle } from "@typochat-sdk/google";
import { streamText, convertToModelMessages } from "ai";

const google = createProxyGoogle({
  apiKey: process.env.TYPOMONSTER_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google(process.env.GEMINI_MODEL ?? "gemini-2.5-flash"),
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
