import { apiBaseUrl, defaultElderUserId } from '../../../lib/config';
import { ChecklistNotice, DataSourceNotice, DemoStepNotice, EmptyState, PageHeader, StatCard, pageStyles } from '../../ui/page-kit';
import { MedicationForm } from './medication-form';

type MedicationReminder = {
  id: string;
  medicineName: string;
  dosageText: string;
  remindTime: string;
  repeatRule: string;
  enabled: boolean;
};

const mockReminders: MedicationReminder[] = [
  {
    id: 'med-1',
    medicineName: '氨氯地平',
    dosageText: '每日早晨 1 片',
    remindTime: '08:00',
    repeatRule: 'daily',
    enabled: true,
  },
  {
    id: 'med-2',
    medicineName: '二甲双胍',
    dosageText: '每日晚餐后 1 片',
    remindTime: '18:30',
    repeatRule: 'daily',
    enabled: true,
  },
];

const repeatRuleLabelMap: Record<string, string> = {
  daily: '每天提醒',
  weekdays: '工作日提醒',
  weekly: '每周提醒',
};

async function getMedicationReminders(): Promise<{ reminders: MedicationReminder[]; source: 'api' | 'mock'; note?: string }> {
  if (!defaultElderUserId) {
    return {
      reminders: mockReminders,
      source: 'mock',
      note: '当前没读到默认老人档案，所以先放演示提醒，避免这一步因为空数据断掉。',
    };
  }

  try {
    const response = await fetch(`${apiBaseUrl}/api/medications/elder/${defaultElderUserId}`, {
      cache: 'no-store',
    });
    const payload = await response.json();

    if (!response.ok || payload.code !== 0 || !Array.isArray(payload.data)) {
      throw new Error(payload?.message || '加载用药提醒失败');
    }

    return {
      reminders: payload.data,
      source: 'api',
    };
  } catch (error) {
    return {
      reminders: mockReminders,
      source: 'mock',
      note: error instanceof Error ? `刚才没拿到真实提醒，先用演示数据继续讲解：${error.message}` : '刚才没拿到真实提醒，先用演示数据继续讲解。',
    };
  }
}

export default async function Page() {
  const { reminders, source, note } = await getMedicationReminders();

  return (
    <main style={pageStyles.main}>
      <PageHeader
        title="用药提醒"
        description="这一步把老人端的日常管理补完整：除了任务和指标，还要告诉老人什么时候吃什么药。"
      />

      <DemoStepNotice
        step="演示第 4 步"
        current="建议新增或展示一条常用药提醒，让后面的家属看板能自然出现“正在提醒什么药”。"
        next="补完提醒后切到“家属看板”，从家属视角查看老人近况。"
      />

      <DataSourceNotice source={source} fallbackNote={note} mockLabel="当前先用演示提醒把主链路讲顺；真实 API 一恢复，这里会自动切回真实用药数据。" />

      <ChecklistNotice
        title="这一页建议顺手讲清楚"
        items={[
          '用 1 条常用药提醒说明系统不是只记结果，也在提醒老人日常执行。',
          '顺手提一下顶部接入状态，帮助现场区分真实联调和演示兜底。',
          '下一页切到“家属看板”，强调这些提醒会自动汇总给家属。',
        ]}
      />

      <MedicationForm />

      <section style={pageStyles.statGrid}>
        <StatCard label="当前接入状态" value={source === 'api' ? '真实 API' : '演示数据'} />
        <StatCard label="提醒数量" value={`${reminders.length} 条`} />
      </section>

      {reminders.length === 0 ? (
        <EmptyState title="暂时还没有用药提醒" description="可以先新增一条常用药提醒，让老人端记录与家属端摘要都能展示真实内容。" />
      ) : (
        <section style={pageStyles.listSection}>
          {reminders.map((reminder) => (
            <article key={reminder.id} style={pageStyles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
                <div>
                  <h2 style={{ margin: '0 0 8px', fontSize: 20 }}>{reminder.medicineName}</h2>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span style={pageStyles.tag}>{repeatRuleLabelMap[reminder.repeatRule] ?? reminder.repeatRule}</span>
                    <span style={{ background: reminder.enabled ? '#ecfdf3' : '#f2f4f7', color: reminder.enabled ? '#027a48' : '#667085', borderRadius: 999, padding: '4px 10px', fontSize: 12 }}>
                      {reminder.enabled ? '已启用' : '已停用'}
                    </span>
                  </div>
                </div>
                <div style={{ color: '#667085' }}>{reminder.remindTime}</div>
              </div>

              <p style={{ color: '#475467', margin: 0 }}>{reminder.dosageText}</p>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
