"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { EXPENSE_CATEGORIES, type Expense, type ExpenseCategory } from "@/lib/benchmarks";
import { Trash2, Plus } from "lucide-react";

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
        ]
  );

  const [newCategory, setNewCategory] = useState<ExpenseCategory>("Dining Out");
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

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Your Monthly Expenses</CardTitle>
        <CardDescription>
          Add your recurring monthly expenses. Update amounts or add new ones.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          {expenses.map((expense) => (
            <div key={expense.id} className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{expense.label}</div>
                <div className="text-xs text-muted-foreground">{expense.category}</div>
              </div>
              <div className="w-28">
                <Input
                  type="number"
                  placeholder="0"
                  value={expense.amount > 0 ? expense.amount : ""}
                  onChange={(e) => updateAmount(expense.id, e.target.value)}
                />
              </div>
              <button
                onClick={() => removeExpense(expense.id)}
                className="text-muted-foreground hover:text-destructive transition-colors p-1"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 space-y-3">
          <p className="text-sm font-medium">Add another expense</p>
          <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
            <div>
              <Label htmlFor="category" className="sr-only">
                Category
              </Label>
              <select
                id="category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as ExpenseCategory)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                {EXPENSE_CATEGORIES.filter((c) => c !== "Savings & Investments").map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="amount" className="sr-only">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="$ amount"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addExpense();
                }}
              />
            </div>
            <Button variant="outline" size="icon" onClick={addExpense}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Input
            placeholder="Label (optional)"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
          <Button
            className="flex-1"
            disabled={!hasExpenses}
            onClick={() => onNext(expenses.filter((e) => e.amount > 0))}
          >
            See Results
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
