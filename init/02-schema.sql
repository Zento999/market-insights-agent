-- Phase 2: ตารางของแอป (รันซ้ำได้ เพราะใช้ IF NOT EXISTS)
\connect market_insights

-- 1) หุ้นที่เราติดตาม (watchlist)
CREATE TABLE IF NOT EXISTS stocks (
    id          SERIAL PRIMARY KEY,
    symbol      TEXT NOT NULL UNIQUE,
    name        TEXT NOT NULL,
    exchange    TEXT NOT NULL,
    currency    TEXT NOT NULL DEFAULT 'THB',
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- เพิ่มกลุ่มอุตสาหกรรม (สำหรับจัดกลุ่มในรายงานและหน้าเว็บ)
ALTER TABLE stocks ADD COLUMN IF NOT EXISTS sector TEXT;


-- 2) ราคารายวัน (1 แถว = หุ้น 1 ตัว ใน 1 วัน)
CREATE TABLE IF NOT EXISTS daily_prices (
    stock_id    INTEGER NOT NULL REFERENCES stocks(id),
    trade_date  DATE NOT NULL,
    open        NUMERIC(14,4),
    high        NUMERIC(14,4),
    low         NUMERIC(14,4),
    close       NUMERIC(14,4) NOT NULL,
    volume      BIGINT,
    fetched_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (stock_id, trade_date)
);

-- 3) ข่าว (1 แถว = ข่าว 1 ชิ้น)
CREATE TABLE IF NOT EXISTS news_articles (
    id            BIGSERIAL PRIMARY KEY,
    url           TEXT NOT NULL UNIQUE,
    title         TEXT NOT NULL,
    summary       TEXT,
    content       TEXT,
    source        TEXT,
    published_at  TIMESTAMPTZ,
    fetched_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4) ตารางจับคู่ ข่าว <-> หุ้น (many-to-many)
CREATE TABLE IF NOT EXISTS news_stocks (
    article_id  BIGINT  NOT NULL REFERENCES news_articles(id) ON DELETE CASCADE,
    stock_id    INTEGER NOT NULL REFERENCES stocks(id),
    PRIMARY KEY (article_id, stock_id)
);

-- Index ช่วยให้ค้นหาเร็ว
CREATE INDEX IF NOT EXISTS idx_news_published ON news_articles (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_stocks_stock ON news_stocks (stock_id);


-- 5) รายงานจาก AI (1 แถว = รายงาน 1 ฉบับ)
CREATE TABLE IF NOT EXISTS ai_reports (
    id           BIGSERIAL PRIMARY KEY,
    report_date  DATE NOT NULL,
    report_type  TEXT NOT NULL DEFAULT 'daily_brief',
    content      TEXT NOT NULL,
    model        TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (report_date, report_type)
);


-- วันที่เริ่มนับข้อมูล (กัน ticker ที่ถูกนำกลับมาใช้ใหม่)
ALTER TABLE stocks ADD COLUMN IF NOT EXISTS listed_since DATE;