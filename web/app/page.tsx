import { getMarketSummary, getLatestBrief, type DailyBrief } from "@/lib/queries";

// การ์ดตัวเลข 1 ใบ
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

// แปลง **ข้อความ** ให้เป็นตัวหนา
function renderBold(line: string) {
  return line.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="text-zinc-100">{part}</strong> : part
  );
}

// การ์ดสรุปตลาดจาก AI
function BriefCard({ brief }: { brief: DailyBrief | null }) {
  if (!brief) return null;

  return (
    <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="mb-3 flex items-center gap-2">
        <h2 className="font-semibold">🤖 สรุปตลาดประจำวัน</h2>
        {brief.model && (
          <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
            {brief.model}
          </span>
        )}
      </div>
      <div className="space-y-2 leading-relaxed text-zinc-300">
        {brief.content
          .split("\n")
          .filter((line) => line.trim() !== "")
          .map((line, i) => (
            <p key={i}>{renderBold(line)}</p>
          ))}
      </div>
    </section>
  );
}

// หน้าแรก
export default async function Home() {
  const [summary, brief] = await Promise.all([getMarketSummary(), getLatestBrief()]);
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
    </main>
  );
}