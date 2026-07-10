type MetricPayload = {
  metricType: 'blood_pressure' | 'blood_glucose' | 'weight';
  systolic?: number;
  diastolic?: number;
  pulse?: number;
  glucoseValue?: number;
  glucosePeriodType?: string;
  weightKg?: number;
};

export function validateMetricPayload(metric: MetricPayload): string | null {
  if (metric.metricType === 'blood_pressure') {
    if (metric.systolic === undefined || metric.diastolic === undefined) return '血压记录需要填写收缩压和舒张压。';
    if (metric.glucoseValue !== undefined || metric.glucosePeriodType !== undefined || metric.weightKg !== undefined) return '填写的数值与指标类型不匹配。';
    return null;
  }
  if (metric.metricType === 'blood_glucose') {
    if (metric.glucoseValue === undefined) return '血糖记录需要填写血糖值。';
    if (metric.systolic !== undefined || metric.diastolic !== undefined || metric.pulse !== undefined || metric.weightKg !== undefined) return '填写的数值与指标类型不匹配。';
    return null;
  }
  if (metric.weightKg === undefined) return '体重记录需要填写体重。';
  if (metric.systolic !== undefined || metric.diastolic !== undefined || metric.pulse !== undefined || metric.glucoseValue !== undefined || metric.glucosePeriodType !== undefined) return '填写的数值与指标类型不匹配。';
  return null;
}
