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
  nickname: '',
  mobile: '',
  name: '',
  gender: 'female',
  age: '68',
  heightCm: '',
  weightKg: '',
  chronicConditions: '',
  commonMedicines: '',
  mobilityLevel: 'medium',
  helperMode: 'family_assisted',
};

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
      setMessage('请先输入 userId 再加载档案。');
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
      setMessage('已加载该 userId 的档案。');
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
        ? `建档成功，已自动创建 elder 用户：${payload.data.userId}`
        : '建档/更新成功。';

      setMessage(successMessage);
      setResult(JSON.stringify(payload.data, null, 2));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '保存档案失败');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (key: keyof ElderProfileFormState, label: string, placeholder?: string) => (
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
          <div>
            <h2 style={{ margin: 0 }}>老人建档表单</h2>
            <p style={{ color: '#667085', margin: '8px 0 0' }}>
              现在支持两种模式：填写现有 `userId` 更新档案，或留空 `userId` 由系统自动创建 elder 用户并完成建档。
            </p>
          </div>
          <button type="button" onClick={loadProfile} disabled={loadingProfile || !canLoad} style={{ padding: '10px 16px' }}>
            {loadingProfile ? '加载中...' : '按 userId 加载'}
          </button>
        </div>

        <div style={{ marginBottom: 16, padding: 12, borderRadius: 12, background: '#eff8ff', color: '#175cd3' }}>
          当前模式：<strong>{isCreateMode ? '自动创建 elder 用户并建档' : '基于已有 userId 更新/查看档案'}</strong>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {renderInput('userId', '用户 ID（可留空自动创建）')}
          {renderInput('nickname', '昵称')}
          {renderInput('mobile', '手机号', '例如 13800138000')}
          {renderInput('name', '姓名 *')}
          {renderInput('age', '年龄 *')}
          {renderInput('heightCm', '身高(cm)')}
          {renderInput('weightKg', '体重(kg)')}

          <label style={{ display: 'grid', gap: 8 }}>
            <span>性别 *</span>
            <select value={form.gender} onChange={(event) => onChange('gender', event.target.value)} style={fieldStyle(false)}>
              <option value="male">男</option>
              <option value="female">女</option>
              <option value="other">其他</option>
            </select>
          </label>

          <label style={{ display: 'grid', gap: 8 }}>
            <span>行动能力 *</span>
            <select value={form.mobilityLevel} onChange={(event) => onChange('mobilityLevel', event.target.value)} style={fieldStyle(false)}>
              <option value="low">低</option>
              <option value="medium">中</option>
              <option value="high">高</option>
            </select>
          </label>

          <label style={{ display: 'grid', gap: 8 }}>
            <span>协助模式 *</span>
            <select value={form.helperMode} onChange={(event) => onChange('helperMode', event.target.value)} style={fieldStyle(false)}>
              <option value="self">自助</option>
              <option value="family_assisted">家属协助</option>
            </select>
          </label>
        </div>

        <div style={{ display: 'grid', gap: 16, marginTop: 16 }}>
          <label style={{ display: 'grid', gap: 8 }}>
            <span>慢病情况</span>
            <textarea value={form.chronicConditions} onChange={(event) => onChange('chronicConditions', event.target.value)} rows={3} placeholder="如：高血压，糖尿病" style={fieldStyle(false)} />
          </label>
          <label style={{ display: 'grid', gap: 8 }}>
            <span>常用药物</span>
            <textarea value={form.commonMedicines} onChange={(event) => onChange('commonMedicines', event.target.value)} rows={3} placeholder="如：氨氯地平，二甲双胍" style={fieldStyle(false)} />
          </label>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 20, flexWrap: 'wrap' }}>
          <button type="submit" disabled={loading} style={{ padding: '12px 18px', background: '#2563eb', color: '#fff', border: 0, borderRadius: 10 }}>
            {loading ? '提交中...' : '保存档案'}
          </button>
          <span style={{ color: message.includes('失败') || message.includes('错误') ? '#b42318' : '#027a48' }}>{message}</span>
        </div>
      </form>

      <section style={{ background: '#101828', color: '#f8fafc', borderRadius: 16, padding: 24, overflowX: 'auto' }}>
        <h3 style={{ marginTop: 0 }}>接口返回预览</h3>
        <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{result || '提交或加载后，这里会展示接口返回结果。'}</pre>
      </section>
    </div>
  );
}
