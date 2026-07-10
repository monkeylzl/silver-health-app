import { ChecklistNotice, DemoStepNotice, PageHeader, pageStyles } from '../ui/page-kit';

const demoSteps = [
  {
    href: '/elder/profile',
    title: '1. 老人建档',
    summary: '先填写基础信息，建立这次演示的主角档案。',
    actionHint: '现场操作：建议真的保存 1 次。',
  },
  {
    href: '/',
    title: '2. 今日任务',
    summary: '建档后回到今日工作台，直接看到今天要做什么。',
    actionHint: '现场操作：勾掉 1 个任务最自然。',
  },
  {
    href: '/health',
    title: '3. 健康中心',
    summary: '补一条血压、血糖或体重记录，让后续家属端有新内容可看。',
    actionHint: '现场操作：新增 1 条指标，后面家属页就有联动。',
  },
  {
    href: '/family/dashboard',
    title: '4. 家属看板',
    summary: '切到家属视角，一页查看任务、指标和用药摘要。',
    actionHint: '轻讲即可：重点指“一句话近况”和“最该关注”。',
  },
  {
    href: '/family/report',
    title: '5. 家属周报',
    summary: '最后看周报回顾，说明长期跟踪与回顾能力。',
    actionHint: '轻讲即可：用“本周总结 + 下周关注”收尾。',
  },
];

export default function DemoPage() {
  return (
    <main className="app-shell" style={pageStyles.main}>
      <PageHeader
        title="演示入口"
        description="这一页保留给路演和交接使用；正式手机体验默认从“今日”工作台开始。"
      />

      <DemoStepNotice
        step="先记 1 句"
        current="老人负责日常执行，家属负责远程查看。"
        next="如果被问到双方怎么关联，再补讲“家属绑定”。"
      />

      <ChecklistNotice
        title="演示前 30 秒检查"
        items={[
          '优先跑 `pnpm demo:ready`，至少也要确认 `pnpm check:demo` 通过。',
          '首页 `/` 能正常打开，再抽查 `/health` 和 `/family/dashboard`。',
          '如果要讲完整主链路，再额外确认今日任务、家属看板和周报都有数据。',
        ]}
      />

      <section className="list-section demo-step-grid" style={{ ...pageStyles.listSection, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        {demoSteps.map((step) => (
          <a key={step.href} href={step.href} className="link-card" style={pageStyles.linkCard}>
            <strong style={{ display: 'block', marginBottom: 10, fontSize: 18 }}>{step.title}</strong>
            <p style={{ margin: 0, color: '#475467', lineHeight: 1.6 }}>{step.summary}</p>
            <p style={{ margin: '10px 0 0', color: '#667085', fontSize: 14, lineHeight: 1.5 }}>{step.actionHint}</p>
          </a>
        ))}
      </section>
    </main>
  );
}
