"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Plane, Loader2, TrendingDown, Calendar } from "lucide-react";
import FlightResults from "@/components/FlightResults";
import VacationResults from "@/components/VacationResults";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  intent?: { type: string };
  results?: Record<string, unknown>;
  loading?: boolean;
}

const EXAMPLE_PROMPTS = [
  "我想去韓國，今年底前哪個時間最便宜？",
  "我 8/10 到 8/15 有假期，去哪裡最划算？",
  "我想去日本玩 5 天，最便宜什麼時候出發？",
  "十一月我有一週假期，東南亞哪裡CP值最高？",
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "嗨！我是你的旅遊助理 ✈️ 告訴我你想去哪裡，或者你的假期時間，我幫你找最便宜的機票！",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text?: string) {
    const msg = text || input.trim();
    if (!msg || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: msg };
    const loadingMsg: Message = {
      id: Date.now().toString() + "-loading",
      role: "assistant",
      content: "搜尋中...",
      loading: true,
    };
    setMessages((prev) => [...prev, userMsg, loadingMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();

      const assistantMsg: Message = {
        id: Date.now().toString() + "-reply",
        role: "assistant",
        content: data.summary || data.error || "抱歉，搜尋失敗了，請再試一次。",
        intent: data.intent,
        results: data.results,
      };
      setMessages((prev) => prev.filter((m) => !m.loading).concat(assistantMsg));
    } catch {
      setMessages((prev) =>
        prev.filter((m) => !m.loading).concat({
          id: Date.now().toString(),
          role: "assistant",
          content: "網路錯誤，請稍後再試。",
        })
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2 rounded-xl">
            <Plane size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Travel Maker</h1>
            <p className="text-sm text-gray-500">AI 機票比價助理 × Google Flights</p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 flex flex-col gap-4">
        {messages.length === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {EXAMPLE_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => sendMessage(p)}
                className="text-left p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all text-sm text-gray-700"
              >
                {p.includes("假期") ? (
                  <Calendar size={16} className="inline mr-2 text-blue-500" />
                ) : (
                  <TrendingDown size={16} className="inline mr-2 text-green-500" />
                )}
                {p}
              </button>
            ))}
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-white shadow-sm text-gray-800 rounded-bl-sm"
              }`}
            >
              {msg.loading ? (
                <div className="flex items-center gap-2 text-gray-500">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-sm">正在搜尋 Google Flights...</span>
                </div>
              ) : (
                <>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  {msg.intent?.type === "destination_search" && msg.results && (
                    <FlightResults data={msg.results as never} />
                  )}
                  {msg.intent?.type === "vacation_search" && msg.results && (
                    <VacationResults data={msg.results as never} />
                  )}
                </>
              )}
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </main>

      <footer className="bg-white border-t sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="例：我想去峇里島，這半年哪個時間最便宜？"
              className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm"
              disabled={loading}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-3 rounded-2xl transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            由 Claude AI + Google Flights 提供即時比價
          </p>
        </div>
      </footer>
    </div>
  );
}
