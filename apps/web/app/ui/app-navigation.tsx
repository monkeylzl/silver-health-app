'use client';

import Link from 'next/link';
import { HeartPulse, Home, UserRound, UsersRound } from 'lucide-react';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/', label: '今日', icon: Home },
  { href: '/health', label: '健康', icon: HeartPulse },
  { href: '/family', label: '家人', icon: UsersRound },
  { href: '/me', label: '我的', icon: UserRound },
];

function activeTab(pathname: string, href: string) {
  if (href === '/') return pathname === '/' || pathname.startsWith('/tasks');
  if (href === '/health') return pathname.startsWith('/health') || pathname.startsWith('/elder/metrics') || pathname.startsWith('/elder/medication');
  if (href === '/family') return pathname.startsWith('/family');
  return pathname.startsWith('/me') || pathname.startsWith('/elder/profile');
}

function NavigationItems({ variant, pathname }: { variant: 'bottom' | 'sidebar'; pathname: string }) {
  return tabs.map((item) => {
    const active = activeTab(pathname, item.href);
    const Icon = item.icon;
    return (
      <Link
        key={item.href}
        href={item.href}
        className={`app-nav-item app-nav-item--${variant}${active ? ' is-active' : ''}`}
        aria-current={active ? 'page' : undefined}
        data-touch-target
      >
        <Icon aria-hidden="true" />
        <span>{item.label}</span>
      </Link>
    );
  });
}

export function AppNavigation() {
  const pathname = usePathname();
  if (pathname === '/access' || pathname === '/offline.html') return null;

  return (
    <div className="app-navigation-root">
      <aside className="app-sidebar">
        <div className="app-sidebar__brand"><span aria-hidden="true">银</span><strong>Silver Health</strong></div>
        <nav className="app-sidebar__nav" aria-label="侧边主导航">
          <NavigationItems variant="sidebar" pathname={pathname} />
        </nav>
      </aside>
      <nav className="app-bottom-nav" aria-label="底部主导航">
        <NavigationItems variant="bottom" pathname={pathname} />
      </nav>
    </div>
  );
}
