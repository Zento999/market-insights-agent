import { getMarketSummary } from "@/lib/queries";

// การ์ดตัวเลข 1 ใบ (component ที่ใช้ซ้ำได้)
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

// หน้าแรก (async = รอข้อมูลจากฐานข้อมูลก่อนแสดงผล)
export default async function Home() {
  const summary = await getMarketSummary();
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
    </main>
  );
}