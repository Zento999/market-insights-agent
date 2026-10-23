import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Market Insights",
  description: "สรุปตลาดหุ้นเทคอเมริกาด้วย AI",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="th"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <nav className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl items-center gap-6 px-4 py-3 text-sm">
            <Link href="/" className="font-semibold">📈 Market Insights</Link>
            <Link href="/" className="text-zinc-400 hover:text-zinc-100">หน้าแรก</Link>
            <Link href="/news" className="text-zinc-400 hover:text-zinc-100">ข่าว</Link>
            <Link href="/ask" className="text-zinc-400 hover:text-zinc-100">ถาม AI</Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}