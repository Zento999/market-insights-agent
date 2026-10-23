// สีตามการขึ้น/ลง
export function changeColor(pct: number | null) {
  if (pct === null) return "text-zinc-400";
  if (pct > 0) return "text-emerald-400";
  if (pct < 0) return "text-rose-400";
  return "text-zinc-400";
}

// แสดง % พร้อมเครื่องหมาย เช่น +2.35%
export function formatPct(pct: number | null) {
  if (pct === null) return "-";
  return `${pct > 0 ? "+" : ""}${pct.toFixed(2)}%`;
}

// แปลง 2026-10-21 เป็นวันที่ภาษาไทย
export function formatDateTh(date: string) {
  return new Date(date + "T00:00:00").toLocaleDateString("th-TH", { dateStyle: "medium" });
}