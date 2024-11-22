import { TFunction } from 'i18next';

export const getProjects = (tFn: TFunction) => [
  {
    title: tFn('projects.projects.awards.title'),
    description: tFn('projects.projects.awards.description'),
    to: '/projects/awards',
    bgImg: 'https://d18wazra96xhgb.cloudfront.net/projects/project-awards.png',
    date: tFn('projects.projects.awards.date'),
  },
  {
    title: tFn('projects.projects.wherestheroad.title'),
    description: tFn('projects.projects.wherestheroad.description'),
    to: 'https://www.youtube.com/watch?v=AFRkQTwi-FI',
    bgImg:
      'https://d18wazra96xhgb.cloudfront.net/projects/project-kenneyjam.png',
    date: tFn('projects.projects.wherestheroad.date'),
  },
  {
    title: tFn('projects.projects.guessThePal.title'),
    description: tFn('projects.projects.guessThePal.description'),
    to: '/projects/guess-the-pal',
    bgImg:
      'https://d18wazra96xhgb.cloudfront.net/projects/project-guess-the-pal.png',
    date: tFn('projects.projects.guessThePal.date'),
  },
  {
    title: tFn('projects.projects.3D.title'),
    description: tFn('projects.projects.3D.description'),
    to: '/projects/3D',
    bgImg: 'https://d18wazra96xhgb.cloudfront.net/projects/project-3d.png',
    date: tFn('projects.projects.3D.date'),
  },
  {
    title: tFn('projects.projects.pizzaJam.title'),
    description: tFn('projects.projects.pizzaJam.description'),
    to: 'https://www.youtube.com/watch?v=_3uPvKxog2A',
    newTab: true,
    bgImg: 'https://d18wazra96xhgb.cloudfront.net/projects/project-pizza.png',
    date: tFn('projects.projects.pizzaJam.date'),
  },
  {
    title: tFn('projects.projects.lundprod.title'),
    description: tFn('projects.projects.lundprod.description'),
    to: '#',
    bgImg:
      'https://d18wazra96xhgb.cloudfront.net/projects/project-lundprod.png',
    date: tFn('projects.projects.lundprod.date'),
  },
  {
    title: tFn('projects.projects.gacha.title'),
    description: tFn('projects.projects.gacha.description'),
    to: '/gacha',
    bgImg: 'https://d18wazra96xhgb.cloudfront.net/projects/project-gacha.png',
    date: tFn('projects.projects.gacha.date'),
  },
];
