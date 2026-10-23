import "server-only";
import { Pool } from "pg";

// การเชื่อมต่อฐานข้อมูล: สร้างครั้งเดียว แล้วใช้ซ้ำทั้งเว็บ
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
});