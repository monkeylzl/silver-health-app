import Link from 'next/link';
import { ChevronRight, Download, UserRound } from 'lucide-react';
import { getProfile } from '../../lib/app-data';
import { AppPageHeader, ErrorState } from '../ui/app-components';
import { InstallPrompt } from '../ui/install-prompt';
import { LogoutButton } from '../ui/logout-button';
import { OnlineStatus } from '../ui/online-status';

const helperModeLabel = { self: '本人使用', family_assisted: '家人协助' } as const;
const mobilityLabel = { low: '需要更多照看', medium: '日常可自理', high: '行动较灵活' } as const;

export default async function MePage() {
  try {
    const profile = await getProfile();
    const displayName = profile.user?.nickname || profile.name || '健康档案';

    return (
      <main className="app-shell">
        <AppPageHeader title="我的" description="管理档案、安装状态和当前设备。" />

        <section className="profile-summary">
          <div className="profile-summary__avatar" aria-hidden="true">{displayName.slice(0, 1)}</div>
          <div><h2>{displayName}</h2><p>{profile.age ? `${profile.age} 岁` : '年龄待补充'} · {profile.helperMode ? helperModeLabel[profile.helperMode] : '使用方式待补充'}</p></div>
          <Link href="/me/profile" className="icon-button" aria-label="编辑健康档案" data-touch-target><ChevronRight aria-hidden="true" /></Link>
        </section>

        <OnlineStatus />

        <section className="settings-list">
          <Link className="settings-row" href="/me/profile" data-touch-target>
            <UserRound aria-hidden="true" /><div><strong>健康档案</strong><span>{profile.mobilityLevel ? mobilityLabel[profile.mobilityLevel] : '补充基础信息和照护方式'}</span></div><ChevronRight aria-hidden="true" />
          </Link>
          <div className="settings-row settings-row--install">
            <Download aria-hidden="true" /><div><strong>安装到主屏幕</strong><span>安装后可以像普通应用一样打开</span></div>
          </div>
        </section>

        <InstallPrompt />
        <LogoutButton />
      </main>
    );
  } catch (error) {
    return <main className="app-shell"><AppPageHeader title="我的" /><ErrorState message={error instanceof Error ? error.message : undefined} /></main>;
  }
}
