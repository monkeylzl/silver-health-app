import { apiBaseUrl, defaultElderUserId } from '../../../lib/config';
import { BindForm } from './bind-form';
import { ChecklistNotice, DataSourceNotice, DemoStepNotice, EmptyState, PageHeader, StatCard, pageStyles } from '../../ui/page-kit';

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
  other: '其他家属',
};

const statusLabelMap: Record<BindingItem['status'], string> = {
  pending: '等待确认',
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
      note: '当前没读到默认老人档案，所以先展示演示绑定关系，方便补讲照护链路是怎么建立的。',
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
      note: error instanceof Error ? `刚才没拿到真实绑定信息，先用演示数据继续讲解：${error.message}` : '刚才没拿到真实绑定信息，先用演示数据继续讲解。',
    };
  }
}

export default async function Page() {
  const { bindings, source, note } = await getBindings();

  return (
    <main className="app-shell" style={pageStyles.main}>
      <PageHeader
        title="家属绑定"
        description="这页更适合在演示补充环节使用：如果需要解释家属如何加入照护流程，就从这里把关系建立过程讲清楚。"
      />

      <DemoStepNotice
        step="补充步骤"
        current="推荐把这页放在家属看板或周报之后讲，避免一开始就把演示重心带到配置流程上。"
        next="讲完绑定关系后，再回到家属看板或周报总结整体价值。"
      />

      <DataSourceNotice source={source} fallbackNote={note} mockLabel="当前先用演示绑定关系把照护链路讲清楚；真实 API 一恢复，这里会自动切回真实绑定列表。" />

      <ChecklistNotice
        title="这一页建议顺手讲清楚"
        items={[
          '把这页放在补充环节，避免一开始把演示重心带到配置流程。',
          '先看顶部接入状态，再说明家属加入后就能查看任务、指标和周报摘要。',
          '讲完关系建立后，回到家属看板或周报做价值总结。',
        ]}
      />

      <BindForm />

      <section className="stat-grid" style={pageStyles.statGrid}>
        <StatCard label="当前接入状态" value={source === 'api' ? '真实 API' : '演示数据'} />
        <StatCard label="绑定数量" value={`${bindings.length} 条`} />
      </section>

      {bindings.length === 0 ? (
        <EmptyState title="暂时还没有绑定关系" description="可以先发起一条绑定申请，演示时就能看到从表单提交到状态展示的完整链路。" />
      ) : (
        <section className="list-section" style={pageStyles.listSection}>
          {bindings.map((binding) => (
            <article key={binding.id} className="surface-card" style={pageStyles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
                <div>
                  <h2 style={{ margin: '0 0 8px', fontSize: 20 }}>{relationLabelMap[binding.relationType]}</h2>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span style={pageStyles.tag}>{statusLabelMap[binding.status]}</span>
                  </div>
                </div>
                <div style={{ color: '#667085' }}>
                  {binding.familyUser?.nickname ? `照护人：${binding.familyUser.nickname}` : '照护人信息待补充'}
                </div>
              </div>

              <p style={{ color: '#475467', margin: '0 0 6px' }}>家属称呼：{binding.familyUser?.nickname || '暂未填写'}</p>
              <p style={{ color: '#475467', margin: '0 0 6px' }}>联系手机号：{binding.familyUser?.mobile || '暂未填写'}</p>
              <p style={{ color: '#475467', margin: 0 }}>这层关系建立后，家属就能继续查看老人任务、指标和周报摘要。</p>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
