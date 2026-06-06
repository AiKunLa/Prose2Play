import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { SectionTitle } from "../../components/ui/SectionTitle";
import { Icon } from "../../shared/icons/Icon";
import {
  aiSettingSliders,
  audienceOptions,
  newJobContent,
  newJobNote,
  uploadChapters
} from "./data/jobs";
import { SliderStack } from "./components/SliderStack";
import { UploadChapterList } from "./components/UploadChapterList";

type NewJobViewProps = {
  onContinue: () => void;
};

export function NewJobView({ onContinue }: NewJobViewProps) {
  return (
    <div className="grid gap-7">
      <section className="flex flex-col items-start gap-6">
        <div>
          <Badge>{newJobContent.badge}</Badge>
          <h1 className="mt-2.5 text-[clamp(2rem,3vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.03em]">
            {newJobContent.title}
          </h1>
          <p className="max-w-[720px] text-base leading-[1.75] text-ink-soft">{newJobContent.description}</p>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.92fr)]">
        <div className="grid gap-5">
          <Card>
            <div className="mb-[18px]">
              <SectionTitle title="项目设定" description="用清晰的创作目标约束生成结果。" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-[0.88rem] font-semibold">项目名称</span>
                <input defaultValue="Project Alpha · 雨城谜案" type="text" />
              </label>
              <label className="grid gap-2">
                <span className="text-[0.88rem] font-semibold">目标时长</span>
                <input defaultValue="45 分钟 / 单集" type="text" />
              </label>
              <label className="grid gap-2 md:col-span-2">
                <span className="text-[0.88rem] font-semibold">改编简介</span>
                <textarea
                  defaultValue="把悬疑小说前三章改编为高压、克制、偏电影感的试播集开场。保留都市湿冷氛围，增强人物之间的暗流。"
                  rows={5}
                />
              </label>
              <div className="grid gap-2 md:col-span-2">
                <span className="text-[0.88rem] font-semibold">受众方向</span>
                <div className="flex flex-wrap gap-2.5">
                  {audienceOptions.map((option, index) => (
                    <button
                      className={[
                        "rounded-full border px-3.5 py-2.5 text-sm transition duration-200 hover:-translate-y-0.5",
                        index === 0
                          ? "border-[rgba(255,187,23,0.34)] bg-surface-warm text-accent-deep"
                          : "border-border bg-white text-ink-soft hover:bg-surface-warm hover:text-accent-deep"
                      ].join(" ")}
                      key={option}
                      type="button"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="mb-[18px] flex flex-col items-start justify-between gap-4 sm:flex-row">
              <SectionTitle title="章节上传" description="上传原文并校验格式，之后可进入分析阶段。" />
              <Button variant="ghost">
                <Icon name="upload" />
                <span>上传章节</span>
              </Button>
            </div>

            <UploadChapterList chapters={uploadChapters} />
          </Card>
        </div>

        <div className="grid gap-5 self-start xl:sticky xl:top-[104px]">
          <Card as="aside">
            <div className="mb-[18px]">
              <SectionTitle title="AI 设定" description="设计稿中的右侧智能控制卡。" />
            </div>

            <SliderStack metrics={aiSettingSliders} />

            <div className="my-5 h-px bg-border" />

            <div className="rounded-[18px] bg-surface-warm p-[18px]">
              <div className="text-[0.72rem] font-bold uppercase tracking-[0.1em] text-ink-faint">推荐工作流</div>
              <p className="mt-2 text-sm leading-7 text-ink-soft">{newJobNote}</p>
            </div>

            <Button className="mt-5" fullWidth onClick={onContinue} variant="primary">
              <span>创建并进入项目详情</span>
              <Icon name="arrow" />
            </Button>
          </Card>
        </div>
      </section>
    </div>
  );
}
