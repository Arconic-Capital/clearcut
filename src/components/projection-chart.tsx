"use client";

import {
  LineChart,
  Line,
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
        <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
          <XAxis
            dataKey="year"
            tickFormatter={(v) => `Yr ${v}`}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            tickFormatter={(v) => {
              if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
              if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}k`;
              return `$${v}`;
            }}
            tick={{ fontSize: 12 }}
            width={60}
          />
          <Tooltip
            formatter={(value) => formatCurrency(Number(value))}
            labelFormatter={(label) => `Year ${label}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="current"
            name="Stay the Course"
            stroke="#a1a1aa"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="moderate"
            name="Moderate Cuts"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="aggressive"
            name="Aggressive Cuts"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
