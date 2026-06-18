"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Plane } from "lucide-react";
import { clsx } from "clsx";
import type { ChatMessage } from "@/types";

const QUICK_CHIPS = [
  "Calcular milhas GRU → MIA economy",
  "Cancelar minha reserva",
  "Comparar programas de milhas",
];

function renderWithHighlights(text: string): React.ReactNode {
  const parts = text.split(/(\b\d[\d.,]{2,}\b)/g);
  return parts.map((part, i) => {
    const num = parseFloat(part.replace(/\./g, "").replace(",", "."));
    if (!isNaN(num) && num >= 1000) {
      return (
        <span key={i} className="text-gold font-medium">
          {part}
        </span>
      );
    }
    return part;
  });
}

interface MilesWidgetProps {
  bookingId?: string;
}

export default function MilesWidget({ bookingId }: MilesWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Olá! Sou a Milha, sua especialista em programas de fidelidade. Posso calcular milhas por rota, comparar programas (LATAM Pass, Smiles, Azul Fidelidade, TudoAzul) e também cancelar reservas. Como posso ajudar?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMsg: ChatMessage = { role: "user", content };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/agents/miles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          bookingId,
        }),
      });

      if (!res.ok || !res.body) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Desculpe, houve um erro. Tente novamente em instantes.",
          },
        ]);
        return;
      }

      // Adiciona mensagem assistente vazia e vai preenchendo com chunks
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: accumulated,
          };
          return updated;
        });
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
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col h-[600px] bg-ink-900 border border-ink-800" style={{ borderRadius: "2px" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-ink-800 shrink-0">
        <div className="w-7 h-7 bg-gold/15 flex items-center justify-center shrink-0" style={{ borderRadius: "2px" }}>
          <Plane size={13} strokeWidth={1.5} className="text-gold" />
        </div>
        <div>
          <p className="font-sans text-sm font-medium text-ink-100">Milha</p>
          <p className="font-sans text-[10px] uppercase tracking-widest text-ink-500">
            Especialista em milhas
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
          <span className="font-sans text-[10px] text-ink-500">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={clsx(
              "max-w-[88%] px-4 py-3",
              msg.role === "user"
                ? "self-end bg-ink-700 text-ink-100"
                : "self-start bg-ink-800 text-ink-100"
            )}
            style={{ borderRadius: "2px" }}
          >
            <p className="font-sans text-sm leading-relaxed whitespace-pre-wrap">
              {msg.role === "assistant"
                ? renderWithHighlights(msg.content)
                : msg.content}
            </p>
          </div>
        ))}

        {/* Quick action chips — só na mensagem inicial */}
        {messages.length === 1 && !loading && (
          <div className="self-start flex flex-wrap gap-2 mt-1">
            {QUICK_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => handleSend(chip)}
                className="font-sans text-xs text-ink-400 border border-ink-700 px-3 py-1.5 hover:border-gold hover:text-gold transition-colors duration-150"
                style={{ borderRadius: "2px" }}
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* Indicador de digitação */}
        {loading && (
          <div
            className="self-start bg-ink-800 px-4 py-3 flex gap-1.5 items-center"
            style={{ borderRadius: "2px" }}
          >
            <span className="w-1.5 h-1.5 bg-ink-500 rounded-full animate-bounce [animation-delay:0ms]" />
            <span className="w-1.5 h-1.5 bg-ink-500 rounded-full animate-bounce [animation-delay:150ms]" />
            <span className="w-1.5 h-1.5 bg-ink-500 rounded-full animate-bounce [animation-delay:300ms]" />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-ink-800 px-3 py-3 flex gap-2 shrink-0">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Pergunte sobre milhas ou informe o código da reserva..."
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
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className={clsx(
            "flex items-center justify-center w-9 h-9 shrink-0",
            "bg-ink-700 text-ink-300",
            "hover:bg-gold hover:text-ink-950",
            "disabled:opacity-30 disabled:cursor-not-allowed",
            "transition-colors duration-150"
          )}
          style={{ borderRadius: "2px" }}
          aria-label="Enviar mensagem"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}
