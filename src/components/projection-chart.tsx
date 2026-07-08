"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ProjectionPoint } from "@/lib/benchmarks";
import { formatCurrency } from "@/lib/benchmarks";

interface ProjectionChartProps {
  data: ProjectionPoint[];
}

export function ProjectionChart({ data }: ProjectionChartProps) {
  return (
    <div className="w-full h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <defs>
            <linearGradient id="fillAggressive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#b2fce4" stopOpacity={0.7} />
              <stop offset="100%" stopColor="#b2fce4" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" vertical={false} />
          <XAxis
            dataKey="year"
            tickFormatter={(v) => `Yr ${v}`}
            tick={{ fontSize: 11, fill: "#787774", fontFamily: "var(--font-geist-mono)" }}
            axisLine={{ stroke: "#eaeaea" }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => {
              if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
              if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}k`;
              return `$${v}`;
            }}
            tick={{ fontSize: 11, fill: "#787774", fontFamily: "var(--font-geist-mono)" }}
            axisLine={false}
            tickLine={false}
            width={55}
          />
          <Tooltip
            formatter={(value) => formatCurrency(Number(value))}
            labelFormatter={(label) => `Year ${label}`}
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #eaeaea",
              borderRadius: "8px",
              fontSize: "13px",
              padding: "10px 14px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
            itemStyle={{ color: "#111111" }}
            labelStyle={{ color: "#787774", marginBottom: "4px" }}
          />
          <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }} iconType="plainline" />
          <Area
            type="monotone"
            dataKey="current"
            name="Stay the course"
            stroke="#d4d4d0"
            strokeWidth={1.5}
            fill="transparent"
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="moderate"
            name="Moderate cuts"
            stroke="#787774"
            strokeWidth={1.5}
            strokeDasharray="5 4"
            fill="transparent"
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="aggressive"
            name="Aggressive cuts"
            stroke="#0a3d2e"
            strokeWidth={2.5}
            fill="url(#fillAggressive)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
