import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "aprendoingles.online | Inglés profesional especializado por sector",
    template: "%s | aprendoingles.online",
  },
  description:
    "Cursos de inglés especializados para profesionales: Business, Marketing, Sales, Tech, Finance, Legal, Medical y más. Aprende el inglés que tu carrera necesita.",
  metadataBase: new URL("https://aprendoingles-online.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "aprendoingles.online",
    title: "aprendoingles.online | Inglés profesional especializado por sector",
    description:
      "Más de 100 cursos de inglés especializados por sector profesional. Aprende el inglés exacto que tu carrera necesita.",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
