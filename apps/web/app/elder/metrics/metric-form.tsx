'use client';

import { FormEvent, useMemo, useState } from 'react';
import { apiBaseUrl, defaultElderUserId } from '../../../lib/config';

type MetricType = 'blood_pressure' | 'blood_glucose' | 'weight';
type MetricCreatedByRole = 'elder' | 'family';

type MetricFormState = {
  elderUserId: string;
  createdByUserId: string;
  createdByRole: MetricCreatedByRole;
  metricType: MetricType;
  systolic: string;
  diastolic: string;
  pulse: string;
  glucoseValue: string;
  glucosePeriodType: string;
  weightKg: string;
  measuredAt: string;
};

type FormErrors = Partial<Record<keyof MetricFormState, string>>;

const initialFormState: MetricFormState = {
  elderUserId: defaultElderUserId,
  createdByUserId: defaultElderUserId,
  createdByRole: 'elder',
  metricType: 'blood_pressure',
  systolic: '',
  diastolic: '',
  pulse: '',
  glucoseValue: '',
  glucosePeriodType: 'before_breakfast',
  weightKg: '',
  measuredAt: new Date().toISOString().slice(0, 16),
};

function fieldStyle(hasError: boolean) {
  return {
    padding: '10px 12px',
    border: `1px solid ${hasError ? '#f04438' : '#d0d5dd'}`,
    borderRadius: 10,
  } as const;
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

function validateForm(form: MetricFormState): FormErrors {
  const errors: FormErrors = {};

  if (!form.elderUserId.trim()) {
    errors.elderUserId = 'elderUserId 不能为空';
  }

  if (!form.createdByUserId.trim()) {
    errors.createdByUserId = 'createdByUserId 不能为空';
  }

  if (!form.measuredAt.trim()) {
    errors.measuredAt = '测量时间不能为空';
  }

  if (form.metricType === 'blood_pressure') {
    const systolic = Number(form.systolic);
    const diastolic = Number(form.diastolic);
    if (!Number.isFinite(systolic) || systolic < 60 || systolic > 260) {
      errors.systolic = '收缩压需为 60~260 的数值';
    }
    if (!Number.isFinite(diastolic) || diastolic < 40 || diastolic > 180) {
      errors.diastolic = '舒张压需为 40~180 的数值';
    }
    if (form.pulse.trim()) {
      const pulse = Number(form.pulse);
      if (!Number.isFinite(pulse) || pulse < 30 || pulse > 220) {
        errors.pulse = '脉搏需为 30~220 的数值';
      }
    }
  }

  if (form.metricType === 'blood_glucose') {
    const glucoseValue = Number(form.glucoseValue);
    if (!Number.isFinite(glucoseValue) || glucoseValue < 1 || glucoseValue > 40) {
      errors.glucoseValue = '血糖需为 1~40 的数值';
    }
  }

  if (form.metricType === 'weight') {
    const weightKg = Number(form.weightKg);
    if (!Number.isFinite(weightKg) || weightKg < 20 || weightKg > 300) {
      errors.weightKg = '体重需为 20~300 的数值';
    }
  }

  return errors;
}

export function MetricForm() {
  const [form, setForm] = useState<MetricFormState>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [result, setResult] = useState('');

  const typeDescription = useMemo(() => {
    if (form.metricType === 'blood_pressure') return '录入收缩压 / 舒张压 / 脉搏';
    if (form.metricType === 'blood_glucose') return '录入血糖值与测量时段';
    return '录入体重';
  }, [form.metricType]);

  const onChange = (key: keyof MetricFormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setMessage('请先修正指标表单中的错误项。');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const body = {
        elderUserId: form.elderUserId.trim(),
        createdByUserId: form.createdByUserId.trim(),
        createdByRole: form.createdByRole,
        metricType: form.metricType,
        systolic: form.metricType === 'blood_pressure' ? Number(form.systolic) : undefined,
        diastolic: form.metricType === 'blood_pressure' ? Number(form.diastolic) : undefined,
        pulse: form.metricType === 'blood_pressure' && form.pulse ? Number(form.pulse) : undefined,
        glucoseValue: form.metricType === 'blood_glucose' ? Number(form.glucoseValue) : undefined,
        glucosePeriodType: form.metricType === 'blood_glucose' ? form.glucosePeriodType : undefined,
        weightKg: form.metricType === 'weight' ? Number(form.weightKg) : undefined,
        measuredAt: new Date(form.measuredAt).toISOString(),
      };

      const response = await fetch(`${apiBaseUrl}/api/metrics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const payload = await response.json();

      if (!response.ok || payload.code !== 0) {
        throw new Error(getErrorMessage(payload, '保存指标失败'));
      }

      setMessage('指标录入成功。');
      setResult(JSON.stringify(payload.data, null, 2));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '保存指标失败');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (key: keyof MetricFormState, label: string, placeholder?: string) => (
    <label key={key} style={{ display: 'grid', gap: 8 }}>
      <span>{label}</span>
      <input
        value={form[key]}
        placeholder={placeholder}
        onChange={(event) => onChange(key, event.target.value)}
        style={fieldStyle(Boolean(errors[key]))}
      />
      {errors[key] ? <span style={{ color: '#b42318', fontSize: 12 }}>{errors[key]}</span> : null}
    </label>
  );

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <form onSubmit={onSubmit} style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 8px 24px rgba(15,23,42,0.06)' }}>
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ margin: '0 0 8px' }}>健康指标录入表单</h2>
          <p style={{ margin: 0, color: '#667085' }}>{typeDescription}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {renderInput('elderUserId', '老人 userId *')}
          {renderInput('createdByUserId', '录入人 userId *')}

          <label style={{ display: 'grid', gap: 8 }}>
            <span>录入角色 *</span>
            <select value={form.createdByRole} onChange={(event) => onChange('createdByRole', event.target.value)} style={fieldStyle(false)}>
              <option value="elder">老人</option>
              <option value="family">家属</option>
            </select>
          </label>

          <label style={{ display: 'grid', gap: 8 }}>
            <span>指标类型 *</span>
            <select value={form.metricType} onChange={(event) => onChange('metricType', event.target.value)} style={fieldStyle(false)}>
              <option value="blood_pressure">血压</option>
              <option value="blood_glucose">血糖</option>
              <option value="weight">体重</option>
            </select>
          </label>

          <label style={{ display: 'grid', gap: 8 }}>
            <span>测量时间 *</span>
            <input type="datetime-local" value={form.measuredAt} onChange={(event) => onChange('measuredAt', event.target.value)} style={fieldStyle(Boolean(errors.measuredAt))} />
            {errors.measuredAt ? <span style={{ color: '#b42318', fontSize: 12 }}>{errors.measuredAt}</span> : null}
          </label>
        </div>

        {form.metricType === 'blood_pressure' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginTop: 16 }}>
            {renderInput('systolic', '收缩压 *', '例如 128')}
            {renderInput('diastolic', '舒张压 *', '例如 78')}
            {renderInput('pulse', '脉搏', '例如 72')}
          </div>
        ) : null}

        {form.metricType === 'blood_glucose' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginTop: 16 }}>
            {renderInput('glucoseValue', '血糖值 *', '例如 6.2')}
            <label style={{ display: 'grid', gap: 8 }}>
              <span>测量时段</span>
              <select value={form.glucosePeriodType} onChange={(event) => onChange('glucosePeriodType', event.target.value)} style={fieldStyle(false)}>
                <option value="before_breakfast">早餐前</option>
                <option value="after_breakfast">早餐后</option>
                <option value="before_lunch">午餐前</option>
                <option value="after_lunch">午餐后</option>
                <option value="before_dinner">晚餐前</option>
                <option value="after_dinner">晚餐后</option>
              </select>
            </label>
          </div>
        ) : null}

        {form.metricType === 'weight' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginTop: 16 }}>
            {renderInput('weightKg', '体重 *', '例如 61.5')}
          </div>
        ) : null}

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 20, flexWrap: 'wrap' }}>
          <button type="submit" disabled={loading} style={{ padding: '12px 18px', background: '#2563eb', color: '#fff', border: 0, borderRadius: 10 }}>
            {loading ? '提交中...' : '保存指标'}
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
