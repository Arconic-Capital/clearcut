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

export interface Debt {
  id: string;
  label: string;
  balance: number;
  rate: number; // annual interest %
}

export interface Goal {
  id: string;
  label: string;
  target: number;
}

export interface ProjectionPoint {
  year: number;
  current: number;
  moderate: number;
  aggressive: number;
}

export interface ScenarioResult {
  monthlySaving: number;
  netWorthByYear: number[]; // index = year, 0..years
  debtFreeMonth: number | null; // null = no debts, or not cleared within horizon
  interestPaid: number;
  goalHitMonths: Record<string, number | null>; // goalId -> month hit, null = not within horizon
}

export interface ProjectionResult {
  points: ProjectionPoint[];
  current: ScenarioResult;
  moderate: ScenarioResult;
  aggressive: ScenarioResult;
}

// Month-by-month simulation. Surplus goes to debts first (avalanche:
// highest rate first), the remainder into savings compounding monthly.
// Net worth = savings minus outstanding debt.
export function simulateScenario(
  monthlySaving: number,
  debts: Debt[],
  goals: Goal[],
  annualReturn: number,
  years: number = 10
): ScenarioResult {
  const monthlyReturn = annualReturn / 100 / 12;
  const balances = debts
    .map((d) => ({ balance: d.balance, monthlyRate: d.rate / 100 / 12 }))
    .sort((a, b) => b.monthlyRate - a.monthlyRate);

  let savings = 0;
  let interestPaid = 0;
  let debtFreeMonth: number | null = debts.length === 0 ? null : null;
  const goalHitMonths: Record<string, number | null> = {};
  for (const g of goals) goalHitMonths[g.id] = null;

  const startingDebt = balances.reduce((s, b) => s + b.balance, 0);
  const netWorthByYear: number[] = [Math.round(-startingDebt)];

  let cleared = debts.length === 0;

  for (let m = 1; m <= years * 12; m++) {
    let available = Math.max(0, monthlySaving);

    let totalDebt = 0;
    for (const b of balances) {
      if (b.balance <= 0) continue;
      const interest = b.balance * b.monthlyRate;
      b.balance += interest;
      interestPaid += interest;
    }
    for (const b of balances) {
      if (b.balance <= 0 || available <= 0) continue;
      const pay = Math.min(b.balance, available);
      b.balance -= pay;
      available -= pay;
    }
    totalDebt = balances.reduce((s, b) => s + Math.max(0, b.balance), 0);

    if (!cleared && totalDebt < 0.01) {
      cleared = true;
      debtFreeMonth = m;
    }

    savings = savings * (1 + monthlyReturn) + available;
    const netWorth = savings - totalDebt;

    for (const g of goals) {
      if (goalHitMonths[g.id] === null && netWorth >= g.target) {
        goalHitMonths[g.id] = m;
      }
    }

    if (m % 12 === 0) {
      netWorthByYear.push(Math.round(netWorth));
    }
  }

  return {
    monthlySaving,
    netWorthByYear,
    debtFreeMonth,
    interestPaid: Math.round(interestPaid),
    goalHitMonths,
  };
}

export function calculateProjections(
  income: number,
  totalExpenses: number,
  recommendations: Recommendation[],
  debts: Debt[] = [],
  goals: Goal[] = [],
  annualReturn: number = 5,
  years: number = 10
): ProjectionResult {
  const currentMonthlySaving = Math.max(0, income - totalExpenses);

  const totalPossibleSaving = recommendations.reduce(
    (sum, r) => sum + r.monthlySaving,
    0
  );
  const moderateSaving =
    currentMonthlySaving + Math.round(totalPossibleSaving * 0.5);
  const aggressiveSaving = currentMonthlySaving + totalPossibleSaving;

  const current = simulateScenario(currentMonthlySaving, debts, goals, annualReturn, years);
  const moderate = simulateScenario(moderateSaving, debts, goals, annualReturn, years);
  const aggressive = simulateScenario(aggressiveSaving, debts, goals, annualReturn, years);

  const points: ProjectionPoint[] = [];
  for (let y = 0; y <= years; y++) {
    points.push({
      year: y,
      current: current.netWorthByYear[y],
      moderate: moderate.netWorthByYear[y],
      aggressive: aggressive.netWorthByYear[y],
    });
  }

  return { points, current, moderate, aggressive };
}

export function formatMonths(m: number | null): string {
  if (m === null) return "Beyond 10 yrs";
  if (m < 12) return `${m} mo`;
  const y = Math.floor(m / 12);
  const rem = m % 12;
  return rem === 0 ? `${y} yr` : `${y} yr ${rem} mo`;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(value);
}
