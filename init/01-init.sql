-- สร้างฐานข้อมูลสำหรับข้อมูลหุ้นของเรา (แยกจาก n8n)
CREATE DATABASE market_insights;

-- ย้ายไปทำงานใน DB ใหม่
\connect market_insights

-- เปิดใช้ pgvector สำหรับเก็บเวกเตอร์
CREATE EXTENSION IF NOT EXISTS vector;