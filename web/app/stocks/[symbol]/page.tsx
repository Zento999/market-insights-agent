import Link from "next/link";
import { notFound } from "next/navigation";
import { getStock, getPriceHistory, getStockNews } from "@/lib/queries";
import { changeColor, formatPct, formatDateTh } from "@/lib/format";

function Stat({ label, value, color = "text-zinc-100" }: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <p className="text-xs text-zinc-400">{label}</p>
      <p className={`mt-1 text-lg font-semibold ${color}`}>{value}</p>
    </div>
  );
}

export default async function StockPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  const [stock, history, news] = await Promise.all([
    getStock(symbol),
    getPriceHistory(symbol),
    getStockNews(symbol),
  ]);

  if (!stock) notFound();

  // สถิติ 1 ปี
  const closes = history.map((p) => p.close);
  const high = Math.max(...closes);
  const low = Math.min(...closes);
  const yearChange = closes.length > 1 ? (closes[closes.length - 1] / closes[0] - 1) * 100 : null;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-200">← กลับหน้าแรก</Link>

      <header className="mt-4 mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">{stock.symbol}</h1>
          {stock.sector && (
            <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">{stock.sector}</span>
          )}
        </div>
        <p className="text-zinc-400">{stock.name} · {stock.exchange}</p>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="text-4xl font-semibold">${stock.close.toFixed(2)}</span>
          <span className={`text-lg ${changeColor(stock.change_pct)}`}>{formatPct(stock.change_pct)}</span>
        </div>
        <p className="mt-1 text-xs text-zinc-500">ราคาปิด {formatDateTh(stock.trade_date)}</p>
      </header>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="สูงสุด 1 ปี" value={`$${high.toFixed(2)}`} />
        <Stat label="ต่ำสุด 1 ปี" value={`$${low.toFixed(2)}`} />
        <Stat label="เปลี่ยนแปลง 1 ปี" value={formatPct(yearChange)} color={changeColor(yearChange)} />
        <Stat label="ข้อมูลย้อนหลัง" value={`${history.length} วัน`} />
      </section>

      <section className="mt-6 flex h-72 items-center justify-center rounded-xl border border-dashed border-zinc-700 text-zinc-500">
        📈 กราฟราคาจะมาในบทที่ 41B
      </section>

      <section className="mt-6">
        <h2 className="mb-3 font-semibold">📰 ข่าวล่าสุดของ {stock.symbol}</h2>
        {news.length === 0 ? (
          <p className="text-sm text-zinc-500">ยังไม่มีข่าวในฐานข้อมูล</p>
        ) : (
          <div className="divide-y divide-zinc-800 rounded-xl border border-zinc-800 bg-zinc-900">
            {news.map((n) => (
              <a key={n.url} href={n.url} target="_blank" rel="noopener noreferrer" className="block px-4 py-3 hover:bg-zinc-800/60">
                <p className="font-medium">{n.title}</p>
                {n.summary && <p className="mt-1 text-sm text-zinc-400">{n.summary}…</p>}
                <p className="mt-1 text-xs text-zinc-500">{n.source} · {formatDateTh(n.published_date)}</p>
              </a>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}