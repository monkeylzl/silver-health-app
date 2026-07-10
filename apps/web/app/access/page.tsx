import { AccessForm } from './access-form';

function safeNextPath(value: string | string[] | undefined) {
  const path = Array.isArray(value) ? value[0] : value;
  return path && path.startsWith('/') && !path.startsWith('//') ? path : '/';
}

export default async function AccessPage({ searchParams }: { searchParams: Promise<{ next?: string | string[] }> }) {
  const { next } = await searchParams;

  return (
    <main className="access-page">
      <section className="access-panel" aria-labelledby="access-title">
        <div className="brand-mark" aria-hidden="true">银</div>
        <p className="access-kicker">Silver Health</p>
        <h1 id="access-title">陪伴每天的健康小事</h1>
        <p className="access-description">输入体验口令后，可以完成任务、记录指标并与家人同步近况。</p>
        <AccessForm nextPath={safeNextPath(next)} />
      </section>
    </main>
  );
}
