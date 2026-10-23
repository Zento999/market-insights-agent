import "server-only";

// แปลงข้อความเป็นเวกเตอร์ด้วย Ollama (bge-m3) แบบเดียวกับ workflow Embed News
export async function embed(text: string): Promise<number[]> {
  const res = await fetch(`${process.env.OLLAMA_URL}/api/embed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "bge-m3", input: text }),
  });

  if (!res.ok) throw new Error(`Ollama error: ${res.status}`);

  const data = await res.json();
  return data.embeddings[0];
}