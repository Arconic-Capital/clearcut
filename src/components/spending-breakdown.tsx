"use client";

import { formatCurrency } from "@/lib/benchmarks";

interface SpendingBreakdownProps {
  data: { name: string; value: number }[];
  income: number;
}

export function SpendingBreakdown({ data, income }: SpendingBreakdownProps) {
  if (data.length === 0) return null;

  const maxVal = Math.max(...data.map((d) => d.value));

  return (
    <div className="space-y-4">
      {data.map((item, i) => {
        const pct = income > 0 ? (item.value / income) * 100 : 0;
        const barWidth = maxVal > 0 ? (item.value / maxVal) * 100 : 0;
        const isTop = i === 0;
        return (
          <div
            key={item.name}
            className="animate-rise"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-baseline justify-between text-sm mb-1.5">
              <span className="font-medium">{item.name}</span>
              <span className="font-mono text-muted-foreground text-xs">
                {formatCurrency(item.value)} · {pct.toFixed(1)}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${
                  isTop ? "bg-foreground" : "bg-mint-dark/60"
                }`}
                style={{ width: `${barWidth}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
