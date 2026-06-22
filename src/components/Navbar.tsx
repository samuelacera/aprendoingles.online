"use client";

import { useState } from "react";
import Link from "next/link";

const courses = [
  { name: "Business English", href: "/cursos/business" },
  { name: "Marketing English", href: "/cursos/marketing" },
  { name: "Sales English", href: "/cursos/sales" },
  { name: "Tech English", href: "/cursos/tech" },
  { name: "Psychology English", href: "/cursos/psychology" },
  { name: "Finance English", href: "/cursos/finance" },
  { name: "Legal English", href: "/cursos/legal" },
  { name: "Medical English", href: "/cursos/medical" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-primary">aprendo</span>
            <span className="text-2xl font-bold text-foreground">ingles.online</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <div
              className="relative"
              onMouseEnter={() => setOpen(true)}
              onMouseLeave={() => setOpen(false)}
            >
              <button className="text-sm font-medium text-gray-700 hover:text-blue-primary flex items-center gap-1">
                Cursos
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {open && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2">
                  {courses.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-primary"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link href="/metodo" className="text-sm font-medium text-gray-700 hover:text-blue-primary">
              Metodo
            </Link>
            <Link href="/blog" className="text-sm font-medium text-gray-700 hover:text-blue-primary">
              Blog
            </Link>
            <Link
              href="#test-nivel"
              className="bg-blue-primary text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-dark transition-colors"
            >
              Test tu nivel gratis
            </Link>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
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

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase">Cursos</p>
          {courses.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="block text-sm text-gray-700 hover:text-blue-primary pl-2"
              onClick={() => setMobileOpen(false)}
            >
              {c.name}
            </Link>
          ))}
          <hr className="border-gray-100" />
          <Link href="/metodo" className="block text-sm text-gray-700 hover:text-blue-primary">
            Metodo
          </Link>
          <Link href="/blog" className="block text-sm text-gray-700 hover:text-blue-primary">
            Blog
          </Link>
          <Link
            href="#test-nivel"
            className="block text-center bg-blue-primary text-white text-sm font-semibold px-5 py-2.5 rounded-lg"
          >
            Test tu nivel gratis
          </Link>
        </div>
      )}
    </nav>
  );
}
