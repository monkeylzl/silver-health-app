'use client';

import { Bell, Pencil, Plus, Power, Trash2, X } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { MedicationReminder } from '../../../lib/app-data';

const emptyForm = { id: '', medicineName: '', dosageText: '', remindTime: '08:00', repeatRule: 'daily', enabled: true };

export function MedicationManager({ initialItems }: { initialItems: MedicationReminder[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  function startEdit(item?: MedicationReminder) {
    setForm(item ? { ...item } : emptyForm);
    setEditing(true);
    setMessage('');
  }

  async function request(id: string, method: 'PATCH' | 'DELETE', body?: object) {
    const response = await fetch(`/api/app/medications/${encodeURIComponent(id)}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const payload = await response.json().catch(() => null) as { message?: string; data?: MedicationReminder } | null;
    if (!response.ok) throw new Error(payload?.message || '用药提醒没有更新成功。');
    return payload?.data;
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!navigator.onLine) return setMessage('离线时不能保存提醒。');
    setLoading(true);
    setMessage('');
    const payload = { medicineName: form.medicineName.trim(), dosageText: form.dosageText.trim(), remindTime: form.remindTime, repeatRule: form.repeatRule, enabled: form.enabled };
    try {
      let savedItem: MedicationReminder | undefined;
      if (form.id) savedItem = await request(form.id, 'PATCH', payload);
      else {
        const response = await fetch('/api/app/medications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const result = await response.json().catch(() => null) as { message?: string; data?: MedicationReminder } | null;
        if (!response.ok) throw new Error(result?.message || '用药提醒没有保存成功。');
        savedItem = result?.data;
      }
      if (savedItem) {
        setItems((current) => form.id
          ? current.map((entry) => entry.id === savedItem!.id ? savedItem! : entry)
          : [savedItem!, ...current]);
      }
      setEditing(false);
      setForm(emptyForm);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '用药提醒没有保存成功。');
    } finally {
      setLoading(false);
    }
  }

  async function toggle(item: MedicationReminder) {
    if (!navigator.onLine) return setMessage('离线时不能更新提醒。');
    try {
      await request(item.id, 'PATCH', { enabled: !item.enabled });
      setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, enabled: !entry.enabled } : entry));
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '用药提醒没有更新成功。');
    }
  }

  async function remove(item: MedicationReminder) {
    if (!window.confirm(`确认删除“${item.medicineName}”的提醒吗？`)) return;
    try {
      await request(item.id, 'DELETE');
      setItems((current) => current.filter((entry) => entry.id !== item.id));
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '用药提醒没有删除成功。');
    }
  }

  return (
    <>
      <button className="button button--primary button--block mobile-only-action" type="button" onClick={() => startEdit()} data-touch-target><Plus aria-hidden="true" />新增用药提醒</button>
      {editing ? (
        <form className="app-form medication-form" onSubmit={save}>
          <div className="form-title-row"><h2>{form.id ? '编辑用药提醒' : '新增用药提醒'}</h2><button type="button" className="icon-button" aria-label="关闭编辑" onClick={() => setEditing(false)}><X aria-hidden="true" /></button></div>
          <label className="field-stack"><span>药品名称 *</span><input required maxLength={128} value={form.medicineName} onChange={(event) => setForm({ ...form, medicineName: event.target.value })} /></label>
          <label className="field-stack"><span>服用说明 *</span><input required maxLength={64} value={form.dosageText} onChange={(event) => setForm({ ...form, dosageText: event.target.value })} placeholder="例如 早餐后 1 片" /></label>
          <div className="form-grid-two">
            <label className="field-stack"><span>提醒时间 *</span><input type="time" required value={form.remindTime} onChange={(event) => setForm({ ...form, remindTime: event.target.value })} /></label>
            <label className="field-stack"><span>提醒频率 *</span><select value={form.repeatRule} onChange={(event) => setForm({ ...form, repeatRule: event.target.value })}><option value="daily">每天</option><option value="weekdays">工作日</option><option value="weekends">周末</option></select></label>
          </div>
          <label className="switch-row"><input type="checkbox" checked={form.enabled} onChange={(event) => setForm({ ...form, enabled: event.target.checked })} /><span>保存后立即启用</span></label>
          <button className="button button--primary button--block" type="submit" disabled={loading}>{loading ? '正在保存…' : '保存提醒'}</button>
        </form>
      ) : null}

      <div className="medication-list">
        {items.map((item) => (
          <article className="medication-row medication-row--manage" key={item.id}>
            <div><h3>{item.medicineName}</h3><p>{item.dosageText} · {item.remindTime}</p><span className={item.enabled ? 'status-label status-label--success' : 'status-label'}><Bell aria-hidden="true" />{item.enabled ? '提醒已启用' : '提醒已暂停'}</span></div>
            <div className="row-actions">
              <button className="icon-button" type="button" aria-label={`编辑 ${item.medicineName}`} onClick={() => startEdit(item)}><Pencil aria-hidden="true" /></button>
              <button className="icon-button" type="button" aria-label={`${item.enabled ? '暂停' : '启用'} ${item.medicineName}`} onClick={() => toggle(item)}><Power aria-hidden="true" /></button>
              <button className="icon-button icon-button--danger" type="button" aria-label={`删除 ${item.medicineName}`} onClick={() => remove(item)}><Trash2 aria-hidden="true" /></button>
            </div>
          </article>
        ))}
      </div>
      <p className="form-message form-message--error" aria-live="polite">{message}</p>
    </>
  );
}
