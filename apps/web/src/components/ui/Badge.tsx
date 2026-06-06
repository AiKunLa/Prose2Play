import type { PropsWithChildren } from "react";

type BadgeProps = PropsWithChildren<{
  tone?: "accent" | "dark";
  className?: string;
}>;

export function Badge({ children, className = "", tone = "accent" }: BadgeProps) {
  const toneClass =
    tone === "dark"
      ? "bg-white/8 text-[#f0f0f0]"
      : "bg-accent-glow text-accent-deep";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-2 text-[0.72rem] font-bold uppercase tracking-[0.1em]",
        toneClass,
        className
      ].join(" ")}
    >
      {children}
    </span>
  );
}
