import { Icon } from "../../../shared/icons/Icon";
import type { UploadChapter } from "../types";

type UploadChapterListProps = {
  chapters: UploadChapter[];
};

export function UploadChapterList({ chapters }: UploadChapterListProps) {
  return (
    <div className="grid gap-3">
      {chapters.map((chapter) => (
        <div
          className="flex items-start gap-3 rounded-[18px] border border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(249,248,246,0.96))] p-4"
          key={chapter.name}
        >
          <div className="grid h-[38px] w-[38px] place-items-center rounded-xl bg-surface-warm text-accent-deep">
            <Icon name="document" />
          </div>
          <div className="flex-1">
            <strong className="mb-1 block text-[0.95rem]">{chapter.name}</strong>
            <p className="text-sm text-ink-faint">{chapter.size}</p>
          </div>
          <span className="text-[0.75rem] font-semibold text-ink-faint">{chapter.status}</span>
        </div>
      ))}
    </div>
  );
}
