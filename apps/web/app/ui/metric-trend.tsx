import type { MetricRecord } from '../../lib/app-data';

export function MetricTrend({ metrics }: { metrics: MetricRecord[] }) {
  const pressure = metrics.filter((metric) => metric.metricType === 'blood_pressure' && metric.systolic).slice(0, 7).reverse();
  if (pressure.length === 0) return <p className="muted-text">记录血压后，这里会显示最近趋势。</p>;
  const values = pressure.map((metric) => Number(metric.systolic));
  const min = Math.min(...values, 80);
  const max = Math.max(...values, 160);
  const range = Math.max(max - min, 1);
  const points = values.map((value, index) => `${(index / Math.max(values.length - 1, 1)) * 100},${80 - ((value - min) / range) * 60}`).join(' ');

  return (
    <div className="trend-chart" role="img" aria-label={`最近 ${values.length} 次收缩压：${values.join('、')} 毫米汞柱`}>
      <svg viewBox="0 0 100 90" preserveAspectRatio="none" aria-hidden="true">
        <polyline points={points} fill="none" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="trend-chart__labels"><span>较早</span><strong>{values[values.length - 1]} mmHg</strong><span>最近</span></div>
    </div>
  );
}
