'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiBaseUrl, defaultElderUserId } from '../../../lib/config';

type MedicationFormState = {
  elderUserId: string;
  medicineName: string;
  dosageText: string;
  remindTime: string;
  repeatRule: string;
  enabled: boolean;
};

type FormErrors = Partial<Record<keyof MedicationFormState, string>>;

const initialFormState: MedicationFormState = {
  elderUserId: defaultElderUserId,
  medicineName: '',
  dosageText: '',
  remindTime: '08:00',
  repeatRule: 'daily',
  enabled: true,
};

function fieldStyle(hasError: boolean) {
  return {
    padding: '10px 12px',
    border: `1px solid ${hasError ? '#f04438' : '#d0d5dd'}`,
    borderRadius: 10,
  } as const;
}

function validateForm(form: MedicationFormState): FormErrors {
  const errors: FormErrors = {};

  if (!form.elderUserId.trim()) {
    errors.elderUserId = 'elderUserId 不能为空';
  }
  if (!form.medicineName.trim()) {
    errors.medicineName = '药品名称不能为空';
  }
  if (!form.dosageText.trim()) {
    errors.dosageText = '剂量说明不能为空';
  }
  if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(form.remindTime)) {
    errors.remindTime = '提醒时间需为 HH:mm 格式';
  }
  if (!form.repeatRule.trim()) {
    errors.repeatRule = '重复规则不能为空';
  }

  return errors;
}

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

export function MedicationForm() {
  const router = useRouter();
  const [form, setForm] = useState<MedicationFormState>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [result, setResult] = useState('');

  const onChange = (key: keyof MedicationFormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setMessage('请先修正用药提醒表单中的错误项。');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${apiBaseUrl}/api/medications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          elderUserId: form.elderUserId.trim(),
          medicineName: form.medicineName.trim(),
          dosageText: form.dosageText.trim(),
          remindTime: form.remindTime,
          repeatRule: form.repeatRule.trim(),
          enabled: form.enabled,
        }),
      });
      const payload = await response.json();

      if (!response.ok || payload.code !== 0) {
        throw new Error(getErrorMessage(payload, '保存用药提醒失败'));
      }

      setMessage('用药提醒保存成功，列表已自动刷新。');
      setResult(JSON.stringify(payload.data, null, 2));
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '保存用药提醒失败');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (key: keyof MedicationFormState, label: string, placeholder?: string) => (
    <label key={key} style={{ display: 'grid', gap: 8 }}>
      <span>{label}</span>
      <input
        value={String(form[key])}
        placeholder={placeholder}
        onChange={(event) => onChange(key, event.target.value)}
        style={fieldStyle(Boolean(errors[key]))}
      />
      {errors[key] ? <span style={{ color: '#b42318', fontSize: 12 }}>{errors[key]}</span> : null}
    </label>
  );

  return (
    <div style={{ display: 'grid', gap: 24, marginBottom: 24 }}>
      <form onSubmit={onSubmit} style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 8px 24px rgba(15,23,42,0.06)' }}>
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ margin: '0 0 8px' }}>新增用药提醒</h2>
          <p style={{ margin: 0, color: '#667085' }}>第一版先支持新增提醒配置，后续再补编辑、停用和通知发送。</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {renderInput('elderUserId', '老人 userId *')}
          {renderInput('medicineName', '药品名称 *', '例如 氨氯地平')}
          {renderInput('dosageText', '剂量说明 *', '例如 每次 1 片')}
          {renderInput('remindTime', '提醒时间 *', '例如 08:00')}
          {renderInput('repeatRule', '重复规则 *', '例如 daily')}

          <label style={{ display: 'grid', gap: 8 }}>
            <span>是否启用</span>
            <select value={form.enabled ? 'true' : 'false'} onChange={(event) => onChange('enabled', event.target.value === 'true')} style={fieldStyle(false)}>
              <option value="true">启用</option>
              <option value="false">停用</option>
            </select>
          </label>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 20, flexWrap: 'wrap' }}>
          <button type="submit" disabled={loading} style={{ padding: '12px 18px', background: '#2563eb', color: '#fff', border: 0, borderRadius: 10 }}>
            {loading ? '提交中...' : '保存提醒'}
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
