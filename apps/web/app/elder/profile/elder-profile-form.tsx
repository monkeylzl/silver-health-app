'use client';

import { FormEvent, useMemo, useState } from 'react';
import { apiBaseUrl, defaultElderUserId } from '../../../lib/config';

type Gender = 'male' | 'female' | 'other';
type MobilityLevel = 'low' | 'medium' | 'high';
type HelperMode = 'self' | 'family_assisted';

type ElderProfileFormState = {
  userId: string;
  nickname: string;
  mobile: string;
  name: string;
  gender: Gender;
  age: string;
  heightCm: string;
  weightKg: string;
  chronicConditions: string;
  commonMedicines: string;
  mobilityLevel: MobilityLevel;
  helperMode: HelperMode;
};

type FormErrors = Partial<Record<keyof ElderProfileFormState, string>>;

const initialFormState: ElderProfileFormState = {
  userId: defaultElderUserId,
  nickname: '李阿姨',
  mobile: '13800138000',
  name: '李秀兰',
  gender: 'female',
  age: '68',
  heightCm: '160',
  weightKg: '61',
  chronicConditions: '高血压，2 型糖尿病',
  commonMedicines: '氨氯地平，二甲双胍',
  mobilityLevel: 'medium',
  helperMode: 'family_assisted',
};

const mobilityOptions: Array<{ value: MobilityLevel; label: string; helper: string }> = [
  { value: 'low', label: '行动需要更多照看', helper: '适合卧床、步行明显受限等场景' },
  { value: 'medium', label: '日常可自理，偶尔需要协助', helper: '适合多数需要家属提醒的老人' },
  { value: 'high', label: '行动较灵活', helper: '适合能自主完成大部分日常活动的老人' },
];

const helperModeOptions: Array<{ value: HelperMode; label: string; helper: string }> = [
  { value: 'self', label: '老人自己使用为主', helper: '适合老人能独立完成查看与录入' },
  { value: 'family_assisted', label: '家属协助为主', helper: '适合家属一起建档、录指标、看周报' },
];

