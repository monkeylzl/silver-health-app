import { ChecklistNotice, DemoStepNotice, PageHeader, pageStyles } from './ui/page-kit';

const demoSteps = [
  {
    href: '/elder/profile',
    title: '1. 老人建档',
    summary: '先填写基础信息，建立这次演示的主角档案。',
    actionHint: '现场操作：建议真的保存 1 次。',
  },
  {
    href: '/elder/home',
    title: '2. 今日任务',
    summary: '建档后回到老人首页，直接看到今天要做什么。',
    actionHint: '现场操作：勾掉 1 个任务最自然。',
  },
  {
    href: '/elder/metrics',
    title: '3. 健康指标录入',
    summary: '补一条血压、血糖或体重记录，让后续家属端有新内容可看。',
    actionHint: '现场操作：新增 1 条指标，后面家属页就有联动。',
  },
  {
    href: '/elder/medication',
    title: '4. 用药提醒',
    summary: '补充常用药提醒，形成老人日常管理的完整上下文。',
    actionHint: '轻讲即可：已有提醒时不用现场再填。',
  },
  {
    href: '/family/dashboard',
    title: '5. 家属看板',
    summary: '切到家属视角，一页查看任务、指标和用药摘要。',
    actionHint: '轻讲即可：重点指“一句话近况”和“最该关注”。',
  },
  {
    href: '/family/report',
    title: '6. 家属周报',
    summary: '最后看周报回顾，说明长期跟踪与回顾能力。',
    actionHint: '轻讲即可：用“本周总结 + 下周关注”收尾。',
  },
  {
    href: '/family/bind',
    title: '补充：家属绑定',
    summary: '如果需要讲清关系建立过程，可在周报前后补充这一页。',
    actionHint: '只在被追问时打开，不主动展开。',
  },
];

export default function HomePage() {
  return (
    <main className="app-shell" style={pageStyles.main}>
      <PageHeader
        title="Silver Health 演示入口"
        description="按固定顺序讲就行：建档 → 今日任务 → 指标录入 → 用药提醒 → 家属看板 → 家属周报。"
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
          '如果 `pnpm demo:ready` 已通过，就直接把结论理解成：现在可以开 API / Web，并优先从首页 / 开讲。',
          '首页 `/` 能正常打开，再抽查 `/elder/home` 和 `/family/dashboard`，顶部优先看到“当前接入：真实 API”。',
          '如果要讲完整主链路，再额外确认 `/elder/home` 有今日任务、`/family/dashboard` 有一句话近况、`/family/report` 能看到最近完整周周报。',
        ]}
      />

      <ChecklistNotice
        title="忘词时就按这 6 句讲"
        tone="success"
        items={[
          '先建档，后面所有页面都围绕这位老人。',
          '今日任务承接当天动作。',
          '录 1 条指标，家属侧就会有新内容。',
          '用药提醒补齐长期管理。',
          '家属看板看今天。',
          '家属周报看这一周。',
        ]}
      />

      <ChecklistNotice
        title="如果现场没连上真实 API"
        items={[
          '先直接指出顶部“当前接入：演示数据”，说明当前先用演示数据保住讲解节奏。',
          '仍按同一条主链路讲：建档 → 今日任务 → 指标录入 → 家属看板 / 周报，不临时改故事。',
          '讲完后再补一句：真实 API 恢复后，顶部提示会自动切回“当前接入：真实 API”。',
        ]}
      />

      <ChecklistNotice
        title="现场操作分层"
        items={[
          '建议现场操作：`/elder/profile` 保存 1 次、`/elder/home` 完成 1 项任务、`/elder/metrics` 新增 1 条指标。',
          '优先只讲即可：`/elder/medication`、`/family/dashboard`、`/family/report`。',
          '只在被问到时再补：`/family/bind`。',
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
