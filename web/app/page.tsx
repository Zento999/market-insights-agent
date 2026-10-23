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

// หน้าแรก
export default function Home() {
  const today = new Date().toLocaleDateString("th-TH", { dateStyle: "long" });

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">📈 Market Insights</h1>
        <p className="mt-1 text-sm text-zinc-400">อัปเดตล่าสุด {today}</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="หุ้นที่ติดตาม" value={40} />
        <StatCard label="ขึ้น" value={15} color="text-emerald-400" />
        <StatCard label="ลง" value={25} color="text-rose-400" />
      </section>
    </main>
  );
}