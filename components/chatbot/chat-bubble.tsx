"use client";

import { motion } from "framer-motion";
import { Sparkles, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";

interface ChatBubbleProps {
  message: ChatMessage;
  userInitials?: string;
}

export function ChatBubble({ message, userInitials = "U" }: ChatBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn(
        "flex gap-3 w-full",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/20">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[80%] lg:max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "bg-gradient-to-br from-cyan-500 to-sky-600 text-white rounded-tr-md shadow-lg shadow-cyan-500/10"
            : "glass rounded-tl-md"
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        ) : (
          <div className="prose-chat">
            <ReactMarkdown
              components={{
                p: ({ children }) => (
                  <p className="mb-2 last:mb-0 whitespace-pre-wrap">
                    {children}
                  </p>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-cyan-700 dark:text-cyan-300">
                    {children}
                  </strong>
                ),
                ul: ({ children }) => (
                  <ul className="my-2 ml-4 list-disc space-y-1">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="my-2 ml-4 list-decimal space-y-1">
                    {children}
                  </ol>
                ),
                li: ({ children }) => <li className="text-sm">{children}</li>,
                code: ({ children }) => (
                  <code className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 font-mono text-xs">
                    {children}
                  </code>
                ),
                h1: ({ children }) => (
                  <h3 className="font-display font-bold text-base mt-3 mb-1.5 first:mt-0">
                    {children}
                  </h3>
                ),
                h2: ({ children }) => (
                  <h3 className="font-display font-bold text-base mt-3 mb-1.5 first:mt-0">
                    {children}
                  </h3>
                ),
                h3: ({ children }) => (
                  <h4 className="font-display font-semibold text-sm mt-2 mb-1 first:mt-0">
                    {children}
                  </h4>
                ),
                a: ({ children, href }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-600 dark:text-cyan-400 underline underline-offset-2 hover:no-underline"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-navy-600 to-navy-800 dark:from-navy-500 dark:to-navy-700 flex items-center justify-center flex-shrink-0 shadow-lg">
          <span className="text-white text-xs font-semibold">
            {userInitials}
          </span>
        </div>
      )}
    </motion.div>
  );
}

export function TypingBubble() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 justify-start"
    >
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/20">
        <Sparkles className="w-4 h-4 text-white animate-pulse" />
      </div>
      <div className="glass rounded-2xl rounded-tl-md px-5 py-4">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" />
        </div>
      </div>
    </motion.div>
  );
}
