import Link from "next/link";

function IconChart() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="2" y="9" width="3.2" height="7" rx="0.8" fill="#0a3d2e" />
      <rect x="7.4" y="5" width="3.2" height="11" rx="0.8" fill="#0a3d2e" />
      <rect x="12.8" y="2" width="3.2" height="14" rx="0.8" fill="#0a3d2e" />
    </svg>
  );
}

function IconScissor() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="4.5" cy="4.5" r="2.4" stroke="#0a3d2e" strokeWidth="1.8" />
      <circle cx="4.5" cy="13.5" r="2.4" stroke="#0a3d2e" strokeWidth="1.8" />
      <path d="M6.5 6L16 15M6.5 12L16 3" stroke="#0a3d2e" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconTrend() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M2 13.5L7 8.5L10.5 12L16 5.5"
        stroke="#0a3d2e"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M11.5 5.5H16V10" stroke="#0a3d2e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M2 7H12M12 7L7.5 2.5M12 7L7.5 11.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const FEATURES = [
  {
    icon: IconChart,
    title: "Track spending",
    desc: "See exactly what share of your pay goes to housing, food, transport and the rest.",
  },
  {
    icon: IconScissor,
    title: "Cut with intent",
    desc: "Ranked recommendations against real household benchmarks, sized in dollars per month.",
  },
  {
    icon: IconTrend,
    title: "Project a decade",
    desc: "Three savings scenarios compounded over five and ten years, side by side.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="ambient-mint -top-40 -right-40" />

      <header className="relative z-10 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <span className="text-lg font-semibold tracking-tight">
            ClearCut<span className="text-mint-dark">.</span>
          </span>
          <Link
            href="/app"
            className="btn-primary px-5 py-2 text-sm inline-flex items-center gap-2"
          >
            Start planning
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex-1">
        <section className="max-w-4xl mx-auto px-6 pt-28 pb-24 text-center">
          <div className="animate-rise">
            <span className="tag-mint mb-8">
              Free · No sign-up · Nothing stored
            </span>
          </div>

          <h1 className="font-serif-display text-5xl sm:text-7xl font-medium animate-rise rise-1">
            Spend less.
            <br />
            <em>Keep the difference.</em>
          </h1>

          <p className="mt-8 text-lg text-muted-foreground max-w-xl mx-auto animate-rise rise-2">
            Enter your monthly pay and expenses. ClearCut shows where the money
            goes, where to cut, and what that decision is worth in ten years.
          </p>

          <div className="mt-10 animate-rise rise-3">
            <Link
              href="/app"
              className="btn-primary inline-flex items-center gap-2.5 px-8 py-3.5 text-base"
            >
              Start planning
              <IconArrow />
            </Link>
          </div>

          <p className="mt-6 text-xs text-muted-foreground font-mono animate-rise rise-4">
            Takes about two minutes
          </p>
        </section>

        <section className="max-w-5xl mx-auto px-6 pb-32">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`card-flat p-8 text-left animate-rise rise-${i + 2}`}
              >
                <div className="h-10 w-10 rounded-lg bg-mint flex items-center justify-center mb-5">
                  <f.icon />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-border py-8 text-center">
        <p className="text-sm text-muted-foreground">
          ClearCut runs entirely in your browser. No account, no data leaves
          your device.
        </p>
      </footer>
    </div>
  );
}
