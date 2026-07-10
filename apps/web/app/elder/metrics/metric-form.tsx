'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  systolic: '128',
  diastolic: '78',
  pulse: '72',
  glucoseValue: '6.2',
  glucosePeriodType: 'before_breakfast',
  weightKg: '61.5',
  measuredAt: '',
};

const metricTypeOptions: Array<{ value: MetricType; label: string; helper: string }> = [
  { value: 'blood_pressure', label: '血压', helper: '最适合现场演示，保存后回显最直观' },
  { value: 'blood_glucose', label: '血糖', helper: '适合讲餐前餐后记录与长期趋势' },
  { value: 'weight', label: '体重', helper: '适合补充日常基础监测场景' },
];

const recorderRoleOptions: Array<{ value: MetricCreatedByRole; label: string; helper: string }> = [
  { value: 'elder', label: '老人本人录入', helper: '适合演示老人自己完成一次打卡' },
  { value: 'family', label: '家属代为补录', helper: '适合演示家属远程补录或电话回访' },
];

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
    errors.elderUserId = '档案编号不能为空';
  }

  if (!form.createdByUserId.trim()) {
    errors.createdByUserId = '录入人编号不能为空';
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

function getLocalDateTimeInputValue(date = new Date()) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 16);
}

export function MetricForm() {
  const router = useRouter();
  const [form, setForm] = useState<MetricFormState>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [result, setResult] = useState('');

  useEffect(() => {
    setForm((prev) => (prev.measuredAt ? prev : { ...prev, measuredAt: getLocalDateTimeInputValue() }));
  }, []);

  const typeDescription = useMemo(() => {
    if (form.metricType === 'blood_pressure') return '默认示例已填好一条晨起血压，适合现场一键讲解“录入后立即回显”。';
    if (form.metricType === 'blood_glucose') return '可切换成血糖，演示餐前餐后记录也很顺。';
    return '可切换成体重，补充长期趋势观察场景。';
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

      setMessage('指标录入成功，列表已自动刷新。下一步可切到“用药提醒”继续讲解。');
      setResult(JSON.stringify(payload.data, null, 2));
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '保存指标失败');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (key: keyof MetricFormState, label: string, placeholder?: string, helper?: string) => (
    <label key={key} style={{ display: 'grid', gap: 8 }}>
      <span>{label}</span>
      <input
        value={form[key]}
        placeholder={placeholder}
        onChange={(event) => onChange(key, event.target.value)}
        style={fieldStyle(Boolean(errors[key]))}
      />
      {helper ? <span style={{ color: '#667085', fontSize: 12 }}>{helper}</span> : null}
      {errors[key] ? <span style={{ color: '#b42318', fontSize: 12 }}>{errors[key]}</span> : null}
    </label>
  );

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <form onSubmit={onSubmit} className="form-card" style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 8px 24px rgba(15,23,42,0.06)' }}>
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ margin: '0 0 8px' }}>健康指标录入表单</h2>
          <p style={{ margin: 0, color: '#667085' }}>{typeDescription}</p>
        </div>

        <div style={{ display: 'grid', gap: 12, marginBottom: 16 }}>
          <div style={{ padding: 12, borderRadius: 12, background: '#eff8ff', color: '#175cd3' }}>
            保存后会影响哪里：下方记录列表会立即回显，后面的<strong>家属看板与周报</strong>也会继续使用这条指标。
          </div>
          <div style={{ padding: 12, borderRadius: 12, background: '#f8f9fc', color: '#344054' }}>
            演示建议：优先保留默认的“晨起血压”示例值，现场输入最少、反馈最直观。
          </div>
        </div>

        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {renderInput('elderUserId', '老人档案编号 *', '默认沿用建档后的编号', '若已从建档页进入，一般无需改动')}
          {renderInput('createdByUserId', '录入人编号 *', '默认使用当前老人编号', '保留接口必填字段，但页面上按“录入人”来表达')}

          <label style={{ display: 'grid', gap: 8 }}>
            <span>录入身份 *</span>
            <select value={form.createdByRole} onChange={(event) => onChange('createdByRole', event.target.value)} style={fieldStyle(false)}>
              {recorderRoleOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <span style={{ color: '#667085', fontSize: 12 }}>
              {recorderRoleOptions.find((option) => option.value === form.createdByRole)?.helper}
            </span>
          </label>

          <label style={{ display: 'grid', gap: 8 }}>
            <span>指标类型 *</span>
            <select value={form.metricType} onChange={(event) => onChange('metricType', event.target.value)} style={fieldStyle(false)}>
              {metricTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <span style={{ color: '#667085', fontSize: 12 }}>
              {metricTypeOptions.find((option) => option.value === form.metricType)?.helper}
            </span>
          </label>

          <label style={{ display: 'grid', gap: 8 }}>
            <span>测量时间 *</span>
            <input type="datetime-local" value={form.measuredAt} onChange={(event) => onChange('measuredAt', event.target.value)} style={fieldStyle(Boolean(errors.measuredAt))} />
            <span style={{ color: '#667085', fontSize: 12 }}>建议保留当前时间，便于现场解释“刚录入、刚回显”。</span>
            {errors.measuredAt ? <span style={{ color: '#b42318', fontSize: 12 }}>{errors.measuredAt}</span> : null}
          </label>
        </div>

        {form.metricType === 'blood_pressure' ? (
          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginTop: 16 }}>
            {renderInput('systolic', '收缩压 *', '例如 128', '建议填 120~135 之间，更贴近日常演示')}
            {renderInput('diastolic', '舒张压 *', '例如 78', '建议填 70~85 之间')}
            {renderInput('pulse', '脉搏', '例如 72', '可选填，补充说明心率情况')}
          </div>
        ) : null}

        {form.metricType === 'blood_glucose' ? (
          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginTop: 16 }}>
            {renderInput('glucoseValue', '血糖值 *', '例如 6.2', '建议现场用 5.8~7.2 的自然区间')}
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
              <span style={{ color: '#667085', fontSize: 12 }}>选一个最容易讲清楚的餐前/餐后时段即可。</span>
            </label>
          </div>
        ) : null}

        {form.metricType === 'weight' ? (
          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginTop: 16 }}>
            {renderInput('weightKg', '体重 *', '例如 61.5', '适合补充“长期观察趋势”场景')}
          </div>
        ) : null}

        <div className="mobile-action-row" style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 20, flexWrap: 'wrap' }}>
          <button type="submit" disabled={loading} className="touch-button primary-button" style={{ padding: '12px 18px', background: '#2563eb', color: '#fff', border: 0, borderRadius: 10 }}>
            {loading ? '提交中...' : '保存指标'}
          </button>
          <span style={{ color: message.includes('失败') || message.includes('错误') ? '#b42318' : '#027a48' }}>{message}</span>
        </div>
      </form>

      <details className="result-panel" style={{ background: '#101828', color: '#f8fafc', borderRadius: 16, padding: 24, overflowX: 'auto' }}>
        <summary>查看接口返回预览</summary>
        <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{result || '提交后，这里会展示接口返回结果，适合演示时确认数据已经写入。'}</pre>
      </details>
    </div>
  );
}
