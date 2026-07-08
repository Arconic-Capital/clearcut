"use client";

import { formatCurrency } from "@/lib/benchmarks";

interface SpendingBreakdownProps {
  data: { name: string; value: number }[];
  income: number;
}

const COLORS = [
  "#18181b",
  "#3f3f46",
  "#52525b",
  "#71717a",
  "#a1a1aa",
  "#d4d4d8",
  "#e4e4e7",
  "#f4f4f5",
];

export function SpendingBreakdown({ data, income }: SpendingBreakdownProps) {
  if (data.length === 0) return null;

  const maxVal = Math.max(...data.map((d) => d.value));

  return (
    <div className="space-y-3">
      {data.map((item, i) => {
        const pct = income > 0 ? (item.value / income) * 100 : 0;
        const barWidth = maxVal > 0 ? (item.value / maxVal) * 100 : 0;
        return (
          <div key={item.name} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{item.name}</span>
              <span className="text-muted-foreground">
                {formatCurrency(item.value)}{" "}
                <span className="text-xs">({pct.toFixed(1)}%)</span>
              </span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${barWidth}%`,
                  backgroundColor: COLORS[i % COLORS.length],
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
