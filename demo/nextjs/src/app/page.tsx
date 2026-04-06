"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowUp, Bot, Sparkles } from "lucide-react";

export default function Chat() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-center gap-2 border-b px-4 py-3 shrink-0">
        <Sparkles className="size-4 text-primary" />
        <h1 className="text-sm font-medium">
          AI Proxy Demo{" "}
          <span className="text-muted-foreground font-normal">
            &mdash; Gemini 2.5 Flash
          </span>
        </h1>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 px-4">
            <div className="flex items-center justify-center size-12 rounded-2xl bg-primary/10">
              <Bot className="size-6 text-primary" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-medium">Ask me anything</p>
              <p className="text-xs text-muted-foreground">
                Powered by Gemini 2.5 Flash
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
            {messages.map((message) =>
              message.role === "user" ? (
                <div key={message.id} className="flex justify-end gap-3">
                  <div className="rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-primary-foreground text-sm max-w-[80%] whitespace-pre-wrap leading-relaxed">
                    {message.parts
                      .filter((part) => part.type === "text")
                      .map((part, i) => (
                        <span key={i}>{part.text}</span>
                      ))}
                  </div>
                </div>
              ) : (
                <div key={message.id} className="flex gap-3">
                  <Avatar className="size-7 shrink-0 mt-0.5">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      <Sparkles className="size-3.5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-2xl rounded-tl-md bg-muted px-4 py-2.5 text-sm max-w-[80%] whitespace-pre-wrap leading-relaxed">
                    {message.parts
                      .filter((part) => part.type === "text")
                      .map((part, i) => (
                        <span key={i}>{part.text}</span>
                      ))}
                  </div>
                </div>
              ),
            )}
            {isLoading &&
              messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex gap-3">
                  <Avatar className="size-7 shrink-0 mt-0.5">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      <Sparkles className="size-3.5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-2xl rounded-tl-md bg-muted px-4 py-3">
                    <div className="flex gap-1">
                      <span className="size-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
                      <span className="size-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
                      <span className="size-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 border-t bg-background">
        <form
          onSubmit={onSubmit}
          className="max-w-2xl mx-auto flex items-center gap-2 px-4 py-3"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            disabled={isLoading}
            className="flex-1 h-10 rounded-xl px-4 text-sm"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className="size-10 rounded-xl shrink-0"
          >
            <ArrowUp className="size-4" />
          </Button>
        </form>
        <p className="text-center text-[10px] text-muted-foreground pb-2">
          Powered by @typochat-sdk/google
        </p>
      </div>
    </div>
  );
}
