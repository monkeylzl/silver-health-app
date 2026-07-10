'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type GenerateReportButtonProps = {
  apiBaseUrl: string;
  elderUserId: string;
};

function getErrorMessage(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== 'object') {
    return fallback;
  }

  const maybePayload = payload as { message?: string | string[]; error?: string };
  if (Array.isArray(maybePayload.message)) {
    return maybePayload.message.join('；');
  }
  if (typeof maybePayload.message === 'string' && maybePayload.message.trim()) {
    return maybePayload.message;
  }
  if (typeof maybePayload.error === 'string' && maybePayload.error.trim()) {
    return maybePayload.error;
  }

  return fallback;
}

export function GenerateReportButton({ apiBaseUrl, elderUserId }: GenerateReportButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const generateReport = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${apiBaseUrl}/api/reports/elder/${elderUserId}/generate`, {
        method: 'POST',
      });
      const payload = await response.json();

      if (!response.ok || payload.code !== 0) {
        throw new Error(getErrorMessage(payload, '生成周报失败'));
      }

      setMessage('本周周报已生成，页面已刷新。');
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '生成周报失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="surface-card" style={{ display: 'grid', gap: 10, marginBottom: 20, padding: 16 }}>
      <strong>生成最新周报</strong>
      <p style={{ margin: 0, color: '#475467' }}>把当前任务、指标和用药提醒汇总成本周家属周报。</p>
      <button
        type="button"
        className="touch-button primary-button"
        onClick={generateReport}
        disabled={loading}
        style={{ minHeight: 48, border: 0, borderRadius: 10, padding: '12px 16px', background: '#2563eb', color: '#fff' }}
      >
        {loading ? '生成中...' : '生成本周周报'}
      </button>
      {message ? (
        <span style={{ color: message.includes('失败') ? '#b42318' : '#027a48' }}>{message}</span>
      ) : null}
    </div>
  );
}
