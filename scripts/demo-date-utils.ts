export function getLocalAnchorDate(daysFromToday = 0) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + daysFromToday);
  return date;
}

export function getLocalDateOnly(daysFromToday = 0) {
  const date = getLocalAnchorDate(daysFromToday);
  date.setHours(12, 0, 0, 0);
  return date;
}

export function getLocalDateTime(daysFromToday: number, hour: number, minute = 0) {
  const date = getLocalAnchorDate(daysFromToday);
  date.setHours(hour, minute, 0, 0);
  return date;
}

export function getStartOfWeek(date = getLocalAnchorDate()) {
  const start = new Date(date);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);
  start.setHours(12, 0, 0, 0);
  return start;
}

export function getWeekRange(weeksAgo = 0) {
  const currentWeekStart = getStartOfWeek();
  const start = new Date(currentWeekStart);
  start.setDate(start.getDate() - weeksAgo * 7);
  start.setHours(12, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(12, 0, 0, 0);

  return { start, end };
}

export function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}
