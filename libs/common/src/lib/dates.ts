export function getEndOfDay(d = new Date()) {
  const date = new Date(d);

  date.setHours(23);
  date.setMinutes(59);
  date.setSeconds(59);
  date.setMilliseconds(999);

  return date;
}
