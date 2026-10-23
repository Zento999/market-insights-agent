"use client";

import { useEffect, useRef } from "react";
import { createChart, AreaSeries, ColorType } from "lightweight-charts";

type Point = { time: string; value: number };

export default function PriceChart({ data, isUp }: { data: Point[]; isUp: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // สร้างกราฟธีมมืด
    const chart = createChart(containerRef.current, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#a1a1aa",
      },
      grid: {
        vertLines: { color: "#27272a" },
        horzLines: { color: "#27272a" },
      },
      rightPriceScale: { borderColor: "#27272a" },
      timeScale: { borderColor: "#27272a" },
    });

    // กราฟพื้นที่: เขียวถ้าทั้งปีขึ้น แดงถ้าลง
    const series = chart.addSeries(AreaSeries, {
      lineColor: isUp ? "#34d399" : "#fb7185",
      topColor: isUp ? "rgba(52, 211, 153, 0.35)" : "rgba(251, 113, 133, 0.35)",
      bottomColor: "rgba(0, 0, 0, 0)",
      lineWidth: 2,
    });

    series.setData(data);
    chart.timeScale().fitContent();

    // เก็บกวาดเมื่อออกจากหน้า
    return () => chart.remove();
  }, [data, isUp]);

  return <div ref={containerRef} className="h-72 w-full" />;
}