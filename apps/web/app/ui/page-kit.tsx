import type { CSSProperties, ReactNode } from 'react';

export const pageStyles = {
  main: {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '40px 24px',
  } satisfies CSSProperties,
  header: {
    marginBottom: 24,
  } satisfies CSSProperties,
  title: {
    marginBottom: 8,
  } satisfies CSSProperties,
  description: {
    color: '#667085',
    margin: 0,
  } satisfies CSSProperties,
  statGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 16,
    marginBottom: 24,
  } satisfies CSSProperties,
  listSection: {
    display: 'grid',
    gap: 16,
  } satisfies CSSProperties,
  card: {
    background: '#fff',
    borderRadius: 16,
    padding: 20,
    boxShadow: '0 8px 24px rgba(15,23,42,0.06)',
  } satisfies CSSProperties,
  tag: {
    background: '#f2f4f7',
    color: '#344054',
    borderRadius: 999,
    padding: '4px 10px',
    fontSize: 12,
  } satisfies CSSProperties,
  linkCard: {
    display: 'block',
    textDecoration: 'none',
    color: 'inherit',
    background: '#fff',
    borderRadius: 16,
    padding: 20,
    boxShadow: '0 8px 24px rgba(15,23,42,0.06)',
    border: '1px solid transparent',
  } satisfies CSSProperties,
};

export function PageHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="page-header" style={pageStyles.header}>
      <h1 className="page-title" style={pageStyles.title}>{title}</h1>
      <p className="page-description" style={pageStyles.description}>{description}</p>
    </div>
  );
}

export function StatCard({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="surface-card" style={pageStyles.card}>
      <div style={{ color: '#667085', marginBottom: 8 }}>{label}</div>
      <strong>{value}</strong>
    </div>
  );
}

export function InlineNotice({ tone = 'warning', children }: { tone?: 'warning' | 'info' | 'success'; children: ReactNode }) {
  const toneStyle = tone === 'info'
    ? { background: '#eff8ff', border: '1px solid #b2ddff', color: '#175cd3' }
    : tone === 'success'
      ? { background: '#ecfdf3', border: '1px solid #abefc6', color: '#027a48' }
      : { background: '#fffaeb', border: '1px solid #fedf89', color: '#b54708' };

  return (
    <div className="inline-notice" style={{ marginBottom: 20, borderRadius: 12, padding: '12px 14px', ...toneStyle }}>
      {children}
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div
      className="surface-card"
      style={{
        ...pageStyles.card,
        border: '1px dashed #d0d5dd',
        textAlign: 'center',
        color: '#475467',
      }}
    >
      <strong style={{ display: 'block', marginBottom: 8, color: '#101828' }}>{title}</strong>
      <p style={{ margin: 0 }}>{description}</p>
    </div>
  );
}

export function DemoStepNotice({
  step,
  current,
  next,
}: {
  step: string;
  current: string;
  next?: string;
}) {
  return (
    <InlineNotice tone="info">
      <strong>{step}</strong>
      <div style={{ marginTop: 6 }}>{current}</div>
      {next ? <div style={{ marginTop: 4, opacity: 0.9 }}>下一步：{next}</div> : null}
    </InlineNotice>
  );
}

export function DataSourceNotice({
  source,
  fallbackNote,
  apiLabel = '当前页面已接入真实 API，可直接拿真实数据继续演示。',
  mockLabel = '当前先用演示数据保住讲解节奏，真实 API 一恢复就会自动切回。',
}: {
  source: 'api' | 'mock';
  fallbackNote?: string;
  apiLabel?: string;
  mockLabel?: string;
}) {
  return (
    <InlineNotice tone={source === 'api' ? 'success' : 'warning'}>
      <strong>{source === 'api' ? '当前接入：真实 API' : '当前接入：演示数据'}</strong>
      <div style={{ marginTop: 6 }}>{source === 'api' ? apiLabel : mockLabel}</div>
      {fallbackNote ? <div style={{ marginTop: 6, opacity: 0.92 }}>{fallbackNote}</div> : null}
    </InlineNotice>
  );
}

export function ChecklistNotice({
  title,
  items,
  tone = 'info',
}: {
  title: string;
  items: string[];
  tone?: 'warning' | 'info' | 'success';
}) {
  return (
    <InlineNotice tone={tone}>
      <strong>{title}</strong>
      <ul style={{ margin: '8px 0 0', paddingLeft: 18 }}>
        {items.map((item) => (
          <li key={item} style={{ marginBottom: 4 }}>
            {item}
          </li>
        ))}
      </ul>
    </InlineNotice>
  );
}
