import { Card } from "../../../components/ui/Card";
import { Icon } from "../../../shared/icons/Icon";
import type { RoleCard } from "../types";

type RoleCardGridProps = {
  cards: RoleCard[];
};

export function RoleCardGrid({ cards }: RoleCardGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <Card className="p-[22px]" key={card.title} variant="glass">
          <div className="grid h-[38px] w-[38px] place-items-center rounded-xl bg-surface-warm text-accent-deep">
            <Icon name="group" />
          </div>
          <h3 className="mt-4 text-[1.35rem] tracking-[-0.02em]">{card.title}</h3>
          <p className="mt-3 text-sm leading-7 text-ink-soft">{card.text}</p>
        </Card>
      ))}
    </div>
  );
}
