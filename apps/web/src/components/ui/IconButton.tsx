import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type IconButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    size?: "default" | "small";
  }
>;

export function IconButton({
  children,
  className = "",
  size = "default",
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      className={[
        "inline-flex items-center justify-center rounded-full border border-border bg-white/90 text-ink-soft transition duration-200 hover:-translate-y-0.5",
        size === "small" ? "h-[34px] w-[34px]" : "h-[42px] w-[42px]",
        className
      ].join(" ")}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
