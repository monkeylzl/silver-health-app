import { apiBaseUrl, defaultElderUserId } from '../../../lib/config';
import { BindForm } from './bind-form';

type BindingItem = {
  id: string;
  relationType: 'son' | 'daughter' | 'spouse' | 'other';
  status: 'pending' | 'active' | 'unbound';
  familyUserId: string;
  familyUser?: {
    nickname?: string | null;
    mobile?: string | null;
  } | null;
};

const relationLabelMap: Record<BindingItem['relationType'], string> = {
  son: '儿子',
  daughter: '女儿',
  spouse: '配偶',
  other: '其他',
};

const statusLabelMap: Record<BindingItem['status'], string> = {
  pending: '待确认',
  active: '已绑定',
  unbound: '已解绑',
};

const mockBindings: BindingItem[] = [
  {
    id: 'bind-1',
    relationType: 'daughter',
    status: 'active',
    familyUserId: 'family_mock_1',
    familyUser: { nickname: '女儿小李', mobile: '13800138000' },
  },
  {
    id: 'bind-2',
    relationType: 'son',
    status: 'pending',
    familyUserId: 'family_mock_2',
    familyUser: { nickname: '儿子小张', mobile: null },
  },
];

async function getBindings(): Promise<{ bindings: BindingItem[]; source: 'api' | 'mock'; note?: string }> {
  if (!defaultElderUserId) {
    return {
      bindings: mockBindings,
      source: 'mock',
      note: '当前未设置 NEXT_PUBLIC_DEFAULT_ELDER_USER_ID，先展示 mock 家属绑定数据。',
    };
  }

  try {
    const response = await fetch(`${apiBaseUrl}/api/family-bindings/elder/${defaultElderUserId}`, {
      cache: 'no-store',
    });
    const payload = await response.json();

    if (!response.ok || payload.code !== 0 || !Array.isArray(payload.data)) {
      throw new Error(payload?.message || '加载绑定列表失败');
    }

    return {
      bindings: payload.data,
      source: 'api',
    };
  } catch (error) {
    return {
      bindings: mockBindings,
      source: 'mock',
      note: error instanceof Error ? `API 加载失败，当前回退到 mock 数据：${error.message}` : 'API 加载失败，当前回退到 mock 数据。',
    };
  }
}

export default async function Page() {
  const { bindings, source, note } = await getBindings();

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ marginBottom: 8 }}>家属绑定</h1>
        <p style={{ color: '#667085', margin: 0 }}>
          当前先做家属绑定第一页版，支持“发起绑定申请 + 查看当前绑定状态”。
        </p>
      </div>

      <BindForm />

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#ffffff', borderRadius: 16, padding: 20, boxShadow: '0 8px 24px rgba(15,23,42,0.06)' }}>
          <div style={{ color: '#667085', marginBottom: 8 }}>当前数据源</div>
          <strong>{source === 'api' ? '真实 API' : 'Mock 回退'}</strong>
        </div>
        <div style={{ background: '#ffffff', borderRadius: 16, padding: 20, boxShadow: '0 8px 24px rgba(15,23,42,0.06)' }}>
          <div style={{ color: '#667085', marginBottom: 8 }}>绑定数量</div>
          <strong>{bindings.length} 条</strong>
        </div>
      </section>

      {note ? (
        <div style={{ marginBottom: 20, background: '#fffaeb', border: '1px solid #fedf89', borderRadius: 12, padding: '12px 14px', color: '#b54708' }}>
          {note}
        </div>
      ) : null}

      <section style={{ display: 'grid', gap: 16 }}>
        {bindings.map((binding) => (
          <article key={binding.id} style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 8px 24px rgba(15,23,42,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
              <div>
                <h2 style={{ margin: '0 0 8px', fontSize: 20 }}>{relationLabelMap[binding.relationType]}</h2>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ background: '#f2f4f7', color: '#344054', borderRadius: 999, padding: '4px 10px', fontSize: 12 }}>
                    {statusLabelMap[binding.status]}
                  </span>
                </div>
              </div>
              <div style={{ color: '#667085' }}>{binding.familyUserId}</div>
            </div>

            <p style={{ color: '#475467', margin: '0 0 6px' }}>昵称：{binding.familyUser?.nickname || '暂无'}</p>
            <p style={{ color: '#475467', margin: 0 }}>手机号：{binding.familyUser?.mobile || '暂无'}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
