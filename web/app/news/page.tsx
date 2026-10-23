import Form from "next/form";
import Link from "next/link";
import { getLatestNews, searchNews, type NewsListItem } from "@/lib/queries";
import { embed } from "@/lib/embed";
import { formatDateTh } from "@/lib/format";

// ข่าว 1 ชิ้น
function NewsCard({ n }: { n: NewsListItem }) {
  const relevance = n.distance === null ? null : Math.round((1 - n.distance) * 100);

  return (
    <div className="px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <a href={n.url} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">
          {n.title}
        </a>
        {relevance !== null && (
          <span className="shrink-0 rounded-md bg-sky-950 px-2 py-0.5 text-xs text-sky-300">
            ตรง {relevance}%
          </span>
        )}
      </div>
      {n.summary && <p className="mt-1 text-sm text-zinc-400">{n.summary}…</p>}
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
        <span>{n.source} · {formatDateTh(n.published_date)}</span>
        {n.symbols?.map((sym) => (
          <Link key={sym} href={`/stocks/${sym}`} className="rounded-md bg-zinc-800 px-1.5 py-0.5 text-zinc-300 hover:bg-zinc-700">
            {sym}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim() : "";

  // มีคำค้น → ค้นด้วยความหมาย / ไม่มี → ข่าวล่าสุด
  const news = query ? await searchNews(await embed(query)) : await getLatestNews();

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold">📰 ข่าว</h1>
      <p className="mt-1 text-sm text-zinc-400">ค้นด้วยความหมาย พิมพ์ภาษาไทยก็เจอข่าวภาษาอังกฤษ</p>

      <Form action="/news" className="mt-6 flex gap-2">
        <input
          name="q"
          defaultValue={query}
          placeholder="เช่น ปัญหาพลังงานของ data center"
          className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 outline-none focus:border-zinc-400"
        />
        <button type="submit" className="rounded-lg bg-zinc-100 px-4 py-2 font-medium text-zinc-900 hover:bg-white">
          ค้นหา
        </button>
      </Form>

      <p className="mt-6 mb-3 text-sm text-zinc-500">
        {query ? `ผลการค้นหา "${query}" (เรียงตามความเกี่ยวข้อง)` : "ข่าวล่าสุด 30 ชิ้น"}
      </p>

      <div className="divide-y divide-zinc-800 rounded-xl border border-zinc-800 bg-zinc-900">
        {news.map((n) => (
          <NewsCard key={n.url} n={n} />
        ))}
      </div>
    </main>
  );
}