import {
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

export function isHomePage(pathname: string) {
  return pathname === '/';
}

export function isGachaPage(pathname: string) {
  return pathname.startsWith('/gacha');
}

export function isGachaListPage(pathname: string) {
  return pathname === '/gacha';
}

export function isUserGachaPage(userId: string, pathname: string) {
  return pathname.replace('[discordId]', userId) === getUserProfileUrl(userId);
}

export function isBlogPage(pathname: string) {
  return pathname.startsWith('/blog');
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
    imgSrc: socialTwitter.src,
    title: 'Twitter',
    url: 'https://twitter.com/LundProd',
  },
  {
    imgSrc: socialYoutube.src,
    title: 'Youtube',
    url: 'https://youtube.com/c/lundprod',
  },
];
