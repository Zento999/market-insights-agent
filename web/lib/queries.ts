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


// ส่วน SQL ที่ใช้ซ้ำ: ราคาวันล่าสุด + ราคาวันก่อนหน้า
const LATEST = `
  ranked AS (
    SELECT p.stock_id, s.symbol, s.sector, p.trade_date, p.close,
           LAG(p.close) OVER (PARTITION BY p.stock_id ORDER BY p.trade_date) AS prev_close
    FROM daily_prices p JOIN stocks s ON s.id = p.stock_id
  ),
  latest AS (
    SELECT * FROM ranked
    WHERE trade_date = (SELECT MAX(trade_date) FROM daily_prices) AND prev_close IS NOT NULL
  )`;

export type SectorPerf = { sector: string; avg_change: number; count: number };
export type Mover = { symbol: string; sector: string; close: number; change_pct: number };

// ผลตอบแทนเฉลี่ยรายกลุ่ม
export async function getSectorPerformance(): Promise<SectorPerf[]> {
  await connection();
  const { rows } = await pool.query<SectorPerf>(`
    WITH ${LATEST}
    SELECT sector,
           ROUND(AVG((close / prev_close - 1) * 100), 2)::float AS avg_change,
           COUNT(*)::int AS count
    FROM latest
    GROUP BY sector
    ORDER BY avg_change DESC
  `);
  return rows;
}

// หุ้นที่ขยับแรงที่สุด (ทั้งขึ้นและลง)
export async function getTopMovers(limit = 5): Promise<Mover[]> {
  await connection();
  const { rows } = await pool.query<Mover>(`
    WITH ${LATEST}
    SELECT symbol, sector, close::float AS close,
           ROUND((close / prev_close - 1) * 100, 2)::float AS change_pct
    FROM latest
    ORDER BY ABS(close / prev_close - 1) DESC
    LIMIT $1
  `, [limit]);
  return rows;
}


export type StockDetail = {
  symbol: string;
  name: string;
  sector: string | null;
  exchange: string;
  close: number;
  change_pct: number | null;
  trade_date: string;
};
export type PricePoint = { date: string; close: number };
export type NewsItem = {
  title: string;
  url: string;
  source: string | null;
  summary: string | null;
  published_date: string;
};

// ข้อมูลหุ้น 1 ตัว + ราคาล่าสุด
export async function getStock(symbol: string): Promise<StockDetail | null> {
  await connection();
  const { rows } = await pool.query<StockDetail>(`
    WITH r AS (
      SELECT p.trade_date, p.close,
             LAG(p.close) OVER (ORDER BY p.trade_date) AS prev_close
      FROM daily_prices p JOIN stocks s ON s.id = p.stock_id
      WHERE s.symbol = $1
    )
    SELECT s.symbol, s.name, s.sector, s.exchange,
           r.close::float AS close,
           ROUND((r.close / r.prev_close - 1) * 100, 2)::float AS change_pct,
           to_char(r.trade_date, 'YYYY-MM-DD') AS trade_date
    FROM stocks s CROSS JOIN r
    WHERE s.symbol = $1
    ORDER BY r.trade_date DESC
    LIMIT 1
  `, [symbol.toUpperCase()]);
  return rows[0] ?? null;
}

// ราคาปิดย้อนหลัง (เรียงจากเก่าไปใหม่ สำหรับกราฟ)
export async function getPriceHistory(symbol: string, days = 365): Promise<PricePoint[]> {
  await connection();
  const { rows } = await pool.query<PricePoint>(`
    SELECT to_char(p.trade_date, 'YYYY-MM-DD') AS date, p.close::float AS close
    FROM daily_prices p JOIN stocks s ON s.id = p.stock_id
    WHERE s.symbol = $1 AND p.trade_date >= CURRENT_DATE - $2::int
    ORDER BY p.trade_date
  `, [symbol.toUpperCase(), days]);
  return rows;
}

// ข่าวล่าสุดของหุ้น 1 ตัว
export async function getStockNews(symbol: string, limit = 8): Promise<NewsItem[]> {
  await connection();
  const { rows } = await pool.query<NewsItem>(`
    SELECT a.title, a.url, a.source, LEFT(a.summary, 220) AS summary,
           to_char(a.published_at, 'YYYY-MM-DD') AS published_date
    FROM news_stocks ns
    JOIN stocks s ON s.id = ns.stock_id
    JOIN news_articles a ON a.id = ns.article_id
    WHERE s.symbol = $1
    ORDER BY a.published_at DESC
    LIMIT $2
  `, [symbol.toUpperCase(), limit]);
  return rows;
}