import AskBox from "@/components/AskBox";

export default function AskPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold">💬 ถาม AI</h1>
      <p className="mt-1 mb-6 text-sm text-zinc-400">
        AI ดึงราคาและข่าวจริงจากฐานข้อมูลมาตอบ (ไม่ใช่คำแนะนำการลงทุน)
      </p>
      <AskBox />
    </main>
  );
}