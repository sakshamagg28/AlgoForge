import type { ReactNode } from "react";

type StateBlockProps = {
  title: string;
  children?: ReactNode;
};

export function StateBlock({ title, children }: StateBlockProps) {
  return (
    <div className="rounded-lg border border-ink/10 bg-white p-6 text-center shadow-soft">
      <p className="font-semibold text-ink">{title}</p>
      {children ? <div className="mt-2 text-sm text-ink/65">{children}</div> : null}
    </div>
  );
}
