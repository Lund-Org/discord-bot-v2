import {
  socialBluesky,
  socialDiscord,
  socialInstagram,
  socialItchIo,
  socialLinktree,
  socialTwitch,
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

export function isContactPage(pathname: string) {
  return pathname === `/contact`;
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

export const networks = {
  global: [
    {
      imgSrc: socialLinktree.src,
      title: 'Linktree',
      url: 'https://linktr.ee/lundprod',
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
  ],
  lundprod: [
    {
      imgSrc: socialYoutube.src,
      title: 'Youtube',
      url: 'https://www.youtube.com/channel/UCKpN9rCNf0zgUdx3__oytxQ',
    },
    {
      imgSrc: socialDiscord.src,
      title: 'Discord',
      url: 'https://discord.gg/tCYmDm2',
    },
  ],
  lundprodGameDev: [
    {
      imgSrc: socialYoutube.src,
      title: 'Youtube',
      url: 'https://www.youtube.com/channel/UCTDi2ogxl8FRF9yAIJQRYIA',
    },
    {
      imgSrc: socialDiscord.src,
      title: 'Discord',
      url: 'https://discord.gg/6RTVVrNVxz',
    },
    {
      imgSrc: socialInstagram.src,
      title: 'Insta',
      url: 'https://www.instagram.com/lundprodgamedev/',
    },
    {
      imgSrc: socialItchIo.src,
      title: 'Itch.io',
      url: 'https://mystilund.itch.io/',
    },
  ],
} as const;

export type NetworkKey = keyof typeof networks;
