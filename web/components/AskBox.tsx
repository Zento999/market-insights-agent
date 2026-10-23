"use client";

import { useState } from "react";

type Message = { role: "user" | "ai"; text: string };

// แปลง **ข้อความ** เป็นตัวหนา
function renderBold(line: string) {
  return line.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="text-zinc-100">{part}</strong> : part
  );
}

const EXAMPLES = ["MU เป็นยังไงบ้าง 5 วันที่ผ่านมา", "CRWV ร่วงเพราะอะไร", "SPCX มีข่าวอะไรบ้าง"];

export default function AskBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());

  async function ask(question: string) {
    if (!question.trim() || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, sessionId }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "ai", text: data.answer ?? data.error }]);
    } catch {
      setMessages((prev) => [...prev, { role: "ai", text: "เชื่อมต่อไม่ได้ ลองใหม่อีกครั้ง" }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900">
      <div className="max-h-[60vh] min-h-64 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="text-sm text-zinc-500">
            <p className="mb-3">ลองถามเรื่องหุ้นในพอร์ตได้เลย เช่น</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((ex) => (
                <button key={ex} onClick={() => ask(ex)} className="rounded-lg border border-zinc-700 px-3 py-1.5 text-zinc-300 hover:bg-zinc-800">
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
              m.role === "user" ? "bg-sky-900 text-sky-50" : "bg-zinc-800 text-zinc-200"
            }`}>
              {m.text.split("\n").map((line, j) => (
                <p key={j} className="min-h-[1em]">{renderBold(line)}</p>
              ))}
            </div>
          </div>
        ))}

        {loading && <p className="text-sm text-zinc-500">🤖 กำลังคิด...</p>}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); ask(input); }}
        className="flex gap-2 border-t border-zinc-800 p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="พิมพ์คำถาม..."
          maxLength={500}
          className="flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2 outline-none focus:border-zinc-400"
        />
        <button type="submit" disabled={loading} className="rounded-lg bg-zinc-100 px-4 py-2 font-medium text-zinc-900 hover:bg-white disabled:opacity-50">
          ส่ง
        </button>
      </form>
    </div>
  );
}