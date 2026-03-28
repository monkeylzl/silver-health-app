import { DemoStepNotice, PageHeader, pageStyles } from '../../ui/page-kit';
import { ElderProfileForm } from './elder-profile-form';

export default function Page() {
  return (
    <main style={pageStyles.main}>
      <PageHeader
        title="老人建档"
        description="演示从这里开始：先把老人基础情况录入清楚，后面的今日任务、指标和家属看板都会围绕这份档案展开。"
      />
      <DemoStepNotice
        step="演示第 1 步"
        current="建议先完整保存一份老人档案，让后续页面都围绕同一位老人继续展开。"
        next="建档完成后进入“今日任务”，说明今天需要做什么。"
      />
      <ElderProfileForm />
    </main>
  );
}
