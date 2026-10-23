import "server-only";
import { connection } from "next/server";
import { pool } from "./db";

export type MarketSummary = {
  trade_date: string;
  total: number;
  up: number;
  down: number;
};

// สรุปตลาดวันล่าสุด: ขึ้นกี่ตัว ลงกี่ตัว
export async function getMarketSummary(): Promise<MarketSummary> {
  await connection(); // ดึงข้อมูลใหม่ทุกครั้งที่มีคนเปิดหน้า

  const { rows } = await pool.query<MarketSummary>(`
    WITH ranked AS (
      SELECT stock_id, trade_date, close,
             LAG(close) OVER (PARTITION BY stock_id ORDER BY trade_date) AS prev_close
      FROM daily_prices
    ),
    latest AS (
      SELECT * FROM ranked
      WHERE trade_date = (SELECT MAX(trade_date) FROM daily_prices)
    )
    SELECT to_char(MAX(trade_date), 'YYYY-MM-DD') AS trade_date,
           COUNT(*)::int AS total,
           (COUNT(*) FILTER (WHERE close > prev_close))::int AS up,
           (COUNT(*) FILTER (WHERE close < prev_close))::int AS down
    FROM latest
  `);

  return rows[0];
}


export type DailyBrief = {
  report_date: string;
  content: string;
  model: string | null;
};

// รายงานสรุปตลาดล่าสุดที่ AI เขียนไว้
export async function getLatestBrief(): Promise<DailyBrief | null> {
  await connection();

  const { rows } = await pool.query<DailyBrief>(`
    SELECT to_char(report_date, 'YYYY-MM-DD') AS report_date, content, model
    FROM ai_reports
    WHERE report_type = 'daily_brief'
    ORDER BY report_date DESC
    LIMIT 1
  `);

  return rows[0] ?? null;
}