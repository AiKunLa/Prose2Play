type SectionTitleProps = {
  title: string;
  description?: string;
  className?: string;
};

export function SectionTitle({ className = "", description, title }: SectionTitleProps) {
  return (
    <div className={className}>
      <h2 className="text-[1.35rem] tracking-[-0.02em]">{title}</h2>
      {description ? <p className="mt-1.5 text-sm leading-7 text-ink-soft">{description}</p> : null}
    </div>
  );
}
