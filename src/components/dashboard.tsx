"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SpendingBreakdown } from "@/components/spending-breakdown";
import { ProjectionChart } from "@/components/projection-chart";
import {
  type Expense,
  getRecommendations,
  calculateProjections,
  formatCurrency,
} from "@/lib/benchmarks";
import {
  ArrowDown,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  ChevronLeft,
} from "lucide-react";

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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Edit Expenses
        </Button>
        <Button variant="ghost" size="sm" onClick={onReset}>
          <RotateCcw className="h-4 w-4 mr-1" /> Start Over
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Monthly Income</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(income)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Monthly Surplus</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                monthlySurplus >= 0 ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {formatCurrency(monthlySurplus)}
            </div>
            <div className="text-xs text-muted-foreground">
              {savingsRate.toFixed(1)}% savings rate
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Spending Breakdown</CardTitle>
          <CardDescription>Where your money goes each month</CardDescription>
        </CardHeader>
        <CardContent>
          <SpendingBreakdown data={categoryTotals} income={income} />
        </CardContent>
      </Card>

      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Recommendations
            </CardTitle>
            <CardDescription>
              Categories where you&apos;re spending above typical benchmarks. You could
              save up to {formatCurrency(totalPossibleSaving)}/month.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.map((rec) => (
              <div
                key={rec.category}
                className="flex items-start gap-4 p-3 rounded-lg bg-muted/50"
              >
                <div className="mt-0.5 h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <ArrowDown className="h-4 w-4 text-amber-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{rec.category}</div>
                  <div className="text-sm text-muted-foreground">
                    You spend {rec.currentPercent}% of income (benchmark:{" "}
                    {rec.benchmarkPercent}%). Reduce by ~{rec.suggestedCut}% to save{" "}
                    <span className="font-medium text-emerald-600">
                      {formatCurrency(rec.monthlySaving)}/mo
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {recommendations.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
            <p className="font-medium">Looking good!</p>
            <p className="text-sm text-muted-foreground">
              Your spending is within typical benchmarks across all categories.
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Savings Projection</CardTitle>
          <CardDescription>
            Where your savings could be in 10 years at {returnRate}% annual return
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="text-sm text-muted-foreground whitespace-nowrap">
              Annual return:
            </label>
            <input
              type="range"
              min={0}
              max={12}
              step={0.5}
              value={returnRate}
              onChange={(e) => setReturnRate(parseFloat(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm font-medium w-12 text-right">{returnRate}%</span>
          </div>
          <ProjectionChart data={projections} />
          <Separator />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                Stay the Course (10yr)
              </div>
              <div className="text-lg font-bold">
                {formatCurrency(projections[10]?.current ?? 0)}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                Moderate Cuts (10yr)
              </div>
              <div className="text-lg font-bold text-blue-600">
                {formatCurrency(projections[10]?.moderate ?? 0)}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                Aggressive Cuts (10yr)
              </div>
              <div className="text-lg font-bold text-emerald-600">
                {formatCurrency(projections[10]?.aggressive ?? 0)}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center pt-2">
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                Stay the Course (5yr)
              </div>
              <div className="text-base font-semibold">
                {formatCurrency(projections[5]?.current ?? 0)}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                Moderate Cuts (5yr)
              </div>
              <div className="text-base font-semibold text-blue-600">
                {formatCurrency(projections[5]?.moderate ?? 0)}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                Aggressive Cuts (5yr)
              </div>
              <div className="text-base font-semibold text-emerald-600">
                {formatCurrency(projections[5]?.aggressive ?? 0)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
