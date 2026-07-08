import Link from "next/link";
import { Scissors, TrendingUp, PiggyBank } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight">ClearCut</span>
          <Link
            href="/app"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl text-center space-y-8 py-20">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
            See where your money goes.
            <br />
            <span className="text-muted-foreground">
              See where it could go.
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Enter your income and expenses. Get clear recommendations on where
            to cut back, and see what your savings could look like in 5 or 10
            years.
          </p>
          <Link
            href="/app"
            className="inline-flex bg-primary text-primary-foreground px-8 py-3 rounded-md text-base font-medium hover:opacity-90 transition-opacity"
          >
            Start Now &mdash; It&apos;s Free
          </Link>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 text-left">
            <div className="space-y-2">
              <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                <PiggyBank className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">Track Spending</h3>
              <p className="text-sm text-muted-foreground">
                Categorise your expenses and see exactly what percentage of your
                pay goes where.
              </p>
            </div>
            <div className="space-y-2">
              <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                <Scissors className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">Cut Smart</h3>
              <p className="text-sm text-muted-foreground">
                Get ranked recommendations on where to reduce spending based on
                real benchmarks.
              </p>
            </div>
            <div className="space-y-2">
              <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">Project Growth</h3>
              <p className="text-sm text-muted-foreground">
                See your savings in 5 and 10 years under different scenarios
                with compound growth.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        ClearCut &mdash; No data stored. Everything runs in your browser.
      </footer>
    </div>
  );
}
