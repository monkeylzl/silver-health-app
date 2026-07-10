'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ElderProfile } from '../../../lib/app-data';

export function ProfileForm({ profile }: { profile: ElderProfile }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: profile.name || '',
    age: String(profile.age || ''),
    gender: profile.gender || 'female',
    mobilityLevel: profile.mobilityLevel || 'medium',
    helperMode: profile.helperMode || 'family_assisted',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!navigator.onLine) return setMessage('离线时不能保存档案。');
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/app/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, age: Number(form.age) }),
      });
      const payload = await response.json().catch(() => null) as { message?: string } | null;
      if (!response.ok) throw new Error(payload?.message || '档案没有保存成功。');
      setMessage('档案已保存。');
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '档案没有保存成功。');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="app-form" onSubmit={save}>
      <label className="field-stack"><span>姓名 *</span><input required maxLength={64} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
      <div className="form-grid-two">
        <label className="field-stack"><span>年龄 *</span><input required type="number" min="1" max="120" value={form.age} onChange={(event) => setForm({ ...form, age: event.target.value })} /></label>
        <label className="field-stack"><span>性别 *</span><select value={form.gender} onChange={(event) => setForm({ ...form, gender: event.target.value as ElderProfile['gender'] & string })}><option value="female">女</option><option value="male">男</option><option value="other">其他</option></select></label>
      </div>
      <label className="field-stack"><span>行动状态 *</span><select value={form.mobilityLevel} onChange={(event) => setForm({ ...form, mobilityLevel: event.target.value as ElderProfile['mobilityLevel'] & string })}><option value="low">需要更多照看</option><option value="medium">日常可自理</option><option value="high">行动较灵活</option></select></label>
      <label className="field-stack"><span>使用方式 *</span><select value={form.helperMode} onChange={(event) => setForm({ ...form, helperMode: event.target.value as ElderProfile['helperMode'] & string })}><option value="self">本人使用</option><option value="family_assisted">家人协助</option></select></label>
      <button className="button button--primary button--block" type="submit" disabled={loading}>{loading ? '正在保存…' : '保存档案'}</button>
      <p className={message.includes('没有') || message.includes('离线') ? 'form-message form-message--error' : 'form-message'} aria-live="polite">{message}</p>
    </form>
  );
}
