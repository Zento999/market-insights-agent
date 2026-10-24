import type { MetadataRoute } from "next";

// ข้อมูลแอป: ชื่อ สี และไอคอน ที่มือถือใช้ตอนติดตั้ง
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Market Insights",
    short_name: "Insights",
    description: "สรุปตลาดหุ้นเทคอเมริกาด้วย AI",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    icons: [
      { src: "/icon/192", sizes: "192x192", type: "image/png" },
      { src: "/icon/512", sizes: "512x512", type: "image/png" },
    ],
  };
}