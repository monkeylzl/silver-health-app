'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export function AccessForm({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const [accessCode, setAccessCode] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessCode.trim()) {
      setMessage('请输入体验口令。');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessCode }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => null) as { message?: string } | null;
        throw new Error(payload?.message || '暂时无法进入，请稍后重试。');
      }
      router.replace(nextPath);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '暂时无法进入，请稍后重试。');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="access-form" onSubmit={onSubmit}>
      <label className="field-stack" htmlFor="access-code">
        <span>体验口令</span>
        <input
          id="access-code"
          name="accessCode"
          type="password"
          autoComplete="current-password"
          value={accessCode}
          onChange={(event) => setAccessCode(event.target.value)}
          placeholder="请输入口令"
        />
      </label>
      <button className="button button--primary button--block" type="submit" disabled={loading}>
        {loading ? '正在进入…' : '进入应用'}
      </button>
      <p className={message ? 'form-message form-message--error' : 'form-message'} aria-live="polite">
        {message}
      </p>
    </form>
  );
}
