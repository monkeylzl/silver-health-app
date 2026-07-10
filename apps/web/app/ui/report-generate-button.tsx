'use client';

import { FilePlus2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function ReportGenerateButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function generate() {
    if (!navigator.onLine) {
      setMessage('离线时不能生成周报。');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/app/reports/generate', { method: 'POST' });
      const payload = await response.json().catch(() => null) as { message?: string } | null;
      if (!response.ok) throw new Error(payload?.message || '周报生成失败。');
      setMessage('本周报告已更新。');
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '周报生成失败。');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button className="button button--secondary" type="button" onClick={generate} disabled={loading} data-touch-target>
        <FilePlus2 aria-hidden="true" />{loading ? '正在生成…' : '生成本周报告'}
      </button>
      <p className="form-message" aria-live="polite">{message}</p>
    </div>
  );
}
