'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiBaseUrl, defaultElderUserId } from '../../../lib/config';

type RelationType = 'son' | 'daughter' | 'spouse' | 'other';

type BindFormState = {
  elderUserId: string;
  familyUserId: string;
  relationType: RelationType;
};

type FormErrors = Partial<Record<keyof BindFormState, string>>;

const initialFormState: BindFormState = {
  elderUserId: defaultElderUserId,
  familyUserId: '',
  relationType: 'son',
};

function fieldStyle(hasError: boolean) {
  return {
    padding: '10px 12px',
    border: `1px solid ${hasError ? '#f04438' : '#d0d5dd'}`,
    borderRadius: 10,
  } as const;
}

function validateForm(form: BindFormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.elderUserId.trim()) {
    errors.elderUserId = 'elderUserId 不能为空';
  }
  if (!form.familyUserId.trim()) {
    errors.familyUserId = 'familyUserId 不能为空';
  }
  return errors;
}

function getErrorMessage(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== 'object') return fallback;
  const maybePayload = payload as { message?: string | string[]; error?: string };
  if (Array.isArray(maybePayload.message)) return maybePayload.message.join('；');
  if (typeof maybePayload.message === 'string' && maybePayload.message.trim()) return maybePayload.message;
  if (typeof maybePayload.error === 'string' && maybePayload.error.trim()) return maybePayload.error;
  return fallback;
}

export function BindForm() {
  const router = useRouter();
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [result, setResult] = useState('');

  const onChange = (key: keyof BindFormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateForm(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setMessage('请先修正绑定表单中的错误项。');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${apiBaseUrl}/api/family-bindings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          elderUserId: form.elderUserId.trim(),
          familyUserId: form.familyUserId.trim(),
          relationType: form.relationType,
        }),
      });
      const payload = await response.json();
      if (!response.ok || payload.code !== 0) {
        throw new Error(getErrorMessage(payload, '发起绑定失败'));
      }

      setMessage('绑定申请已提交，列表已自动刷新。');
      setResult(JSON.stringify(payload.data, null, 2));
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '发起绑定失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'grid', gap: 24, marginBottom: 24 }}>
      <form onSubmit={onSubmit} style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 8px 24px rgba(15,23,42,0.06)' }}>
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ margin: '0 0 8px' }}>发起家属绑定</h2>
          <p style={{ margin: 0, color: '#667085' }}>第一版先支持提交绑定申请，后续再补确认流程、邀请码或扫码方式。</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          <label style={{ display: 'grid', gap: 8 }}>
            <span>老人 userId *</span>
            <input value={form.elderUserId} onChange={(event) => onChange('elderUserId', event.target.value)} style={fieldStyle(Boolean(errors.elderUserId))} />
            {errors.elderUserId ? <span style={{ color: '#b42318', fontSize: 12 }}>{errors.elderUserId}</span> : null}
          </label>

          <label style={{ display: 'grid', gap: 8 }}>
            <span>家属 userId *</span>
            <input value={form.familyUserId} onChange={(event) => onChange('familyUserId', event.target.value)} style={fieldStyle(Boolean(errors.familyUserId))} />
            {errors.familyUserId ? <span style={{ color: '#b42318', fontSize: 12 }}>{errors.familyUserId}</span> : null}
          </label>

          <label style={{ display: 'grid', gap: 8 }}>
            <span>关系类型</span>
            <select value={form.relationType} onChange={(event) => onChange('relationType', event.target.value)} style={fieldStyle(false)}>
              <option value="son">儿子</option>
              <option value="daughter">女儿</option>
              <option value="spouse">配偶</option>
              <option value="other">其他</option>
            </select>
          </label>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 20, flexWrap: 'wrap' }}>
          <button type="submit" disabled={loading} style={{ padding: '12px 18px', background: '#2563eb', color: '#fff', border: 0, borderRadius: 10 }}>
            {loading ? '提交中...' : '提交绑定申请'}
          </button>
          <span style={{ color: message.includes('失败') || message.includes('错误') ? '#b42318' : '#027a48' }}>{message}</span>
        </div>
      </form>

      <section style={{ background: '#101828', color: '#f8fafc', borderRadius: 16, padding: 24, overflowX: 'auto' }}>
        <h3 style={{ marginTop: 0 }}>接口返回预览</h3>
        <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{result || '提交后，这里会展示接口返回结果。'}</pre>
      </section>
    </div>
  );
}
