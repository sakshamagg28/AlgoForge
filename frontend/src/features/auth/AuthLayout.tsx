import type { ReactNode } from "react";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-lg border border-ink/10 bg-white p-8 shadow-soft">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-moss">AlgoForge</p>
          <h1 className="mt-2 text-3xl font-bold text-ink">Interview prep command center</h1>
          <p className="mt-3 text-sm leading-6 text-ink/65">Learn, practice, submit, and track your DSA work in one place.</p>
        </div>
        {children}
      </div>
    </main>
  );
}
