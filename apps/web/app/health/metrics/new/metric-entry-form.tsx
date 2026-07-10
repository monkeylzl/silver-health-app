'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

type MetricType = 'blood_pressure' | 'blood_glucose' | 'weight';

function localDateTimeValue() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

export function MetricEntryForm() {
  const router = useRouter();
  const [metricType, setMetricType] = useState<MetricType>('blood_pressure');
  const [systolic, setSystolic] = useState('128');
  const [diastolic, setDiastolic] = useState('78');
  const [pulse, setPulse] = useState('72');
  const [glucoseValue, setGlucoseValue] = useState('6.2');
  const [weightKg, setWeightKg] = useState('61.5');
  const [measuredAt, setMeasuredAt] = useState(localDateTimeValue);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!navigator.onLine) {
      setMessage('离线时不能保存指标。');
      return;
    }
    const body = {
      metricType,
      measuredAt: new Date(measuredAt).toISOString(),
      systolic: metricType === 'blood_pressure' ? Number(systolic) : undefined,
      diastolic: metricType === 'blood_pressure' ? Number(diastolic) : undefined,
      pulse: metricType === 'blood_pressure' ? Number(pulse) : undefined,
      glucoseValue: metricType === 'blood_glucose' ? Number(glucoseValue) : undefined,
      glucosePeriodType: metricType === 'blood_glucose' ? 'before_breakfast' : undefined,
      weightKg: metricType === 'weight' ? Number(weightKg) : undefined,
    };
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/app/metrics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const payload = await response.json().catch(() => null) as { message?: string } | null;
      if (!response.ok) throw new Error(payload?.message || '指标没有保存成功。');
      router.push('/health');
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '指标没有保存成功。');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="app-form" onSubmit={onSubmit}>
      <fieldset className="segmented-field">
        <legend>指标类型</legend>
        <div className="segmented-control">
          {([['blood_pressure', '血压'], ['blood_glucose', '血糖'], ['weight', '体重']] as const).map(([value, label]) => (
            <label key={value}><input type="radio" name="metricType" value={value} checked={metricType === value} onChange={() => setMetricType(value)} /><span>{label}</span></label>
          ))}
        </div>
      </fieldset>

      {metricType === 'blood_pressure' ? (
        <div className="form-grid-two">
          <label className="field-stack"><span>收缩压 *</span><input type="number" min="60" max="260" required value={systolic} onChange={(event) => setSystolic(event.target.value)} inputMode="decimal" /></label>
          <label className="field-stack"><span>舒张压 *</span><input type="number" min="40" max="180" required value={diastolic} onChange={(event) => setDiastolic(event.target.value)} inputMode="decimal" /></label>
          <label className="field-stack"><span>脉搏</span><input type="number" min="30" max="220" value={pulse} onChange={(event) => setPulse(event.target.value)} inputMode="decimal" /></label>
        </div>
      ) : null}
      {metricType === 'blood_glucose' ? <label className="field-stack"><span>血糖值 (mmol/L) *</span><input type="number" min="1" max="40" step="0.1" required value={glucoseValue} onChange={(event) => setGlucoseValue(event.target.value)} inputMode="decimal" /></label> : null}
      {metricType === 'weight' ? <label className="field-stack"><span>体重 (kg) *</span><input type="number" min="20" max="300" step="0.1" required value={weightKg} onChange={(event) => setWeightKg(event.target.value)} inputMode="decimal" /></label> : null}
      <label className="field-stack"><span>测量时间 *</span><input type="datetime-local" required value={measuredAt} onChange={(event) => setMeasuredAt(event.target.value)} /></label>
      <button className="button button--primary button--block" type="submit" disabled={loading}>{loading ? '正在保存…' : '保存指标'}</button>
      <p className="form-message form-message--error" aria-live="polite">{message}</p>
    </form>
  );
}
