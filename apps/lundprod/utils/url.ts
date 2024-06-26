import {
  socialBluesky,
  socialDiscord,
  socialTwitch,
  socialTwitter,
  socialYoutube,
} from '../assets';

export function getGachaRankingPage() {
  return '/gacha/ranking';
}

export function getUserProfileUrl(id: string) {
  return `/u/${id}`;
}

export function getUserListUrl() {
  return `/u/list`;
}

export function isHomePage(pathname: string) {
  return pathname === '/';
}

export function isGachaPage(pathname: string, strict = true) {
  return strict ? pathname === '/gacha' : pathname.startsWith('/gacha');
}

export function isGachaListPage(pathname: string) {
  return pathname === '/gacha/list';
}

export function isUserGachaPage(userId: string, pathname: string) {
  return pathname.replace('[discordId]', userId) === getUserProfileUrl(userId);
}

export function isBlogPage(pathname: string) {
  return pathname.startsWith('/blog');
}

export function isUsersPage(pathname: string) {
  return pathname === '/u/list';
}

export function isProjectPage(pathname: string) {
  return pathname.startsWith('/projects');
}

export function isGachaRankingPage(pathname: string) {
  return pathname === getGachaRankingPage();
}

export const networks = [
  {
    imgSrc: socialDiscord.src,
    title: 'Discord',
    url: 'https://discord.gg/gJyu9p2',
  },
  {
    imgSrc: socialTwitch.src,
    title: 'Twitch',
    url: 'https://www.twitch.tv/lundprod',
  },
  {
    imgSrc: socialBluesky.src,
    title: 'Bluesky',
    url: 'https://bsky.app/profile/lund.bsky.social',
  },
  {
    imgSrc: socialYoutube.src,
    title: 'Youtube',
    url: 'https://youtube.com/c/lundprod',
  },
  {
    imgSrc: socialTwitter.src,
    title: 'Twitter',
    url: 'https://twitter.com/LundProd',
  },
];
