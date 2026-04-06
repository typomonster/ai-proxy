"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send } from "lucide-react";

export default function Chat() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState("");

  const isLoading = status === "streaming" || status === "submitted";

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  }

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">
        AI Proxy Chat Demo
      </h1>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 p-4">
          {messages.length === 0 && (
            <p className="text-center text-muted-foreground mt-8">
              Send a message to start chatting with Gemini 2.5 Flash.
            </p>
          )}
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      AI
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] whitespace-pre-wrap ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.parts
                    .filter((part) => part.type === "text")
                    .map((part, i) => (
                      <span key={i}>{part.text}</span>
                    ))}
                </div>
                {message.role === "user" && (
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="text-xs">You</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <form onSubmit={onSubmit} className="flex gap-2 p-4 border-t">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading || !input}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </Card>
    </div>
  );
}
