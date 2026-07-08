export const EXPENSE_CATEGORIES = [
  "Housing",
  "Groceries",
  "Transport",
  "Dining Out",
  "Subscriptions",
  "Utilities",
  "Insurance",
  "Entertainment",
  "Clothing",
  "Health & Fitness",
  "Personal Care",
  "Education",
  "Savings & Investments",
  "Other",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export interface Expense {
  id: string;
  category: ExpenseCategory;
  label: string;
  amount: number;
}

export const BENCHMARK_PERCENTAGES: Record<ExpenseCategory, number> = {
  Housing: 28,
  Groceries: 10,
  Transport: 10,
  "Dining Out": 5,
  Subscriptions: 3,
  Utilities: 5,
  Insurance: 5,
  Entertainment: 3,
  Clothing: 3,
  "Health & Fitness": 3,
  "Personal Care": 2,
  Education: 3,
  "Savings & Investments": 20,
  Other: 5,
};

export interface Recommendation {
  category: ExpenseCategory;
  currentAmount: number;
  currentPercent: number;
  benchmarkPercent: number;
  suggestedCut: number;
  monthlySaving: number;
}

export function getRecommendations(
  income: number,
  expenses: Expense[]
): Recommendation[] {
  const byCategory = new Map<ExpenseCategory, number>();
  for (const e of expenses) {
    byCategory.set(e.category, (byCategory.get(e.category) ?? 0) + e.amount);
  }

  const recs: Recommendation[] = [];

  for (const [category, amount] of byCategory) {
    if (category === "Savings & Investments") continue;
    const currentPercent = (amount / income) * 100;
    const benchmark = BENCHMARK_PERCENTAGES[category];

    if (currentPercent > benchmark + 2) {
      const suggestedCutPercent = Math.min(
        30,
        Math.round(((currentPercent - benchmark) / currentPercent) * 100)
      );
      const monthlySaving = Math.round(amount * (suggestedCutPercent / 100));
      recs.push({
        category,
        currentAmount: amount,
        currentPercent: Math.round(currentPercent * 10) / 10,
        benchmarkPercent: benchmark,
        suggestedCut: suggestedCutPercent,
        monthlySaving,
      });
    }
  }

  return recs.sort((a, b) => b.monthlySaving - a.monthlySaving);
}

export interface ProjectionPoint {
  year: number;
  current: number;
  moderate: number;
  aggressive: number;
}

export function calculateProjections(
  income: number,
  totalExpenses: number,
  recommendations: Recommendation[],
  annualReturn: number = 5,
  years: number = 10
): ProjectionPoint[] {
  const currentMonthlySaving = Math.max(0, income - totalExpenses);

  const totalPossibleSaving = recommendations.reduce(
    (sum, r) => sum + r.monthlySaving,
    0
  );
  const moderateSaving =
    currentMonthlySaving + Math.round(totalPossibleSaving * 0.5);
  const aggressiveSaving = currentMonthlySaving + totalPossibleSaving;

  const monthlyRate = annualReturn / 100 / 12;
  const points: ProjectionPoint[] = [
    { year: 0, current: 0, moderate: 0, aggressive: 0 },
  ];

  for (let y = 1; y <= years; y++) {
    const months = y * 12;
    const fvFactor =
      monthlyRate > 0
        ? ((1 + monthlyRate) ** months - 1) / monthlyRate
        : months;

    points.push({
      year: y,
      current: Math.round(currentMonthlySaving * fvFactor),
      moderate: Math.round(moderateSaving * fvFactor),
      aggressive: Math.round(aggressiveSaving * fvFactor),
    });
  }

  return points;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(value);
}
