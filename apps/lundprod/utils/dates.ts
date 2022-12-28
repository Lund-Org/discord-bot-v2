export function formatDate(date: Date) {
  const months = [
    'Janvier',
    'Fevrier',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Aout',
    'Septembre',
    'Octobre',
    'Novembre',
    'Decembre',
  ];

  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatDateTime(date: Date) {
  return `${formatDate(date)} ${date
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
