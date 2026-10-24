import { ImageResponse } from "next/og";

// สร้างไอคอน 2 ขนาด (192 และ 512) ที่ Android ต้องใช้
export function generateImageMetadata() {
  return [
    { id: "192", size: { width: 192, height: 192 }, contentType: "image/png" },
    { id: "512", size: { width: 512, height: 512 }, contentType: "image/png" },
  ];
}

// ไอคอน: กราฟแท่ง 3 แท่ง (แดง-เขียว-เขียว) บนพื้นดำ
export default async function Icon({ id }: { id: Promise<string | number> }) {
  const s = Number(await id);

  function Bar({ h, color }: { h: number; color: string }) {
    return (
      <div
        style={{
          width: s * 0.14,
          height: s * h,
          marginLeft: s * 0.035,
          marginRight: s * 0.035,
          background: color,
          borderRadius: s * 0.03,
        }}
      />
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingBottom: s * 0.24,
          background: "#09090b",
        }}
      >
        <Bar h={0.22} color="#fb7185" />
        <Bar h={0.36} color="#34d399" />
        <Bar h={0.5} color="#34d399" />
      </div>
    ),
    { width: s, height: s }
  );
}