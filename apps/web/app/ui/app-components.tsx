import Link from 'next/link';
import { AlertCircle, ArrowLeft, ChevronRight, RefreshCw } from 'lucide-react';
import type { ReactNode } from 'react';

export function AppPageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <header className="app-page-header">
      <div>
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {action ? <div className="app-page-header__action">{action}</div> : null}
    </header>
  );
}

export function BackHeader({ href, title }: { href: string; title: string }) {
  return (
    <header className="back-header">
      <Link href={href} aria-label="返回" className="icon-button" data-touch-target>
        <ArrowLeft aria-hidden="true" />
      </Link>
      <h1>{title}</h1>
    </header>
  );
}

export function SectionHeader({ title, href, actionLabel }: { title: string; href?: string; actionLabel?: string }) {
  return (
    <div className="section-header">
      <h2>{title}</h2>
      {href && actionLabel ? (
        <Link href={href} className="text-link" data-touch-target>
          {actionLabel}<ChevronRight aria-hidden="true" />
        </Link>
      ) : null}
    </div>
  );
}

export function ErrorState({ message }: { message?: string }) {
  return (
    <section className="state-panel state-panel--error" role="alert">
      <AlertCircle aria-hidden="true" />
      <div>
        <h2>暂时没有加载成功</h2>
        <p>{message || '请检查网络后重试。'}</p>
        <a className="button button--secondary" href="" data-touch-target>
          <RefreshCw aria-hidden="true" />重新加载
        </a>
      </div>
    </section>
  );
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <section className="state-panel">
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
        {action}
      </div>
    </section>
  );
}

export function ProgressBar({ value, max, label }: { value: number; max: number; label: string }) {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="progress-block">
      <div className="progress-block__label"><span>{label}</span><strong>{percentage}%</strong></div>
      <div className="progress-track" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percentage}>
        <span style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
