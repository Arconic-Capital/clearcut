"use client";

import { useState } from "react";
import {
  EXPENSE_CATEGORIES,
  type Expense,
  type ExpenseCategory,
} from "@/lib/benchmarks";

interface ExpensesStepProps {
  expenses: Expense[];
  onBack: () => void;
  onNext: (expenses: Expense[]) => void;
}

export function ExpensesStep({ expenses: initial, onBack, onNext }: ExpensesStepProps) {
  const [expenses, setExpenses] = useState<Expense[]>(
    initial.length > 0
      ? initial
      : [
          { id: crypto.randomUUID(), category: "Housing", label: "Rent / Mortgage", amount: 0 },
          { id: crypto.randomUUID(), category: "Groceries", label: "Groceries", amount: 0 },
          { id: crypto.randomUUID(), category: "Transport", label: "Transport", amount: 0 },
          { id: crypto.randomUUID(), category: "Utilities", label: "Utilities", amount: 0 },
          { id: crypto.randomUUID(), category: "Subscriptions", label: "Subscriptions", amount: 0 },
          { id: crypto.randomUUID(), category: "Dining Out", label: "Dining out", amount: 0 },
        ]
  );

  const [newCategory, setNewCategory] = useState<ExpenseCategory>("Entertainment");
  const [newLabel, setNewLabel] = useState("");
  const [newAmount, setNewAmount] = useState("");

  const addExpense = () => {
    const amount = parseFloat(newAmount);
    if (isNaN(amount) || amount <= 0) return;
    setExpenses((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        category: newCategory,
        label: newLabel || newCategory,
        amount,
      },
    ]);
    setNewLabel("");
    setNewAmount("");
  };

  const updateAmount = (id: string, val: string) => {
    const amount = parseFloat(val);
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, amount: isNaN(amount) ? 0 : amount } : e))
    );
  };

  const removeExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const hasExpenses = expenses.some((e) => e.amount > 0);
  const total = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="max-w-lg mx-auto pt-10">
      <div className="text-center mb-10">
        <span className="tag-neutral mb-6">Step 2 of 4</span>
        <h1 className="font-serif-display text-4xl sm:text-5xl font-medium mt-6 mb-4">
          Where does
          <br />
          <em>it all go?</em>
        </h1>
        <p className="text-muted-foreground">
          Your recurring monthly costs. Honest numbers, better plan.
        </p>
      </div>

      <div className="card-flat p-6 sm:p-8">
        <div className="divide-y divide-border">
          {expenses.map((expense, i) => (
            <div
              key={expense.id}
              className="group flex items-center gap-3 py-3 animate-rise"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{expense.label}</div>
                <div className="text-xs text-muted-foreground">{expense.category}</div>
              </div>
              <div className="relative w-28">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono">
                  $
                </span>
                <input
                  type="number"
                  placeholder="0"
                  aria-label={`${expense.label} amount`}
                  value={expense.amount > 0 ? expense.amount : ""}
                  onChange={(e) => updateAmount(expense.id, e.target.value)}
                  className="input-flat no-spinner w-full px-3 pl-7 py-2 text-sm font-mono text-right"
                />
              </div>
              <button
                onClick={() => removeExpense(expense.id)}
                aria-label={`Remove ${expense.label}`}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity p-1"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path
                    d="M3 3L11 11M11 3L3 11"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {total > 0 && (
          <div className="flex items-center justify-between mt-4 py-3 px-4 rounded-lg bg-mint">
            <span className="text-xs font-medium uppercase tracking-wider text-mint-dark">
              Total
            </span>
            <span className="font-mono font-semibold text-mint-dark">
              ${total.toLocaleString()}/mo
            </span>
          </div>
        )}

        <div className="border-t border-border mt-6 pt-6">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
            Add an expense
          </p>
          <div className="flex gap-2 mb-2">
            <select
              value={newCategory}
              aria-label="Expense category"
              onChange={(e) => setNewCategory(e.target.value as ExpenseCategory)}
              className="input-flat flex-1 px-3 py-2 text-sm"
            >
              {EXPENSE_CATEGORIES.filter((c) => c !== "Savings & Investments").map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="$"
              aria-label="New expense amount"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addExpense();
              }}
              className="input-flat no-spinner w-24 px-3 py-2 text-sm font-mono"
            />
            <button
              onClick={addExpense}
              aria-label="Add expense"
              className="btn-ghost h-9 w-9 flex items-center justify-center shrink-0"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M7 2V12M2 7H12"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
          <input
            placeholder="Label (optional)"
            aria-label="New expense label"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="input-flat w-full px-3 py-2 text-sm"
          />
        </div>

        <div className="flex gap-3 mt-8">
          <button onClick={onBack} className="btn-ghost flex-1 py-3 text-sm">
            Back
          </button>
          <button
            disabled={!hasExpenses}
            onClick={() => onNext(expenses.filter((e) => e.amount > 0))}
            className="btn-primary flex-1 py-3 text-sm"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
