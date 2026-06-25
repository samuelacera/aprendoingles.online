"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur border-line"
          : "bg-background border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-1.5">
            <span className="text-xl font-bold text-foreground tracking-tight">aprendo</span>
            <span className="text-xl font-bold text-gold tracking-tight">inglés</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <div
              className="relative"
              onMouseEnter={() => setOpen(true)}
              onMouseLeave={() => setOpen(false)}
            >
              <button className="text-sm font-medium text-foreground/80 hover:text-foreground flex items-center gap-1 transition-colors">
                Cursos
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {open && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-surface-2 rounded-lg shadow-2xl border border-line py-2">
                  <Link href="/cursos" className="block px-4 py-2 text-sm font-medium text-gold hover:bg-overlay">
                    Ver todos los cursos
                  </Link>
                  <hr className="my-1 border-line" />
                  {[
                    ["Negocios", "negocios"],
                    ["Marketing", "marketing"],
                    ["Ventas", "ventas"],
                    ["Tecnología", "tecnologia"],
                    ["Finanzas", "finanzas"],
                    ["Derecho", "derecho"],
                  ].map(([label, slug]) => (
                    <Link key={slug} href={`/cursos#${slug}`} className="block px-4 py-2 text-sm text-foreground/70 hover:bg-overlay hover:text-foreground">
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link href="/blog" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              Blog
            </Link>

            <ThemeToggle />

            {user ? (
              <Link
                href="/mi-cuenta"
                className="flex items-center gap-2 bg-gold text-ink text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-gold-light transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Mi cuenta
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
                  Iniciar sesión
                </Link>
                <Link
                  href="/registro"
                  className="bg-gold text-ink text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-gold-light transition-colors"
                >
                  Empezar ahora
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center gap-1">
            <ThemeToggle />
            <button
              className="p-2 text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menú"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-line bg-background px-4 py-4 space-y-3">
          <Link href="/cursos" className="block text-sm font-medium text-gold" onClick={() => setMobileOpen(false)}>
            Todos los cursos
          </Link>
          <Link href="/blog" className="block text-sm text-foreground/80 hover:text-foreground" onClick={() => setMobileOpen(false)}>
            Blog
          </Link>
          <hr className="border-line" />
          {user ? (
            <Link
              href="/mi-cuenta"
              className="block text-center bg-gold text-ink text-sm font-semibold px-5 py-2.5 rounded-full"
              onClick={() => setMobileOpen(false)}
            >
              Mi cuenta
            </Link>
          ) : (
            <>
              <Link href="/login" className="block text-center text-sm font-medium text-foreground/80 py-2" onClick={() => setMobileOpen(false)}>
                Iniciar sesión
              </Link>
              <Link
                href="/registro"
                className="block text-center bg-gold text-ink text-sm font-semibold px-5 py-2.5 rounded-full"
                onClick={() => setMobileOpen(false)}
              >
                Empezar ahora
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
