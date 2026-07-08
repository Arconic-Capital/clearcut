"use client";

import { useMemo, useState } from "react";
import { SpendingBreakdown } from "@/components/spending-breakdown";
import { ProjectionChart } from "@/components/projection-chart";
import {
  type Expense,
  getRecommendations,
  calculateProjections,
  formatCurrency,
} from "@/lib/benchmarks";

interface DashboardProps {
  income: number;
  expenses: Expense[];
  onBack: () => void;
  onReset: () => void;
}

export function Dashboard({ income, expenses, onBack, onReset }: DashboardProps) {
  const [returnRate, setReturnRate] = useState(5);

  const totalExpenses = useMemo(
    () => expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses]
  );

  const monthlySurplus = income - totalExpenses;
  const savingsRate = income > 0 ? (monthlySurplus / income) * 100 : 0;

  const recommendations = useMemo(
    () => getRecommendations(income, expenses),
    [income, expenses]
  );

  const totalPossibleSaving = recommendations.reduce(
    (sum, r) => sum + r.monthlySaving,
    0
  );

  const projections = useMemo(
    () => calculateProjections(income, totalExpenses, recommendations, returnRate),
    [income, totalExpenses, recommendations, returnRate]
  );

  const categoryTotals = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of expenses) {
      map.set(e.category, (map.get(e.category) ?? 0) + e.amount);
    }
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  const scenarios = [
    {
      key: "current",
      label: "Stay the course",
      five: projections[5]?.current ?? 0,
      ten: projections[10]?.current ?? 0,
      highlight: false,
    },
    {
      key: "moderate",
      label: "Moderate cuts",
      five: projections[5]?.moderate ?? 0,
      ten: projections[10]?.moderate ?? 0,
      highlight: false,
    },
    {
      key: "aggressive",
      label: "Aggressive cuts",
      five: projections[5]?.aggressive ?? 0,
      ten: projections[10]?.aggressive ?? 0,
      highlight: true,
    },
  ];

  return (
    <div className="pb-16">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; Edit expenses
        </button>
        <button
          onClick={onReset}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Start over
        </button>
      </div>

      <div className="text-center mb-12 animate-rise">
        <span className="tag-neutral mb-6">Step 3 of 3</span>
        <h1 className="font-serif-display text-4xl sm:text-5xl font-medium mt-6">
          Your money,
          <br />
          <em>laid bare.</em>
        </h1>
      </div>

      {/* Bento summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
        <div className="card-flat p-6 animate-rise rise-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
            Income
          </p>
          <p className="text-2xl font-mono font-semibold">{formatCurrency(income)}</p>
          <p className="text-xs text-muted-foreground mt-1">per month</p>
        </div>
        <div className="card-flat p-6 animate-rise rise-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
            Expenses
          </p>
          <p className="text-2xl font-mono font-semibold">{formatCurrency(totalExpenses)}</p>
          <p className="text-xs text-muted-foreground mt-1">per month</p>
        </div>
        <div
          className={`p-6 rounded-xl border animate-rise rise-3 ${
            monthlySurplus >= 0
              ? "bg-mint border-mint"
              : "bg-white border-border"
          }`}
        >
          <p
            className={`text-xs font-medium uppercase tracking-wider mb-2 ${
              monthlySurplus >= 0 ? "text-mint-dark/70" : "text-muted-foreground"
            }`}
          >
            Surplus
          </p>
          <p
            className={`text-2xl font-mono font-semibold ${
              monthlySurplus >= 0 ? "text-mint-dark" : "text-destructive"
            }`}
          >
            {formatCurrency(monthlySurplus)}
          </p>
          <p
            className={`text-xs mt-1 ${
              monthlySurplus >= 0 ? "text-mint-dark/70" : "text-muted-foreground"
            }`}
          >
            {savingsRate.toFixed(1)}% savings rate
          </p>
        </div>
        <div className="card-flat p-6 animate-rise rise-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
            Potential
          </p>
          <p className="text-2xl font-mono font-semibold">
            {formatCurrency(totalPossibleSaving)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">extra savings/mo</p>
        </div>
      </div>

      {/* Bento: breakdown + recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
        <div className="card-flat p-8 lg:col-span-3 animate-rise rise-2">
          <h2 className="font-semibold mb-1">Spending breakdown</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Share of monthly income by category
          </p>
          <SpendingBreakdown data={categoryTotals} income={income} />
        </div>

        <div className="card-flat p-8 lg:col-span-2 animate-rise rise-3">
          <h2 className="font-semibold mb-1">Where to cut</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Ranked by monthly impact
          </p>
          {recommendations.length === 0 ? (
            <div className="py-8 text-center">
              <span className="tag-mint mb-3">On track</span>
              <p className="text-sm text-muted-foreground mt-3">
                Spending is within benchmarks across every category.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recommendations.map((rec) => (
                <div key={rec.category} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-baseline justify-between gap-3 mb-1">
                    <span className="text-sm font-medium">{rec.category}</span>
                    <span className="text-sm font-mono font-semibold text-mint-dark whitespace-nowrap">
                      +{formatCurrency(rec.monthlySaving)}/mo
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {rec.currentPercent}% of income against a {rec.benchmarkPercent}%
                    benchmark. Trim roughly {rec.suggestedCut}%.
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Projection */}
      <div className="card-flat p-8 animate-rise rise-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="font-semibold mb-1">Ten-year projection</h2>
            <p className="text-sm text-muted-foreground">
              Savings compounded monthly at your chosen return
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label
              htmlFor="return-rate"
              className="text-xs font-medium uppercase tracking-wider text-muted-foreground whitespace-nowrap"
            >
              Return
            </label>
            <input
              id="return-rate"
              type="range"
              min={0}
              max={12}
              step={0.5}
              value={returnRate}
              onChange={(e) => setReturnRate(parseFloat(e.target.value))}
              className="range-mint w-36"
            />
            <span className="text-sm font-mono font-semibold w-12 text-right">
              {returnRate}%
            </span>
          </div>
        </div>

        <ProjectionChart data={projections} />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          {scenarios.map((s) => (
            <div
              key={s.key}
              className={`rounded-xl border p-6 ${
                s.highlight ? "bg-mint border-mint" : "bg-white border-border"
              }`}
            >
              <p
                className={`text-xs font-medium uppercase tracking-wider mb-4 ${
                  s.highlight ? "text-mint-dark/70" : "text-muted-foreground"
                }`}
              >
                {s.label}
              </p>
              <div className="flex items-baseline justify-between mb-2">
                <span
                  className={`text-xs font-mono ${
                    s.highlight ? "text-mint-dark/70" : "text-muted-foreground"
                  }`}
                >
                  5 yr
                </span>
                <span
                  className={`font-mono font-medium ${
                    s.highlight ? "text-mint-dark" : ""
                  }`}
                >
                  {formatCurrency(s.five)}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span
                  className={`text-xs font-mono ${
                    s.highlight ? "text-mint-dark/70" : "text-muted-foreground"
                  }`}
                >
                  10 yr
                </span>
                <span
                  className={`text-xl font-mono font-semibold ${
                    s.highlight ? "text-mint-dark" : ""
                  }`}
                >
                  {formatCurrency(s.ten)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
