import Link from 'next/link';
import { apiBaseUrl, defaultElderUserId } from '../../lib/config';
import { DataSourceNotice, PageHeader, StatCard, pageStyles } from '../ui/page-kit';
import { InstallPrompt } from '../ui/install-prompt';

type ElderProfile = {
  userId: string;
  name?: string | null;
  age?: number | null;
  gender?: 'male' | 'female' | 'other' | null;
  mobilityLevel?: 'low' | 'medium' | 'high' | null;
  helperMode?: 'self' | 'family_assisted' | null;
  user?: {
    nickname?: string | null;
    mobile?: string | null;
  } | null;
};

const mockProfile: ElderProfile = {
  userId: defaultElderUserId || 'demo_elder',
  name: '李秀兰',
  age: 68,
  gender: 'female',
  mobilityLevel: 'medium',
  helperMode: 'family_assisted',
  user: {
    nickname: '李阿姨',
    mobile: '13800138000',
  },
};

const helperModeLabel: Record<string, string> = {
  self: '老人自己使用',
  family_assisted: '家属协助使用',
};

const mobilityLabel: Record<string, string> = {
  low: '需要更多照看',
  medium: '日常可自理',
  high: '行动较灵活',
};

async function getProfile(): Promise<{ profile: ElderProfile; source: 'api' | 'mock'; note?: string }> {
  if (!defaultElderUserId) {
    return {
      profile: mockProfile,
      source: 'mock',
      note: '当前没有配置默认老人档案，先展示演示账号信息。',
    };
  }

  try {
    const response = await fetch(`${apiBaseUrl}/api/profile/elder/${defaultElderUserId}`, {
      cache: 'no-store',
    });
    const payload = await response.json();

    if (!response.ok || payload.code !== 0 || !payload.data) {
      throw new Error(payload?.message || '加载档案失败');
    }

    return {
      profile: payload.data,
      source: 'api',
    };
  } catch (error) {
    return {
      profile: mockProfile,
      source: 'mock',
      note: error instanceof Error ? `暂时没拿到真实档案，先用演示账号保持可用：${error.message}` : '暂时没拿到真实档案。',
    };
  }
}

async function getApiHealth(): Promise<'running' | 'unavailable'> {
  try {
    const response = await fetch(`${apiBaseUrl}/api/health`, { cache: 'no-store' });
    const payload = await response.json();
    return response.ok && payload.code === 0 ? 'running' : 'unavailable';
  } catch {
    return 'unavailable';
  }
}

export default async function MePage() {
  const [{ profile, source, note }, apiHealth] = await Promise.all([getProfile(), getApiHealth()]);
  const displayName = profile.user?.nickname || profile.name || '演示老人';

  return (
    <main className="app-shell app-shell--tabbed" style={pageStyles.main}>
      <PageHeader
        title="我的"
        description="查看当前演示账号、安装状态和上线环境。第一阶段用固定演示账号跑通闭环。"
      />

      <DataSourceNotice
        source={source}
        fallbackNote={note}
        apiLabel="当前档案来自真实 API。"
        mockLabel="当前展示演示账号；配置默认老人档案后会自动切到真实档案。"
      />

      <section className="profile-card">
        <div className="profile-avatar" aria-hidden="true">{displayName.slice(0, 1)}</div>
        <div>
          <span className="eyebrow">当前演示账号</span>
          <h2>{displayName}</h2>
          <p>{profile.age ? `${profile.age} 岁` : '年龄待补充'} · {profile.user?.mobile ?? '手机号待补充'}</p>
        </div>
      </section>

      <section className="stat-grid" style={pageStyles.statGrid}>
        <StatCard label="API 状态" value={apiHealth === 'running' ? '正常' : '不可用'} />
        <StatCard label="数据源" value={source === 'api' ? '真实 API' : '演示数据'} />
        <StatCard label="照护方式" value={profile.helperMode ? helperModeLabel[profile.helperMode] ?? profile.helperMode : '待补充'} />
        <StatCard label="行动状态" value={profile.mobilityLevel ? mobilityLabel[profile.mobilityLevel] ?? profile.mobilityLevel : '待补充'} />
      </section>

      <InstallPrompt />

      <section className="quick-action-grid">
        <Link className="action-card" href="/elder/profile">
          <strong>编辑老人档案</strong>
          <span>更新基础信息、慢病情况和常用药。</span>
        </Link>
        <Link className="action-card" href="/demo">
          <strong>打开演示入口</strong>
          <span>路演或交接时查看固定讲解顺序。</span>
        </Link>
      </section>
    </main>
  );
}
