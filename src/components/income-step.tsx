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

interface IncomeStepProps {
  income: number;
  onNext: (income: number) => void;
}

export function IncomeStep({ income, onNext }: IncomeStepProps) {
  const [value, setValue] = useState(income > 0 ? income.toString() : "");

  const parsed = parseFloat(value);
  const isValid = !isNaN(parsed) && parsed > 0;

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">What do you take home?</CardTitle>
        <CardDescription>
          Enter your monthly take-home pay (after tax).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="income">Monthly Income ($)</Label>
          <Input
            id="income"
            type="number"
            placeholder="e.g. 5000"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && isValid) onNext(parsed);
            }}
            autoFocus
          />
        </div>
        <Button
          className="w-full"
          disabled={!isValid}
          onClick={() => onNext(parsed)}
        >
          Next — Add Expenses
        </Button>
      </CardContent>
    </Card>
  );
}
