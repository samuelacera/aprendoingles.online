"use client";

import { useState, useEffect } from "react";

export default function LessonGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [email, setEmail] = useState("");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("lms_email");
    if (stored) setUnlocked(true);
    setChecking(false);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.includes("@")) {
      localStorage.setItem("lms_email", email);
      setUnlocked(true);
    }
  }

  if (checking) return null;

  if (unlocked) return <>{children}</>;

  return (
    <div className="relative">
      <div className="blur-sm pointer-events-none select-none" aria-hidden="true">
        {children}
      </div>
      <div className="absolute inset-0 flex items-start justify-center pt-12 bg-gradient-to-b from-white/80 via-white/95 to-white">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-blue-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
            Crea tu cuenta gratuita
          </h3>
          <p className="text-sm text-gray-500 text-center mb-6">
            Accede a todas las lecciones gratis. Solo necesitamos tu email para guardar tu progreso.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-primary"
            />
            <button
              type="submit"
              className="w-full bg-blue-primary text-white font-semibold py-3 rounded-lg hover:bg-blue-dark transition-colors"
            >
              Desbloquear lección
            </button>
          </form>
          <p className="text-xs text-gray-400 text-center mt-4">
            Sin spam. Solo guardamos tu progreso.
          </p>
        </div>
      </div>
    </div>
  );
}
