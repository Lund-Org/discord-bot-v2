import { TFunction } from 'i18next';

export function formatDate(tFn: TFunction, date: Date) {
  const months = [
    tFn('months.january'),
    tFn('months.february'),
    tFn('months.march'),
    tFn('months.april'),
    tFn('months.may'),
    tFn('months.june'),
    tFn('months.july'),
    tFn('months.august'),
    tFn('months.september'),
    tFn('months.october'),
    tFn('months.november'),
    tFn('months.december'),
  ];

  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatDateTime(tFn: TFunction, date: Date) {
  return `${formatDate(tFn, date)} ${date
    .getHours()
    .toString()
    .padStart(2, '0')}h${date.getMinutes().toString().padStart(2, '0')}`;
}

export function formatBlogDate(date: Date) {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'full',
    timeStyle: 'medium',
    timeZone: 'Europe/Paris',
  }).format(date);
}

export function formatReleaseDate(date: Date) {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'short',
    timeStyle: undefined,
    timeZone: 'Europe/Paris',
  }).format(date);
}
