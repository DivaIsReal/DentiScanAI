"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface TipsAccordionProps {
  tips?: string[];
}

const DEFAULT_TIPS = [
  "Gunakan pencahayaan yang cukup dan merata",
  "Buka mulut lebar dan arahkan kamera ke gigi",
  "Pastikan foto tidak buram atau gelap",
  "Format yang didukung: JPG, PNG, WebP (maks 10MB)",
];

export function TipsAccordion({ tips = DEFAULT_TIPS }: TipsAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-start gap-4 p-6 hover:bg-white/5 transition-colors text-left"
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-600 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">Tips untuk hasil terbaik</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isOpen ? "Sembunyikan tips" : "Tampilkan tips"}
          </p>
        </div>
        <ChevronDown
          className={cn(
            "w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-300",
            isOpen && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-white/5">
              <ul className="space-y-2">
                {tips.map((tip, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="text-sm text-muted-foreground flex items-start gap-3"
                  >
                    <span className="text-cyan-500 font-bold flex-shrink-0 mt-0.5">•</span>
                    <span>{tip}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
