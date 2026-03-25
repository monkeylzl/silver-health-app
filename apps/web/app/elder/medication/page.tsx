import { apiBaseUrl, defaultElderUserId } from '../../../lib/config';
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

async function getMedicationReminders(): Promise<{ reminders: MedicationReminder[]; source: 'api' | 'mock'; note?: string }> {
  if (!defaultElderUserId) {
    return {
      reminders: mockReminders,
      source: 'mock',
      note: '当前未设置 NEXT_PUBLIC_DEFAULT_ELDER_USER_ID，先展示 mock 用药提醒。',
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
      note: error instanceof Error ? `API 加载失败，当前回退到 mock 数据：${error.message}` : 'API 加载失败，当前回退到 mock 数据。',
    };
  }
}

export default async function Page() {
  const { reminders, source, note } = await getMedicationReminders();

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ marginBottom: 8 }}>用药提醒</h1>
        <p style={{ color: '#667085', margin: 0 }}>
          当前先推进 MVP 第四条主链路：用药提醒。第一版先支持“新增提醒 + 查看提醒列表”。
        </p>
      </div>

      <MedicationForm />

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#ffffff', borderRadius: 16, padding: 20, boxShadow: '0 8px 24px rgba(15,23,42,0.06)' }}>
          <div style={{ color: '#667085', marginBottom: 8 }}>当前数据源</div>
          <strong>{source === 'api' ? '真实 API' : 'Mock 回退'}</strong>
        </div>
        <div style={{ background: '#ffffff', borderRadius: 16, padding: 20, boxShadow: '0 8px 24px rgba(15,23,42,0.06)' }}>
          <div style={{ color: '#667085', marginBottom: 8 }}>提醒数量</div>
          <strong>{reminders.length} 条</strong>
        </div>
      </section>

      {note ? (
        <div style={{ marginBottom: 20, background: '#fffaeb', border: '1px solid #fedf89', borderRadius: 12, padding: '12px 14px', color: '#b54708' }}>
          {note}
        </div>
      ) : null}

      <section style={{ display: 'grid', gap: 16 }}>
        {reminders.map((reminder) => (
          <article key={reminder.id} style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 8px 24px rgba(15,23,42,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
              <div>
                <h2 style={{ margin: '0 0 8px', fontSize: 20 }}>{reminder.medicineName}</h2>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ background: '#f2f4f7', color: '#344054', borderRadius: 999, padding: '4px 10px', fontSize: 12 }}>
                    {reminder.repeatRule}
                  </span>
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
    </main>
  );
}
