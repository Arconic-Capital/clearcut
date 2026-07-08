"use client";

import { useState } from "react";
import Link from "next/link";
import { IncomeStep } from "@/components/income-step";
import { ExpensesStep } from "@/components/expenses-step";
import { Dashboard } from "@/components/dashboard";
import type { Expense } from "@/lib/benchmarks";

type Step = "income" | "expenses" | "dashboard";

const STEPS: { key: Step; label: string }[] = [
  { key: "income", label: "Income" },
  { key: "expenses", label: "Expenses" },
  { key: "dashboard", label: "Results" },
];

export default function AppPage() {
  const [step, setStep] = useState<Step>("income");
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const stepIndex = STEPS.findIndex((s) => s.key === step);

  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="ambient-mint -top-60 -left-60" />

      <header className="relative z-10 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            ClearCut<span className="text-mint-dark">.</span>
          </Link>

          <nav className="flex items-center gap-3" aria-label="Progress">
            {STEPS.map((s, i) => (
              <div key={s.key} className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-6 w-6 rounded-full border text-[11px] font-mono flex items-center justify-center transition-colors duration-300 ${
                      i < stepIndex
                        ? "bg-mint border-mint text-mint-dark"
                        : i === stepIndex
                        ? "bg-foreground border-foreground text-background"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {i < stepIndex ? (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                        <path
                          d="M1.5 5.5L4 8L8.5 2.5"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </span>
                  <span
                    className={`hidden sm:inline text-xs font-medium ${
                      i === stepIndex ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <span
                    className={`w-8 h-px ${
                      i < stepIndex ? "bg-mint-dark/30" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </nav>
        </div>
      </header>

      <main className="relative z-10 flex-1 max-w-4xl w-full mx-auto px-6 py-12">
        <div key={step} className="animate-rise">
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
        </div>
      </main>
    </div>
  );
}
