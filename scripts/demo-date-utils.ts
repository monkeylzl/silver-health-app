const BUSINESS_TIME_ZONE = 'Asia/Shanghai';
const BUSINESS_UTC_OFFSET = '+08:00';

function dateKey(date: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: BUSINESS_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function shiftedDateKey(daysFromToday: number, now: Date) {
  const anchor = new Date(`${dateKey(now)}T12:00:00.000Z`);
  anchor.setUTCDate(anchor.getUTCDate() + daysFromToday);
  return anchor.toISOString().slice(0, 10);
}

export function getLocalAnchorDate(daysFromToday = 0, now = new Date()) {
  return new Date(`${shiftedDateKey(daysFromToday, now)}T12:00:00.000Z`);
}

export function getLocalDateOnly(daysFromToday = 0, now = new Date()) {
  return getLocalAnchorDate(daysFromToday, now);
}

export function getLocalDateTime(daysFromToday: number, hour: number, minute = 0, now = new Date()) {
  const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00.000`;
  return new Date(`${shiftedDateKey(daysFromToday, now)}T${time}${BUSINESS_UTC_OFFSET}`);
}

export function getStartOfWeek(date = getLocalAnchorDate()) {
  const start = new Date(`${dateKey(date)}T12:00:00.000Z`);
  const day = start.getUTCDay();
  start.setUTCDate(start.getUTCDate() + (day === 0 ? -6 : 1 - day));
  return start;
}

export function getWeekRange(weeksAgo = 0, now = new Date()) {
  const currentWeekStart = getStartOfWeek(getLocalAnchorDate(0, now));
  const start = new Date(currentWeekStart);
  start.setUTCDate(start.getUTCDate() - weeksAgo * 7);

  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 6);

  return { start, end };
}

export function formatLocalDate(date: Date) {
  return dateKey(date);
}
