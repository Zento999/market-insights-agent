import Link from "next/link";
import {
  getMarketSummary, getLatestBrief, getSectorPerformance, getTopMovers,
  type DailyBrief, type SectorPerf, type Mover,
} from "@/lib/queries";
import { changeColor, formatPct } from "@/lib/format";

// ---------- ตัวช่วยเฉพาะหน้านี้ ----------
function tileColor(pct: number) {
  if (pct >= 3) return "bg-emerald-900";
  if (pct >= 1) return "bg-emerald-950";
  if (pct > -1) return "bg-zinc-900";
  if (pct > -3) return "bg-rose-950";
  return "bg-rose-900";
}

function renderBold(line: string) {
  return line.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="text-zinc-100">{part}</strong> : part
  );
}

// ---------- Components ----------
function StatCard({ label, value, color = "text-zinc-100" }: {
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <p className="text-sm text-zinc-400">{label}</p>
      <p className={`mt-2 text-3xl font-semibold ${color}`}>{value}</p>
    </div>
  );
}

function BriefCard({ brief }: { brief: DailyBrief | null }) {
  if (!brief) return null;
  return (
    <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="mb-3 flex items-center gap-2">
        <h2 className="font-semibold">🤖 สรุปตลาดประจำวัน</h2>
        {brief.model && (
          <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">{brief.model}</span>
        )}
      </div>
      <div className="space-y-2 leading-relaxed text-zinc-300">
        {brief.content.split("\n").filter((line) => line.trim() !== "").map((line, i) => (
          <p key={i}>{renderBold(line)}</p>
        ))}
      </div>
    </section>
  );
}

function SectorGrid({ sectors }: { sectors: SectorPerf[] }) {
  return (
    <section>
      <h2 className="mb-3 font-semibold">🧩 กลุ่มหุ้น</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {sectors.map((s) => (
          <div key={s.sector} className={`rounded-lg p-3 ${tileColor(s.avg_change)}`}>
            <p className="text-sm">{s.sector}</p>
            <p className={`text-lg font-semibold ${changeColor(s.avg_change)}`}>{formatPct(s.avg_change)}</p>
            <p className="text-xs text-zinc-500">{s.count} ตัว</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function MoverList({ movers }: { movers: Mover[] }) {
  return (
    <section>
      <h2 className="mb-3 font-semibold">🔥 Top movers</h2>
      <div className="divide-y divide-zinc-800 rounded-xl border border-zinc-800 bg-zinc-900">
        {movers.map((m) => (
          <Link
            key={m.symbol}
            href={`/stocks/${m.symbol}`}
            className="flex items-center justify-between px-4 py-3 hover:bg-zinc-800/60"
          >
            <div>
              <p className="font-semibold">{m.symbol}</p>
              <p className="text-xs text-zinc-400">{m.sector}</p>
            </div>
            <div className="text-right">
              <p>${m.close.toFixed(2)}</p>
              <p className={`text-sm ${changeColor(m.change_pct)}`}>{formatPct(m.change_pct)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ---------- หน้าแรก ----------
export default async function Home() {
  const [summary, brief, sectors, movers] = await Promise.all([
    getMarketSummary(),
    getLatestBrief(),
    getSectorPerformance(),
    getTopMovers(),
  ]);
  const dateTh = new Date(summary.trade_date + "T00:00:00").toLocaleDateString("th-TH", {
    dateStyle: "long",
  });

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">📈 Market Insights</h1>
        <p className="mt-1 text-sm text-zinc-400">ข้อมูลตลาดวันที่ {dateTh}</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="หุ้นที่ติดตาม" value={summary.total} />
        <StatCard label="ขึ้น" value={summary.up} color="text-emerald-400" />
        <StatCard label="ลง" value={summary.down} color="text-rose-400" />
      </section>

      <BriefCard brief={brief} />

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <SectorGrid sectors={sectors} />
        <MoverList movers={movers} />
      </div>
    </main>
  );
}

