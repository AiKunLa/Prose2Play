import type { PropsWithChildren } from "react";

type StatusPillProps = PropsWithChildren<{
  tone: "warning" | "success" | "info";
}>;

export function StatusPill({ children, tone }: StatusPillProps) {
  const toneClass = {
    warning: "bg-[rgba(255,187,23,0.14)] text-accent-deep",
    success: "bg-[rgba(68,169,97,0.12)] text-[#2e7b42]",
    info: "bg-[rgba(83,125,255,0.12)] text-[#3453be]"
  }[tone];

  return (
    <span className={["inline-flex w-fit items-center gap-2 rounded-full px-2.5 py-2 text-[0.78rem] font-semibold", toneClass].join(" ")}>
      <span className="h-2 w-2 rounded-full bg-current shadow-[0_0_12px_currentColor]" />
      <span>{children}</span>
    </span>
  );
}
