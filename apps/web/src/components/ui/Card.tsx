import type { HTMLAttributes, PropsWithChildren } from "react";

type CardProps = PropsWithChildren<
  HTMLAttributes<HTMLElement> & {
    as?: "article" | "section" | "div" | "aside" | "nav";
    variant?: "glass" | "section";
  }
>;

export function Card({
  as = "article",
  children,
  className = "",
  variant = "section",
  ...props
}: CardProps) {
  const Component = as;

  const variantClass =
    variant === "glass"
      ? "rounded-[24px] border border-border bg-white/88 shadow-soft backdrop-blur-[18px]"
      : "rounded-[24px] border border-border bg-white/88 p-[26px] shadow-soft backdrop-blur-[18px]";

  return (
    <Component className={[variantClass, className].join(" ")} {...props}>
      {children}
    </Component>
  );
}