function parseList(value: string) {
  return value
    .split(/[，,、\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function isBlank(value: string) {
  return value.trim().length === 0;
}

function isZhMobile(value: string) {
  return /^1\d{10}$/.test(value.trim());
}

function validateForm(form: ElderProfileFormState): FormErrors {
  const errors: FormErrors = {};

  if (isBlank(form.name)) {
    errors.name = '姓名不能为空';
  }

  const age = Number(form.age);
  if (!Number.isInteger(age) || age < 1 || age > 120) {
    errors.age = '年龄需为 1~120 的整数';
  }

  if (form.mobile.trim() && !isZhMobile(form.mobile)) {
    errors.mobile = '手机号格式不正确，应为 11 位大陆手机号';
  }

  if (form.heightCm.trim()) {
    const heightCm = Number(form.heightCm);
    if (!Number.isInteger(heightCm) || heightCm < 50 || heightCm > 260) {
      errors.heightCm = '身高需为 50~260 的整数';
    }
  }

  if (form.weightKg.trim()) {
    const weightKg = Number(form.weightKg);
    if (!Number.isInteger(weightKg) || weightKg < 20 || weightKg > 300) {
      errors.weightKg = '体重需为 20~300 的整数';
    }
  }

  return errors;
}

function getErrorMessage(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== 'object') {
    return fallback;
  }

  const maybePayload = payload as {
    message?: string | string[];
    error?: string;
  };

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

function fieldStyle(hasError: boolean) {
  return {
    padding: '10px 12px',
    border: `1px solid ${hasError ? '#f04438' : '#d0d5dd'}`,
    borderRadius: 10,
  } as const;
}

export function ElderProfileForm() {
  const [form, setForm] = useState<ElderProfileFormState>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [message, setMessage] = useState('');
  const [result, setResult] = useState<string>('');

  const canLoad = useMemo(() => form.userId.trim().length > 0, [form.userId]);
  const isCreateMode = form.userId.trim().length === 0;

  const onChange = (key: keyof ElderProfileFormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const loadProfile = async () => {
    if (!canLoad) {
      setMessage('请先填写档案编号，再加载已有档案。');
      return;
    }

    setLoadingProfile(true);
    setMessage('');

    try {
      const response = await fetch(`${apiBaseUrl}/api/profile/elder/${form.userId}`);
      const payload = await response.json();

      if (!response.ok || payload.code !== 0) {
        throw new Error(getErrorMessage(payload, '加载档案失败'));
      }

      const data = payload.data;
      setForm((prev) => ({
        ...prev,
        nickname: data.user?.nickname ?? '',
        mobile: data.user?.mobile ?? '',
        name: data.name ?? '',
        gender: data.gender ?? 'female',
        age: String(data.age ?? ''),
        heightCm: data.heightCm ? String(data.heightCm) : '',
        weightKg: data.weightKg ? String(data.weightKg) : '',
        chronicConditions: Array.isArray(data.chronicConditions) ? data.chronicConditions.join('，') : '',
        commonMedicines: Array.isArray(data.commonMedicines) ? data.commonMedicines.join('，') : '',
        mobilityLevel: data.mobilityLevel ?? 'medium',
        helperMode: data.helperMode ?? 'family_assisted',
      }));
      setErrors({});
      setResult(JSON.stringify(payload.data, null, 2));
      setMessage('档案已载入，可以直接补充或调整信息。');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '加载档案失败');
      setResult('');
    } finally {
      setLoadingProfile(false);
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setMessage('请先修正表单中的错误项。');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const body = {
        userId: form.userId.trim() || undefined,
        nickname: form.nickname.trim() || undefined,
        mobile: form.mobile.trim() || undefined,
        name: form.name.trim(),
        gender: form.gender,
        age: Number(form.age),
        heightCm: form.heightCm ? Number(form.heightCm) : undefined,
        weightKg: form.weightKg ? Number(form.weightKg) : undefined,
        chronicConditions: parseList(form.chronicConditions),
        commonMedicines: parseList(form.commonMedicines),
        mobilityLevel: form.mobilityLevel,
        helperMode: form.helperMode,
      };

      const response = await fetch(`${apiBaseUrl}/api/profile/elder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const payload = await response.json();

      if (!response.ok || payload.code !== 0) {
        throw new Error(getErrorMessage(payload, '保存档案失败'));
      }

      if (payload.data?.userId) {
        setForm((prev) => ({
          ...prev,
          userId: payload.data.userId,
          nickname: payload.data.user?.nickname ?? prev.nickname,
          mobile: payload.data.user?.mobile ?? prev.mobile,
        }));
      }

      const successMessage = payload.data?.createdUser
        ? `建档成功，系统已自动生成档案编号：${payload.data.userId}。下一步可直接去“今日任务”。`
        : '档案已保存，下一步可直接去“今日任务”继续演示。';

      setMessage(successMessage);
      setResult(JSON.stringify(payload.data, null, 2));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '保存档案失败');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (key: keyof ElderProfileFormState, label: string, placeholder?: string, helper?: string) => (
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
          <div>
            <h2 style={{ margin: 0 }}>老人建档表单</h2>
            <p style={{ color: '#667085', margin: '8px 0 0' }}>
              默认已填好一份适合演示的示例资料。可直接保存生成档案，也可先输入已有档案编号再回填修改。
            </p>
          </div>
          <button type="button" onClick={loadProfile} disabled={loadingProfile || !canLoad} className="touch-button" style={{ padding: '10px 16px' }}>
            {loadingProfile ? '加载中...' : '载入已有档案'}
          </button>
        </div>

        <div style={{ display: 'grid', gap: 12, marginBottom: 16 }}>
          <div style={{ padding: 12, borderRadius: 12, background: '#eff8ff', color: '#175cd3' }}>
            当前模式：<strong>{isCreateMode ? '新建老人档案' : '编辑已有老人档案'}</strong>
          </div>
          <div style={{ padding: 12, borderRadius: 12, background: '#f8f9fc', color: '#344054' }}>
            保存后会影响哪里：<strong>今日任务、指标录入、家属看板和周报</strong>都会围绕这位老人继续展示。
          </div>
        </div>

        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {renderInput('userId', '档案编号（可留空自动生成）', '留空即可由系统自动生成', '如果已经建过档，可输入原编号后载入')}
          {renderInput('nickname', '页面称呼', '例如 李阿姨', '用于首页、看板等友好称呼')}
          {renderInput('mobile', '联系手机号', '例如 13800138000')}
          {renderInput('name', '老人姓名 *', '例如 李秀兰')}
          {renderInput('age', '年龄 *', '例如 68')}
          {renderInput('heightCm', '身高(cm)', '例如 160')}
          {renderInput('weightKg', '体重(kg)', '例如 61')}

          <label style={{ display: 'grid', gap: 8 }}>
            <span>性别 *</span>
            <select value={form.gender} onChange={(event) => onChange('gender', event.target.value)} style={fieldStyle(false)}>
              <option value="male">男</option>
              <option value="female">女</option>
              <option value="other">其他</option>
            </select>
          </label>

          <label style={{ display: 'grid', gap: 8 }}>
            <span>行动状态 *</span>
            <select value={form.mobilityLevel} onChange={(event) => onChange('mobilityLevel', event.target.value)} style={fieldStyle(false)}>
              {mobilityOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <span style={{ color: '#667085', fontSize: 12 }}>
              {mobilityOptions.find((option) => option.value === form.mobilityLevel)?.helper}
            </span>
          </label>

          <label style={{ display: 'grid', gap: 8 }}>
            <span>照护方式 *</span>
            <select value={form.helperMode} onChange={(event) => onChange('helperMode', event.target.value)} style={fieldStyle(false)}>
              {helperModeOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <span style={{ color: '#667085', fontSize: 12 }}>
              {helperModeOptions.find((option) => option.value === form.helperMode)?.helper}
            </span>
          </label>
        </div>

        <div style={{ display: 'grid', gap: 16, marginTop: 16 }}>
          <label style={{ display: 'grid', gap: 8 }}>
            <span>慢病情况</span>
            <textarea value={form.chronicConditions} onChange={(event) => onChange('chronicConditions', event.target.value)} rows={3} placeholder="例如：高血压，2 型糖尿病" style={fieldStyle(false)} />
            <span style={{ color: '#667085', fontSize: 12 }}>可填写 1~3 项关键信息，便于后续讲任务与提醒来源。</span>
          </label>
          <label style={{ display: 'grid', gap: 8 }}>
            <span>常用药物</span>
            <textarea value={form.commonMedicines} onChange={(event) => onChange('commonMedicines', event.target.value)} rows={3} placeholder="例如：氨氯地平，二甲双胍" style={fieldStyle(false)} />
            <span style={{ color: '#667085', fontSize: 12 }}>这里填写的药物，会和后面的用药提醒形成自然呼应。</span>
          </label>
        </div>

        <div className="mobile-action-row" style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 20, flexWrap: 'wrap' }}>
          <button type="submit" disabled={loading} className="touch-button primary-button" style={{ padding: '12px 18px', background: '#2563eb', color: '#fff', border: 0, borderRadius: 10 }}>
            {loading ? '提交中...' : '保存档案'}
          </button>
          <span style={{ color: message.includes('失败') || message.includes('错误') ? '#b42318' : '#027a48' }}>{message}</span>
        </div>
      </form>

      <details className="result-panel" style={{ background: '#101828', color: '#f8fafc', borderRadius: 16, padding: 24, overflowX: 'auto' }}>
        <summary>查看接口返回预览</summary>
        <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{result || '保存或载入后，这里会展示接口返回结果，便于演示时确认档案已生效。'}</pre>
      </details>
    </div>
  );
}
