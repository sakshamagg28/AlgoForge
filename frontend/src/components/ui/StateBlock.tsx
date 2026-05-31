import type { ReactNode } from "react";

type StateBlockProps = {
  title: string;
  children?: ReactNode;
};

export function StateBlock({ title, children }: StateBlockProps) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950 p-6 text-center shadow-soft">
      <p className="font-semibold text-slate-100">{title}</p>
      {children ? <div className="mt-2 text-sm text-slate-400">{children}</div> : null}
    </div>
  );
}
