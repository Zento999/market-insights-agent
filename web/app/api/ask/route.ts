// API: รับคำถามจากหน้าเว็บ แล้วส่งต่อให้ AI Agent ใน n8n
export async function POST(request: Request) {
  const { question, sessionId } = await request.json();

  // ตรวจคำถามก่อน (กันข้อมูลแปลกๆ และกันคำถามยาวเกินไป)
  if (typeof question !== "string" || question.trim() === "" || question.length > 500) {
    return Response.json({ error: "กรุณาพิมพ์คำถาม (ไม่เกิน 500 ตัวอักษร)" }, { status: 400 });
  }

  const res = await fetch(process.env.N8N_ASK_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Web-Secret": process.env.N8N_WEBHOOK_SECRET!,
    },
    body: JSON.stringify({ question: question.trim(), sessionId }),
  });

  if (!res.ok) {
    return Response.json({ error: "AI ไม่ตอบ ลองใหม่อีกครั้ง" }, { status: 502 });
  }

  const data = await res.json();
  return Response.json({ answer: data.output });
}