-- Phase 2: รายชื่อหุ้นที่ติดตาม (watchlist จาก Webull)
-- รันซ้ำได้: ถ้ามี symbol อยู่แล้วจะอัปเดตข้อมูลแทน (upsert)
\connect market_insights

-- ลบหุ้นทดสอบจากบทที่ 12
DELETE FROM stocks WHERE symbol = 'TEST.BK';

INSERT INTO stocks (symbol, name, exchange, currency, sector) VALUES
    -- ETF
    ('VOO',   'Vanguard S&P 500 ETF',                   'NYSEARCA', 'USD', 'ETF'),
    ('QQQM',  'Invesco NASDAQ 100 ETF',                 'NASDAQ',   'USD', 'ETF'),
    -- Semiconductors
    ('NVDA',  'NVIDIA Corporation',                     'NASDAQ',   'USD', 'Semiconductors'),
    ('AVGO',  'Broadcom Inc.',                          'NASDAQ',   'USD', 'Semiconductors'),
    ('TSM',   'Taiwan Semiconductor Manufacturing ADR', 'NYSE',     'USD', 'Semiconductors'),
    ('AMD',   'Advanced Micro Devices, Inc.',           'NASDAQ',   'USD', 'Semiconductors'),
    ('INTC',  'Intel Corporation',                      'NASDAQ',   'USD', 'Semiconductors'),
    ('ASML',  'ASML Holding N.V.',                      'NASDAQ',   'USD', 'Semiconductors'),
    ('MRVL',  'Marvell Technology, Inc.',               'NASDAQ',   'USD', 'Semiconductors'),
    ('ARM',   'Arm Holdings plc ADR',                   'NASDAQ',   'USD', 'Semiconductors'),
    ('ALAB',  'Astera Labs, Inc.',                      'NASDAQ',   'USD', 'Semiconductors'),
    ('MXL',   'MaxLinear, Inc.',                        'NASDAQ',   'USD', 'Semiconductors'),
    ('AXTI',  'AXT, Inc.',                              'NASDAQ',   'USD', 'Semiconductors'),
    -- Memory & Storage
    ('MU',    'Micron Technology, Inc.',                'NASDAQ',   'USD', 'Memory & Storage'),
    ('WDC',   'Western Digital Corporation',            'NASDAQ',   'USD', 'Memory & Storage'),
    ('STX',   'Seagate Technology Holdings plc',        'NASDAQ',   'USD', 'Memory & Storage'),
    ('SNDK',  'Sandisk Corporation',                    'NASDAQ',   'USD', 'Memory & Storage'),
    -- Optical & Networking
    ('CRDO',  'Credo Technology Group Holding Ltd',     'NASDAQ',   'USD', 'Optical & Networking'),
    ('COHR',  'Coherent Corp.',                         'NYSE',     'USD', 'Optical & Networking'),
    ('LITE',  'Lumentum Holdings Inc.',                 'NASDAQ',   'USD', 'Optical & Networking'),
    ('AAOI',  'Applied Optoelectronics, Inc.',          'NASDAQ',   'USD', 'Optical & Networking'),
    -- AI Cloud & Infrastructure
    ('CRWV',  'CoreWeave, Inc.',                        'NASDAQ',   'USD', 'AI Cloud & Infra'),
    ('NBIS',  'Nebius Group N.V.',                      'NASDAQ',   'USD', 'AI Cloud & Infra'),
    ('IREN',  'IREN Limited',                           'NASDAQ',   'USD', 'AI Cloud & Infra'),
    ('PENG',  'Penguin Solutions, Inc.',                'NASDAQ',   'USD', 'AI Cloud & Infra'),
    -- Software & Internet
    ('GOOGL', 'Alphabet Inc. Class A',                  'NASDAQ',   'USD', 'Software & Internet'),
    ('META',  'Meta Platforms, Inc.',                   'NASDAQ',   'USD', 'Software & Internet'),
    ('RBRK',  'Rubrik, Inc.',                           'NYSE',     'USD', 'Software & Internet'),
    -- Consumer Tech / EV
    ('AAPL',  'Apple Inc.',                             'NASDAQ',   'USD', 'Consumer Tech'),
    ('TSLA',  'Tesla, Inc.',                            'NASDAQ',   'USD', 'EV & Auto'),
    -- Energy & Power (ไฟฟ้าสำหรับ data center)
    ('VST',   'Vistra Corp.',                           'NYSE',     'USD', 'Energy & Power'),
    ('BE',    'Bloom Energy Corporation',               'NYSE',     'USD', 'Energy & Power'),
    -- Quantum / Space
    ('IONQ',  'IonQ, Inc.',                             'NYSE',     'USD', 'Quantum'),
    ('ASTS',  'AST SpaceMobile, Inc.',                  'NASDAQ',   'USD', 'Space'),
    ('RKLB',  'Rocket Lab Corporation',                 'NASDAQ',   'USD', 'Space'),
    -- Fintech
    ('SOFI',  'SoFi Technologies, Inc.',                'NASDAQ',   'USD', 'Fintech'),
    ('CRCL',  'Circle Internet Group, Inc.',            'NYSE',     'USD', 'Fintech'),
    -- Healthcare
    ('LLY',   'Eli Lilly and Company',                  'NYSE',     'USD', 'Healthcare'),
    -- เพิ่งเข้าตลาดอเมริกาปี 2026
    ('SKHY',  'SK hynix Inc. ADR',                      'NASDAQ',   'USD', 'Memory & Storage'),
    ('SPCX',  'Space Exploration Technologies Corp.',   'NASDAQ',   'USD', 'Space')
ON CONFLICT (symbol) DO UPDATE SET
    name     = EXCLUDED.name,
    exchange = EXCLUDED.exchange,
    currency = EXCLUDED.currency,
    sector   = EXCLUDED.sector;
