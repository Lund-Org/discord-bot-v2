import { ArrayElement } from '@discord-bot-v2/common';

export const platForms = [
  {
    id: 6,
    abbreviation: 'PC',
    name: 'PC',
  },
  {
    id: 167,
    abbreviation: 'PS5',
    generation: 9,
    name: 'PlayStation 5',
  },
  {
    id: 169,
    abbreviation: 'Series X',
    generation: 9,
    name: 'Xbox Series X|S',
  },
  {
    id: 508,
    abbreviation: 'Switch 2',
    generation: 9,
    name: 'Switch 2',
  },
  {
    id: 48,
    abbreviation: 'PS4',
    generation: 8,
    name: 'PlayStation 4',
  },
  {
    id: 49,
    abbreviation: 'XONE',
    generation: 8,
    name: 'Xbox One',
  },
  {
    id: 130,
    abbreviation: 'Switch',
    generation: 8,
    name: 'Nintendo Switch',
  },
  {
    id: 34,
    abbreviation: 'Android',
    name: 'Android',
  },
  {
    id: 39,
    abbreviation: 'iOS',
    name: 'iOS',
  },
  {
    id: 41,
    abbreviation: 'WiiU',
    generation: 8,
    name: 'Wii U',
  },
  {
    id: 37,
    abbreviation: '3DS',
    generation: 8,
    name: 'Nintendo 3DS',
  },
  {
    id: 46,
    abbreviation: 'Vita',
    generation: 8,
    name: 'PlayStation Vita',
  },
  {
    id: 9,
    abbreviation: 'PS3',
    generation: 7,
    name: 'PlayStation 3',
  },
  {
    id: 12,
    abbreviation: 'X360',
    generation: 7,
    name: 'Xbox 360',
  },
  {
    id: 5,
    abbreviation: 'Wii',
    generation: 7,
    name: 'Wii',
  },
  {
    id: 20,
    abbreviation: 'NDS',
    generation: 7,
    name: 'Nintendo DS',
  },
  {
    id: 38,
    abbreviation: 'PSP',
    generation: 7,
    name: 'PlayStation Portable',
  },
  {
    id: 8,
    abbreviation: 'PS2',
    generation: 6,
    name: 'PlayStation 2',
  },
  {
    id: 11,
    abbreviation: 'XBOX',
    generation: 6,
    name: 'Xbox',
  },
  {
    id: 21,
    abbreviation: 'NGC',
    generation: 6,
    name: 'Nintendo GameCube',
  },
  {
    id: 23,
    abbreviation: 'DC',
    generation: 6,
    name: 'Dreamcast',
  },
  {
    id: 24,
    abbreviation: 'GBA',
    generation: 6,
    name: 'Game Boy Advance',
  },
  {
    id: 7,
    abbreviation: 'PS1',
    generation: 5,
    name: 'PlayStation',
  },
  {
    id: 4,
    abbreviation: 'N64',
    generation: 5,
    name: 'Nintendo 64',
  },
  {
    id: 32,
    abbreviation: 'Saturn',
    generation: 5,
    name: 'Sega Saturn',
  },
  {
    id: 22,
    abbreviation: 'GBC',
    generation: 5,
    name: 'Game Boy Color',
  },
  {
    id: 33,
    abbreviation: 'Game Boy',
    generation: 4,
    name: 'Game Boy',
  },
  {
    id: 78,
    abbreviation: 'segacd',
    generation: 4,
    name: 'Sega CD',
  },
  {
    id: 19,
    abbreviation: 'SNES',
    generation: 4,
    name: 'Super Nintendo Entertainment System',
  },
  {
    id: 29,
    abbreviation: 'MegaDrive',
    generation: 4,
    name: 'Sega Mega Drive',
  },
  {
    id: 35,
    abbreviation: 'Game Gear',
    generation: 4,
    name: 'Sega Game Gear',
  },
  {
    id: 64,
    abbreviation: 'SMS',
    generation: 3,
    name: 'Sega Master System',
  },
  {
    id: 18,
    abbreviation: 'NES',
    generation: 3,
    name: 'Nintendo Entertainment System',
  },
  {
    id: 82,
    abbreviation: 'Navigateur',
    name: 'Web browser',
  },
  {
    id: 3,
    abbreviation: 'Linux',
    name: 'Linux',
  },
  {
    id: 14,
    abbreviation: 'Mac',
    name: 'Mac',
  },
  {
    id: 162,
    abbreviation: 'Oculus VR',
    name: 'Oculus VR',
  },
  {
    id: 165,
    abbreviation: 'PSVR',
    name: 'PlayStation VR',
  },
  {
    id: 390,
    abbreviation: 'PSVR2',
    name: 'PlayStation VR2',
  },
  {
    id: 163,
    abbreviation: 'Steam VR',
    name: 'SteamVR',
  },
  {
    id: 387,
    abbreviation: 'Oculus Go',
    name: 'Oculus Go',
  },
  {
    id: 385,
    abbreviation: 'Oculus Rift',
    name: 'Oculus Rift',
  },
  {
    id: 384,
    abbreviation: 'Oculus Quest',
    name: 'Oculus Quest',
  },
  {
    id: 386,
    abbreviation: 'Meta Quest 2',
    name: 'Meta Quest 2',
  },
];

export type PlatFormType = ArrayElement<typeof platForms>;

export const getPlatformLabel = (platformId: number | undefined) => {
  const platform = platForms.find((p) => p.id === platformId);

  if (!platformId || !platform) {
    return undefined;
  }

  return platform.abbreviation;
};
