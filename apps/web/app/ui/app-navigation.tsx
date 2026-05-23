'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavItem = {
  href: string;
  label: string;
  mark: string;
};

const primaryTabs: NavItem[] = [
  { href: '/', label: '首页', mark: '首' },
  { href: '/elder/home', label: '老人', mark: '老' },
  { href: '/family/dashboard', label: '家属', mark: '家' },
];

const elderTabs: NavItem[] = [
  { href: '/elder/profile', label: '建档', mark: '档' },
  { href: '/elder/home', label: '今日', mark: '今' },
  { href: '/elder/metrics', label: '指标', mark: '数' },
  { href: '/elder/medication', label: '用药', mark: '药' },
];

const familyTabs: NavItem[] = [
  { href: '/family/dashboard', label: '看板', mark: '看' },
  { href: '/family/report', label: '周报', mark: '报' },
  { href: '/family/bind', label: '绑定', mark: '绑' },
];

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href;
}

function roleTabsFor(pathname: string) {
  if (pathname.startsWith('/elder')) return elderTabs;
  if (pathname.startsWith('/family')) return familyTabs;
  return [];
}

function isPrimaryActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  if (href.startsWith('/elder')) return pathname.startsWith('/elder');
  if (href.startsWith('/family')) return pathname.startsWith('/family');
  return pathname === href;
}

export function AppNavigation() {
  const pathname = usePathname();
  const roleTabs = roleTabsFor(pathname);

  return (
    <>
      {roleTabs.length > 0 ? (
        <nav className="mobile-context-tabs" aria-label="当前角色导航">
          {roleTabs.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link key={item.href} href={item.href} className={active ? 'context-tab context-tab--active' : 'context-tab'} aria-current={active ? 'page' : undefined}>
                <span className="tab-mark" aria-hidden="true">{item.mark}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      ) : null}

      <nav className="mobile-bottom-tabs" aria-label="主导航">
        {primaryTabs.map((item) => {
          const active = isPrimaryActive(pathname, item.href);

          return (
            <Link key={item.href} href={item.href} className={active ? 'bottom-tab bottom-tab--active' : 'bottom-tab'} aria-current={active ? 'page' : undefined}>
              <span className="tab-mark" aria-hidden="true">{item.mark}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
