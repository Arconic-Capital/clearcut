"use client";

import { useState } from "react";
import type { Debt, Goal } from "@/lib/benchmarks";

interface GoalsStepProps {
  goals: Goal[];
  debts: Debt[];
  onBack: () => void;
  onNext: (goals: Goal[], debts: Debt[]) => void;
}

function IconRemove() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconAdd() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 2V12M2 7H12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function GoalsStep({ goals: initialGoals, debts: initialDebts, onBack, onNext }: GoalsStepProps) {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [debts, setDebts] = useState<Debt[]>(initialDebts);

  const [goalLabel, setGoalLabel] = useState("");
  const [goalTarget, setGoalTarget] = useState("");

  const [debtLabel, setDebtLabel] = useState("");
  const [debtBalance, setDebtBalance] = useState("");
  const [debtRate, setDebtRate] = useState("");

  const addGoal = () => {
    const target = parseFloat(goalTarget);
    if (isNaN(target) || target <= 0) return;
    setGoals((prev) => [
      ...prev,
      { id: crypto.randomUUID(), label: goalLabel || "Savings goal", target },
    ]);
    setGoalLabel("");
    setGoalTarget("");
  };

  const addDebt = () => {
    const balance = parseFloat(debtBalance);
    const rate = parseFloat(debtRate);
    if (isNaN(balance) || balance <= 0 || isNaN(rate) || rate < 0) return;
    setDebts((prev) => [
      ...prev,
      { id: crypto.randomUUID(), label: debtLabel || "Debt", balance, rate },
    ]);
    setDebtLabel("");
    setDebtBalance("");
    setDebtRate("");
  };

  return (
    <div className="max-w-lg mx-auto pt-10">
      <div className="text-center mb-10">
        <span className="tag-neutral mb-6">Step 3 of 4 · Optional</span>
        <h1 className="font-serif-display text-4xl sm:text-5xl font-medium mt-6 mb-4">
          What are you
          <br />
          <em>aiming for?</em>
        </h1>
        <p className="text-muted-foreground">
          Add savings goals and any debts. Both are optional — skip if they
          don&apos;t apply.
        </p>
      </div>

      <div className="card-flat p-6 sm:p-8 mb-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
          Savings goals
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          A house deposit, a car, an emergency fund. We&apos;ll show when each
          scenario gets you there.
        </p>

        {goals.length > 0 && (
          <div className="divide-y divide-border mb-4">
            {goals.map((g) => (
              <div key={g.id} className="group flex items-center gap-3 py-3">
                <span className="flex-1 text-sm font-medium truncate">{g.label}</span>
                <span className="font-mono text-sm">${g.target.toLocaleString()}</span>
                <button
                  onClick={() => setGoals((prev) => prev.filter((x) => x.id !== g.id))}
                  aria-label={`Remove ${g.label}`}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity p-1"
                >
                  <IconRemove />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input
            placeholder="House deposit"
            aria-label="Goal name"
            value={goalLabel}
            onChange={(e) => setGoalLabel(e.target.value)}
            className="input-flat flex-1 px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="$ target"
            aria-label="Goal target amount"
            value={goalTarget}
            onChange={(e) => setGoalTarget(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addGoal();
            }}
            className="input-flat no-spinner w-28 px-3 py-2 text-sm font-mono"
          />
          <button
            onClick={addGoal}
            aria-label="Add goal"
            className="btn-ghost h-9 w-9 flex items-center justify-center shrink-0"
          >
            <IconAdd />
          </button>
        </div>
      </div>

      <div className="card-flat p-6 sm:p-8">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
          Debts
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Credit cards, car loans, personal loans. Your surplus pays these off
          first, highest rate leading.
        </p>

        {debts.length > 0 && (
          <div className="divide-y divide-border mb-4">
            {debts.map((d) => (
              <div key={d.id} className="group flex items-center gap-3 py-3">
                <span className="flex-1 text-sm font-medium truncate">{d.label}</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {d.rate}% p.a.
                </span>
                <span className="font-mono text-sm">${d.balance.toLocaleString()}</span>
                <button
                  onClick={() => setDebts((prev) => prev.filter((x) => x.id !== d.id))}
                  aria-label={`Remove ${d.label}`}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity p-1"
                >
                  <IconRemove />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input
            placeholder="Credit card"
            aria-label="Debt name"
            value={debtLabel}
            onChange={(e) => setDebtLabel(e.target.value)}
            className="input-flat flex-1 px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="$ owing"
            aria-label="Debt balance"
            value={debtBalance}
            onChange={(e) => setDebtBalance(e.target.value)}
            className="input-flat no-spinner w-24 px-3 py-2 text-sm font-mono"
          />
          <input
            type="number"
            placeholder="% rate"
            aria-label="Debt annual interest rate"
            value={debtRate}
            onChange={(e) => setDebtRate(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addDebt();
            }}
            className="input-flat no-spinner w-20 px-3 py-2 text-sm font-mono"
          />
          <button
            onClick={addDebt}
            aria-label="Add debt"
            className="btn-ghost h-9 w-9 flex items-center justify-center shrink-0"
          >
            <IconAdd />
          </button>
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <button onClick={onBack} className="btn-ghost flex-1 py-3 text-sm">
          Back
        </button>
        <button
          onClick={() => onNext(goals, debts)}
          className="btn-primary flex-1 py-3 text-sm"
        >
          {goals.length === 0 && debts.length === 0 ? "Skip — see results" : "See results"}
        </button>
      </div>
    </div>
  );
}
