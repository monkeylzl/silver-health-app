import 'server-only';
import { AppApiError, serverApiRequest } from './server-api';
import { serverDefaultElderUserId } from './server-config';

export type TaskItem = {
  id: string;
  title: string;
  description?: string | null;
  taskType: 'exercise' | 'diet' | 'medication' | 'measurement';
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'done' | 'skipped' | 'expired';
  dueTime?: string | null;
  completedAt?: string | null;
};

export type MetricRecord = {
  id: string;
  metricType: 'blood_pressure' | 'blood_glucose' | 'weight';
  systolic?: number | null;
  diastolic?: number | null;
  pulse?: number | null;
  glucoseValue?: number | null;
  weightKg?: number | null;
  measuredAt: string;
};

export type MedicationReminder = {
  id: string;
  medicineName: string;
  dosageText: string;
  remindTime: string;
  repeatRule: string;
  enabled: boolean;
};

export type ElderProfile = {
  userId: string;
  name?: string | null;
  age?: number | null;
  gender?: 'male' | 'female' | 'other' | null;
  mobilityLevel?: 'low' | 'medium' | 'high' | null;
  helperMode?: 'self' | 'family_assisted' | null;
  user?: { nickname?: string | null; mobile?: string | null } | null;
};

export type WeeklyReport = {
  id: string;
  weekStartDate: string;
  weekEndDate: string;
  exerciseCompletionRate?: number | null;
  medicationCompletionRate?: number | null;
  metricRecordCount: number;
  summaryText?: string | null;
  suggestionList?: string[] | null;
};

export type FamilyBinding = {
  id: string;
  relationType: 'son' | 'daughter' | 'spouse' | 'other';
  status: 'pending' | 'active' | 'unbound';
  familyUserId: string;
};

function elderId() {
  if (!serverDefaultElderUserId) throw new AppApiError('当前健康档案尚未配置，请联系管理员。', 503);
  return encodeURIComponent(serverDefaultElderUserId);
}

export function getTasks() {
  return serverApiRequest<TaskItem[]>(`/api/tasks/elder/${elderId()}`);
}

export function getMetrics() {
  return serverApiRequest<MetricRecord[]>(`/api/metrics/elder/${elderId()}`);
}

export function getMedications() {
  return serverApiRequest<MedicationReminder[]>(`/api/medications/elder/${elderId()}`);
}

export function getProfile() {
  return serverApiRequest<ElderProfile>(`/api/profile/elder/${elderId()}`);
}

export function getReports() {
  return serverApiRequest<WeeklyReport[]>(`/api/reports/elder/${elderId()}`);
}

export function getBindings() {
  return serverApiRequest<FamilyBinding[]>(`/api/family-bindings/elder/${elderId()}`);
}

export function formatMetricValue(metric?: MetricRecord) {
  if (!metric) return '暂无记录';
  if (metric.metricType === 'blood_pressure') return `${metric.systolic ?? '-'} / ${metric.diastolic ?? '-'} mmHg`;
  if (metric.metricType === 'blood_glucose') return `${metric.glucoseValue ?? '-'} mmol/L`;
  return `${metric.weightKg ?? '-'} kg`;
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}
