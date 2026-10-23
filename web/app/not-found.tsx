import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-24 text-center">
      <p className="text-5xl">🔍</p>
      <h1 className="mt-4 text-2xl font-bold">ไม่พบหุ้นหรือหน้านี้</h1>
      <p className="mt-2 text-zinc-400">เราติดตามเฉพาะหุ้น 40 ตัวใน watchlist</p>
      <Link href="/" className="mt-6 inline-block rounded-lg bg-zinc-800 px-4 py-2 hover:bg-zinc-700">
        ← กลับหน้าแรก
      </Link>
    </main>
  );
}