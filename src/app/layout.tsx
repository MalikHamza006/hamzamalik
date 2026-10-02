import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { profile } from "@/lib/content";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hamzamalik.dev"),
  title: {
    default: `${profile.name} — Software Engineer, Full Stack & AI Engineer`,
    template: `%s | ${profile.name}`,
  },
  description:
    "Portfolio of Hamza Malik — Software Engineer, Full Stack Developer, AI Engineer and AI Prompt Engineer building reliable, scalable and intelligent digital products with React, Next.js, Laravel, Django, Node.js and TypeScript.",
  keywords: [
    "Hamza Malik",
    "Software Engineer",
    "Full Stack Developer",
    "AI Engineer",
    "AI Prompt Engineer",
    "React",
    "Next.js",
    "Django",
    "Laravel",
    "Node.js",
    "TypeScript",
  ],
  authors: [{ name: profile.name }],
  creator: profile.name,
  openGraph: {
    type: "website",
    title: `${profile.name} — Software Engineer, Full Stack & AI Engineer`,
    description:
      "Engineering digital products that actually work — full-stack engineering, AI systems and modern web applications.",
    siteName: profile.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — Software Engineer, Full Stack & AI Engineer`,
    description:
      "Engineering digital products that actually work — full-stack engineering, AI systems and modern web applications.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: "#080808",
  colorScheme: "dark" as const,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-ink-950 text-white">
        <div className="relative flex min-h-full flex-col">{children}</div>
      </body>
    </html>
  );
}