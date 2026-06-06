import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "ghost" | "text" | "accent";
    fullWidth?: boolean;
    size?: "default" | "large";
  }
>;

export function Button({
  children,
  className = "",
  fullWidth = false,
  size = "default",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  const sizeClass = size === "large" ? "px-[22px] py-3.5" : "px-[18px] py-3";

  const variantClass = {
    primary:
      "border border-transparent bg-ink text-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:-translate-y-0.5",
    ghost: "border border-border bg-white/90 text-ink hover:-translate-y-0.5",
    text: "border-none bg-transparent px-0 py-0 text-ink-soft shadow-none hover:-translate-y-0.5",
    accent: "border border-transparent bg-accent text-[#181818] shadow-none hover:-translate-y-0.5"
  }[variant];

  return (
    <button
      className={[
        "inline-flex items-center justify-center gap-2.5 rounded-full transition duration-200",
        variant === "text" ? variantClass : `${sizeClass} ${variantClass}`,
        fullWidth ? "w-full justify-between" : "",
        className
      ].join(" ")}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
