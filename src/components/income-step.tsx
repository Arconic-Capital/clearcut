"use client";

import { useState } from "react";

interface IncomeStepProps {
  income: number;
  onNext: (income: number) => void;
}

export function IncomeStep({ income, onNext }: IncomeStepProps) {
  const [value, setValue] = useState(income > 0 ? income.toString() : "");
  const parsed = parseFloat(value);
  const isValid = !isNaN(parsed) && parsed > 0;

  return (
    <div className="max-w-md mx-auto pt-16">
      <div className="text-center mb-12">
        <span className="tag-neutral mb-6">Step 1 of 3</span>
        <h1 className="font-serif-display text-4xl sm:text-5xl font-medium mt-6 mb-4">
          What lands in
          <br />
          <em>your account?</em>
        </h1>
        <p className="text-muted-foreground">
          Monthly take-home pay, after tax.
        </p>
      </div>

      <div className="card-flat p-8">
        <label htmlFor="income" className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
          Monthly income
        </label>
        <div className="relative mb-2">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-muted-foreground font-mono">
            $
          </span>
          <input
            id="income"
            type="number"
            placeholder="5,000"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && isValid) onNext(parsed);
            }}
            autoFocus
            className="input-flat no-spinner w-full px-4 pl-10 py-4 text-3xl font-mono text-center"
          />
        </div>
        <p className="text-xs text-muted-foreground text-center mb-6 font-mono">
          per month, after tax
        </p>
        <button
          disabled={!isValid}
          onClick={() => onNext(parsed)}
          className="btn-primary w-full py-3.5 text-sm"
        >
          Continue to expenses
        </button>
      </div>
    </div>
  );
}
