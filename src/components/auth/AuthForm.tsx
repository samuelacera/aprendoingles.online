"use client";

import Link from "next/link";
import { login, register } from "@/app/auth/actions";

interface AuthFormProps {
  mode: "login" | "register";
  redirectTo?: string;
}

export default function AuthForm({ mode, redirectTo }: AuthFormProps) {
  const isLogin = mode === "login";

  return (
    <div className="bg-ink-elevated border border-white/10 rounded-2xl p-8">
      <div className="space-y-3 mb-6">
        <div className="relative">
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="w-full flex items-center justify-center gap-3 border border-white/10 rounded-lg px-4 py-3 text-sm font-medium text-cream/40 cursor-not-allowed bg-white/5"
          >
            <svg className="w-5 h-5 opacity-40" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continuar con Google
          </button>
          <span className="absolute top-1/2 -translate-y-1/2 right-3 text-[10px] font-semibold uppercase tracking-wide bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
            Próximamente
          </span>
        </div>
        <div className="relative">
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium text-gray-400 cursor-not-allowed bg-gray-50"
          >
            <svg className="w-5 h-5 opacity-40" viewBox="0 0 24 24" fill="#0A66C2">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            Continuar con LinkedIn
          </button>
          <span className="absolute top-1/2 -translate-y-1/2 right-3 text-[10px] font-semibold uppercase tracking-wide bg-white/10 text-cream/50 px-2 py-0.5 rounded-full">
            Próximamente
          </span>
        </div>
      </div>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-ink-elevated px-4 text-sm text-cream/40">o con email</span>
        </div>
      </div>

      <form action={isLogin ? login : register} className="space-y-4">
        <input type="hidden" name="redirectTo" value={redirectTo || "/mi-cuenta"} />

        {!isLogin && (
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-cream/80 mb-1">
              Nombre completo
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              className="w-full bg-ink border border-white/15 text-cream placeholder:text-cream/30 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-gold/60 focus:border-transparent outline-none transition-shadow"
              placeholder="Tu nombre"
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-cream/80 mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full bg-ink border border-white/15 text-cream placeholder:text-cream/30 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-gold/60 focus:border-transparent outline-none transition-shadow"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-cream/80 mb-1">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            className="w-full bg-ink border border-white/15 text-cream placeholder:text-cream/30 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-gold/60 focus:border-transparent outline-none transition-shadow"
            placeholder={isLogin ? "Tu contraseña" : "Mínimo 6 caracteres"}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gold text-ink font-semibold py-3 rounded-lg hover:bg-gold-light transition-colors text-sm"
        >
          {isLogin ? "Iniciar sesión" : "Crear cuenta"}
        </button>
      </form>

      <p className="text-center text-sm text-cream/50 mt-6">
        {isLogin ? (
          <>
            ¿No tienes cuenta?{" "}
            <Link href="/registro" className="text-gold hover:text-gold-light font-medium">
              Regístrate gratis
            </Link>
          </>
        ) : (
          <>
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-gold hover:text-gold-light font-medium">
              Inicia sesión
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
