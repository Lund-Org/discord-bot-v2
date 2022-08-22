import { CardType, Profile } from '@discord-bot-v2/common';

export const fetchProfile = async (id: string): Promise<Profile> => {
  const myInit: RequestInit = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  };

  return new Promise((resolve, reject) => {
    fetch(`/api/profile/${id}`, myInit)
      .then((response) => response.json())
      .then((profile) => {
        return {
          ...profile,
          joinDate: new Date(profile.joinDate),
          lastMessageDate: new Date(profile.lastMessageDate),
          lastDailyDraw: new Date(profile.lastDailyDraw),
        };
      })
      .then(resolve)
      .catch(reject);
  });
};

export const fetchFusions = async (discordId: string): Promise<CardType[]> => {
  const myInit: RequestInit = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  };

  return new Promise((resolve, reject) => {
    fetch(`/api/fusions/${discordId}`, myInit)
      .then((response) => response.json())
      .then(resolve)
      .catch(reject);
  });
};
