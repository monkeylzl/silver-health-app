import { BackHeader } from '../../../ui/app-components';
import { MetricEntryForm } from './metric-entry-form';

export default function NewMetricPage() {
  return <main className="app-shell app-shell--form"><BackHeader href="/health" title="记录健康指标" /><MetricEntryForm /></main>;
}
