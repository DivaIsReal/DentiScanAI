"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
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
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { ChatBubble, TypingBubble } from "@/components/chatbot/chat-bubble";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ChatMessage, ScanResult } from "@/types";

const SUGGESTIONS = [
  { icon: Activity, text: "Apa itu karies?" },
  { icon: ShieldCheck, text: "Cara menjaga kesehatan gigi?" },
  { icon: Stethoscope, text: "Apakah saya harus ke dokter?" },
  { icon: Apple, text: "Makanan yang merusak gigi?" },
];

export default function ChatbotPage() {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // Load scan result if scanId provided
  useEffect(() => {
    if (!searchParams) {
      console.log("⚠️ searchParams not ready yet");
      return;
    }

    const scanId = searchParams.get("scanId");
    console.log("🔍 Current URL:", window.location.href);
    console.log("🔍 scanId from params:", scanId);

    if (!scanId) {
      console.log("⚠️ No scanId in URL");
      return;
    }

    console.log("📡 Fetching scan:", scanId);
    fetch(`/api/scan/${scanId}`)
      .then((r) => {
        console.log("📡 Response status:", r.status);
        return r.json();
      })
      .then((d) => {
        console.log("📡 Response data:", d);
        if (d.success && d.data) {
          console.log("✅ Scan loaded successfully:", d.data);
          setScanResult(d.data);
        } else {
          console.warn("⚠️ Response not success:", d.error);
          toast("error", d.error || "Gagal memuat hasil scan");
        }
      })
      .catch((err) => {
        console.error("❌ Fetch error:", err);
        toast("error", "Gagal memuat hasil scan: " + err.message);
      });
  }, [searchParams, toast]);

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
        toast(
          "error",
          data.error || "Gagal mengirim pesan. Silakan coba lagi."
        );
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
      toast(
        "error",
        "Terjadi kesalahan. Tidak dapat terhubung ke server."
      );
    } finally {
      setLoading(false);
    }
  }

  async function clearChat() {
    if (!confirm("Hapus seluruh riwayat percakapan?")) return;
    try {
      await fetch("/api/chat", { method: "DELETE" });
      setMessages([]);
      toast("success", "Percakapan dihapus");
    } catch {
      toast("error", "Gagal menghapus percakapan");
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const isEmpty = messages.length === 0 && !loading;

  function sendScanResultToChat() {
    if (!scanResult) return;

    const scanMessage = `Hasil scan terbaru saya: ${scanResult.conditions.find((c) => c.detected)?.name || "Healthy"} (${scanResult.overallScore}%). Confidence: ${scanResult.confidenceScore}%. Detail: ${scanResult.summary}. Rekomendasi: ${scanResult.recommendation}`;

    sendMessage(scanMessage);
  }

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
        ) : (
          <div className="space-y-5 pb-4">
            {/* Scan result card if available */}
            {scanResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-6 space-y-5 shadow-lg border border-cyan-500/20"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-500" />
                      Hasil Scan Terbaru
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Confidence {scanResult.confidenceScore}%
                    </p>
                  </div>
                  <Badge
                    variant={
                      scanResult.urgency === "high"
                        ? "destructive"
                        : scanResult.urgency === "medium"
                          ? "warning"
                          : "success"
                    }
                  >
                    {scanResult.urgency === "high"
                      ? "High Risk"
                      : scanResult.urgency === "medium"
                        ? "Medium Risk"
                        : "Low Risk"}
                  </Badge>
                </div>

                {/* Score ring + conditions */}
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-muted/30"
                      />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="url(#scoreGradient)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${(scanResult.overallScore / 100) * 264} 264`}
                        initial={{ strokeDasharray: "0 264" }}
                        animate={{
                          strokeDasharray: `${(scanResult.overallScore / 100) * 264} 264`,
                        }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                      <defs>
                        <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#22d3ee" />
                          <stop offset="100%" stopColor="#0284c7" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-xl font-bold gradient-text font-display">
                        {scanResult.overallScore}%
                      </div>
                      <div className="text-[9px] text-muted-foreground uppercase tracking-wider">
                        {scanResult.conditions.find((c) => c.detected)?.name || "Healthy"}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-3">
                    {scanResult.conditions
                      .filter((c) => c.name !== "Gusi Sehat")
                      .map((cond) => (
                        <div key={cond.name}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium flex items-center gap-2">
                              <span
                                className={cn(
                                  "w-1.5 h-1.5 rounded-full",
                                  cond.detected ? "bg-red-500" : "bg-emerald-500"
                                )}
                              />
                              {cond.name}
                            </span>
                            <span className="text-xs font-semibold tabular-nums">
                              {cond.confidence}%
                            </span>
                          </div>
                          <Progress
                            value={cond.confidence}
                            indicatorClassName={cn(
                              cond.detected
                                ? cond.confidence >= 80
                                  ? "from-red-500 to-rose-500 bg-gradient-to-r"
                                  : "from-amber-500 to-orange-500 bg-gradient-to-r"
                                : "from-emerald-500 to-teal-500 bg-gradient-to-r"
                            )}
                          />
                        </div>
                      ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="rounded-xl bg-cyan-500/5 border border-cyan-500/15 p-4">
                  <div className="text-sm space-y-2">
                    <div className="font-semibold text-cyan-700 dark:text-cyan-300">
                      Ringkasan
                    </div>
                    <p className="text-foreground/90 text-sm">{scanResult.summary}</p>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="rounded-xl bg-blue-500/5 border border-blue-500/15 p-4">
                  <div className="text-sm space-y-2">
                    <div className="font-semibold text-blue-700 dark:text-blue-300">
                      Rekomendasi
                    </div>
                    <p className="text-foreground/90 text-sm">{scanResult.recommendation}</p>
                  </div>
                </div>

                {/* Send to chat button */}
                <Button
                  onClick={sendScanResultToChat}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Kirim ke Chat
                </Button>
              </motion.div>
            )}

            {messages.length === 0 && !scanResult ? (
              <EmptyState onSuggestion={sendMessage} />
            ) : (
              <>
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <ChatBubble key={msg.id} message={msg} />
                  ))}
                  {loading && <TypingBubble key="typing" />}
                </AnimatePresence>
              </>
            )}
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
