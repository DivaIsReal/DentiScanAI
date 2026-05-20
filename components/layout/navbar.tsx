"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Fitur", href: "#features" },
  { label: "Cara Kerja", href: "#how-it-works" },
  { label: "Teknologi", href: "#technology" },
  { label: "FAQ", href: "#faq" },
];

function NavLinks({ scrolled }: { scrolled: boolean }) {
  return (
    <nav className="hidden md:flex items-center gap-1">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "group relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ease-out",
            scrolled
              ? "text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-white/5"
              : "text-foreground/75 hover:text-foreground hover:bg-white/40 dark:hover:bg-white/5"
          )}
        >
          <span>{link.label}</span>
          <span className="absolute inset-x-4 -bottom-0.5 h-px origin-center scale-x-0 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 transition-transform duration-300 group-hover:scale-x-100" />
        </Link>
      ))}
    </nav>
  );
}

function NavActions({ scrolled }: { scrolled: boolean }) {
  return (
    <div className="hidden md:flex items-center gap-3">
      <Button
        variant="ghost"
        size="sm"
        asChild
        className={cn(
          "transition-all duration-300 ease-out",
          scrolled
            ? "text-muted-foreground hover:text-foreground hover:bg-white/55 dark:hover:bg-white/5"
            : "text-foreground/75 hover:text-foreground hover:bg-white/40 dark:hover:bg-white/5"
        )}
      >
        <Link href="/login">Masuk</Link>
      </Button>
      <Button
        size="sm"
        asChild
        className="transition-all duration-300 ease-out shadow-none hover:shadow-[0_18px_40px_rgba(34,211,238,0.22)] hover:scale-[1.02] bg-cyan-600 text-white hover:bg-cyan-500"
      >
        <Link href="/register">Mulai Sekarang</Link>
      </Button>
    </div>
  );
}

function NavbarShell({
  scrolled,
  mobileOpen,
  setMobileOpen,
}: {
  scrolled: boolean;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}) {
  const shellClass = scrolled
    ? cn(
        "relative overflow-hidden border border-white/55 bg-white/72 px-4 py-3 shadow-[0_20px_60px_rgba(15,23,42,0.14)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/70",
        "before:pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/35 before:via-white/10 before:to-white/20 before:opacity-80",
        "rounded-[1.55rem] sm:rounded-full"
      )
    : cn(
        "relative overflow-hidden border border-transparent bg-transparent px-4 py-4 sm:py-5",
        "backdrop-blur-sm"
      );

  return (
    <div
      className={cn(
        shellClass,
        "transition-all duration-500 ease-[0.22,1,0.36,1]"
      )}
    >
      <div className="relative z-10 flex items-center justify-between gap-4">
        <Logo />

        <NavLinks scrolled={scrolled} />

        <NavActions scrolled={scrolled} />

        <button
          className={cn(
            "md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ease-out",
            scrolled
              ? "bg-white/65 text-foreground shadow-sm ring-1 ring-white/60 dark:bg-white/5 dark:ring-white/10"
              : "bg-white/40 text-foreground/80 ring-1 ring-white/40 dark:bg-white/5 dark:ring-white/10"
          )}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden border-t border-white/30 pt-3 mt-3 bg-white/30 dark:bg-white/5 backdrop-blur-xl"
          >
            <div className="flex flex-col gap-2 pb-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm font-medium rounded-xl text-muted-foreground transition-all duration-300 hover:text-foreground hover:bg-white/60 dark:hover:bg-white/5"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" asChild>
                  <Link href="/login">Masuk</Link>
                </Button>
                <Button className="flex-1" asChild>
                  <Link href="/register">Mulai Sekarang</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let frame = 0;

    const updateScrolledState = () => {
      frame = 0;
      setScrolled(window.scrollY > 24);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateScrolledState);
    };

    updateScrolledState();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  useEffect(() => {
    if (scrolled) {
      setMobileOpen(false);
    }
  }, [scrolled]);

  return (
    <>
      <header className="relative z-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{
              opacity: scrolled ? 0 : 1,
              y: scrolled ? -8 : 0,
              scale: scrolled ? 0.985 : 1,
            }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none"
            aria-hidden={scrolled}
          >
            <div className="pointer-events-auto">
              <NavbarShell
                scrolled={false}
                mobileOpen={mobileOpen && !scrolled}
                setMobileOpen={setMobileOpen}
              />
            </div>
          </motion.div>
        </div>
      </header>

      <AnimatePresence>
  {scrolled && (
    <motion.div
      layout
      layoutId="navbar"
      initial={{ opacity: 0, y: -16, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.99 }}
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1]
      }}
      className="fixed inset-x-0 top-5 z-50 flex justify-center px-4"
    >
      <div
        className="
          w-full
          max-w-[1280px]
          rounded-full
          border border-white/30
          bg-white/70
          backdrop-blur-xl
          shadow-[0_10px_40px_rgba(0,0,0,0.08)]
        "
      >
        <NavbarShell
          scrolled
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />
      </div>
    </motion.div>
  )}
</AnimatePresence>
    </>
  );
}
