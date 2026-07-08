"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { IncomeStep } from "@/components/income-step";
import { ExpensesStep } from "@/components/expenses-step";
import { Dashboard } from "@/components/dashboard";
import type { Expense } from "@/lib/benchmarks";

type Step = "income" | "expenses" | "dashboard";

export default function AppPage() {
  const [step, setStep] = useState<Step>("income");
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const stepIndex = step === "income" ? 0 : step === "expenses" ? 1 : 2;

  const steps = useMemo(
    () => [
      { key: "income" as const, label: "Income" },
      { key: "expenses" as const, label: "Expenses" },
      { key: "dashboard" as const, label: "Results" },
    ],
    []
  );

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            ClearCut
          </Link>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            {steps.map((s, i) => (
              <span key={s.key} className="flex items-center gap-1">
                <span
                  className={
                    i <= stepIndex
                      ? "text-foreground font-medium"
                      : "text-muted-foreground"
                  }
                >
                  {s.label}
                </span>
                {i < steps.length - 1 && <span className="mx-1">/</span>}
              </span>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-10">
        {step === "income" && (
          <IncomeStep
            income={income}
            onNext={(val) => {
              setIncome(val);
              setStep("expenses");
            }}
          />
        )}
        {step === "expenses" && (
          <ExpensesStep
            expenses={expenses}
            onBack={() => setStep("income")}
            onNext={(exps) => {
              setExpenses(exps);
              setStep("dashboard");
            }}
          />
        )}
        {step === "dashboard" && (
          <Dashboard
            income={income}
            expenses={expenses}
            onBack={() => setStep("expenses")}
            onReset={() => {
              setIncome(0);
              setExpenses([]);
              setStep("income");
            }}
          />
        )}
      </main>
    </div>
  );
}
