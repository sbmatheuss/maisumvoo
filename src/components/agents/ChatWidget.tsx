"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send } from "lucide-react";
import { clsx } from "clsx";
import type { ChatMessage } from "@/types";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Olá! Sou o assistente do maisumvoo. Posso ajudar com dúvidas sobre voos, bagagens, check-in e muito mais.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [open, messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/agents/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.data?.content ?? "Não entendi. Pode reformular?" },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Desculpe, houve um erro. Tente novamente em instantes.",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sem conexão com o servidor. Tente novamente.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div
          className="flex flex-col w-80 sm:w-96 h-[500px] bg-ink-900 border border-ink-800 shadow-2xl"
          style={{ borderRadius: "2px" }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-ink-800 shrink-0">
            <span className="font-sans text-sm font-medium text-ink-100">
              Assistente maisumvoo
            </span>
            <button
              onClick={() => setOpen(false)}
              className="text-ink-400 hover:text-ink-100 transition-colors"
              aria-label="Fechar chat"
            >
              <X size={14} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={clsx(
                  "max-w-[85%] px-3 py-2",
                  msg.role === "user"
                    ? "self-end bg-ink-700 text-ink-100"
                    : "self-start bg-ink-800 text-ink-100"
                )}
                style={{ borderRadius: "2px" }}
              >
                <p className="font-sans text-sm leading-relaxed">{msg.content}</p>
              </div>
            ))}
            {loading && (
              <div
                className="self-start bg-ink-800 px-3 py-2 flex gap-1"
                style={{ borderRadius: "2px" }}
              >
                <span className="w-1.5 h-1.5 bg-ink-500 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 bg-ink-500 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 bg-ink-500 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-ink-800 px-3 py-3 flex gap-2 shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua mensagem..."
              disabled={loading}
              className={clsx(
                "flex-1 bg-ink-800 border border-ink-700",
                "text-ink-100 placeholder:text-ink-500",
                "px-3 py-2 text-sm font-sans",
                "outline-none focus:border-gold",
                "transition-colors disabled:opacity-50"
              )}
              style={{ borderRadius: "2px" }}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className={clsx(
                "flex items-center justify-center w-9 h-9 shrink-0",
                "bg-ink-700 text-ink-300",
                "hover:bg-ink-600 hover:text-ink-100",
                "disabled:opacity-30 disabled:cursor-not-allowed",
                "transition-colors"
              )}
              style={{ borderRadius: "2px" }}
              aria-label="Enviar mensagem"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((prev) => !prev)}
        className={clsx(
          "w-12 h-12 flex items-center justify-center",
          "bg-gold text-ink-950",
          "hover:bg-gold-dark transition-colors duration-150",
          "shadow-lg"
        )}
        style={{ borderRadius: "2px" }}
        aria-label={open ? "Fechar assistente" : "Abrir assistente"}
      >
        {open ? <X size={18} /> : <MessageSquare size={18} />}
      </button>
    </div>
  );
}
