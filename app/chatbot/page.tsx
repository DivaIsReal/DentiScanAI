"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Sparkles,
  Trash2,
  Loader2,
  MessageSquare,
  Activity,
  Stethoscope,
  Apple,
  ShieldCheck,
} from "lucide-react";
import { ChatBubble, TypingBubble } from "@/components/chatbot/chat-bubble";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import type { ChatMessage } from "@/types";

const SUGGESTIONS = [
  { icon: Activity, text: "Apa itu karies?" },
  { icon: ShieldCheck, text: "Cara menjaga kesehatan gigi?" },
  { icon: Stethoscope, text: "Apakah saya harus ke dokter?" },
  { icon: Apple, text: "Makanan yang merusak gigi?" },
];

export default function ChatbotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { push } = useToast();

  // Load history on mount
  useEffect(() => {
    fetch("/api/chat")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data) setMessages(d.data);
      })
      .catch(() => {})
      .finally(() => setInitLoading(false));
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  async function sendMessage(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      });
      const data = await res.json();

      if (data.success) {
        const assistantMsg: ChatMessage = {
          id: data.data.id,
          role: "assistant",
          content: data.data.message,
          createdAt: data.data.createdAt,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        // remove the optimistic user message on failure
        setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
        push({
          type: "error",
          title: "Gagal mengirim pesan",
          description: data.error || "Silakan coba lagi.",
        });
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
      push({
        type: "error",
        title: "Terjadi kesalahan",
        description: "Tidak dapat terhubung ke server.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function clearChat() {
    if (!confirm("Hapus seluruh riwayat percakapan?")) return;
    try {
      await fetch("/api/chat", { method: "DELETE" });
      setMessages([]);
      push({
        type: "success",
        title: "Percakapan dihapus",
      });
    } catch {
      push({ type: "error", title: "Gagal menghapus" });
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const isEmpty = messages.length === 0 && !loading;

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="border-b border-border/50 px-4 lg:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold flex items-center gap-2">
              DentiBot
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h1>
            <p className="text-xs text-muted-foreground">
              AI asisten kesehatan gigi · Online
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearChat}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            <span className="hidden sm:inline">Hapus Chat</span>
          </Button>
        )}
      </div>

      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-thin px-4 lg:px-6 py-6"
      >
        {initLoading ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            <span className="text-sm">Memuat percakapan...</span>
          </div>
        ) : isEmpty ? (
          <EmptyState onSuggestion={sendMessage} />
        ) : (
          <div className="space-y-5 pb-4">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))}
              {loading && <TypingBubble key="typing" />}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-border/50 px-4 lg:px-6 py-4">
        <div className="glass-strong rounded-2xl p-2 flex items-end gap-2 max-w-3xl mx-auto">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Tanyakan sesuatu kepada DentiBot..."
            rows={1}
            disabled={loading}
            className="flex-1 bg-transparent border-0 outline-none resize-none px-3 py-2 text-sm placeholder:text-muted-foreground/70 disabled:opacity-50 scrollbar-thin"
            style={{ maxHeight: "160px" }}
          />
          <Button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            size="icon"
            className="bg-gradient-to-br from-cyan-500 to-sky-600 text-white shrink-0 rounded-xl"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-[10px] text-center text-muted-foreground/60 mt-2">
          DentiBot dapat membuat kesalahan. Tetap konsultasikan dengan dokter
          gigi untuk diagnosis pasti.
        </p>
      </div>
    </div>
  );
}

function EmptyState({
  onSuggestion,
}: {
  onSuggestion: (text: string) => void;
}) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500 to-sky-600 flex items-center justify-center shadow-2xl shadow-cyan-500/30 mb-6"
      >
        <Sparkles className="w-10 h-10 text-white" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-2xl lg:text-3xl font-display font-bold mb-2"
      >
        Halo! Saya <span className="gradient-text">DentiBot</span> 🦷
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-muted-foreground max-w-md mb-8"
      >
        Asisten AI kesehatan gigi Anda. Tanyakan apa saja tentang karies,
        perawatan gigi, atau hasil scan Anda.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl"
      >
        {SUGGESTIONS.map((s, i) => (
          <motion.button
            key={s.text}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + i * 0.05 }}
            onClick={() => onSuggestion(s.text)}
            className="glass rounded-xl p-4 text-left flex items-center gap-3 hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/10 transition-all group"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-sky-500/20 flex items-center justify-center group-hover:from-cyan-500/30 group-hover:to-sky-500/30 transition-colors">
              <s.icon className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            </div>
            <span className="text-sm font-medium">{s.text}</span>
          </motion.button>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex items-center gap-2 text-xs text-muted-foreground/70"
      >
        <MessageSquare className="w-3.5 h-3.5" />
        <span>Pesan Anda akan tersimpan secara aman</span>
      </motion.div>
    </div>
  );
}
