import { Rank } from '@discord-bot-v2/common';

export const fetchRanks = async (): Promise<Rank[]> => {
  const myInit: RequestInit = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  };

  return new Promise((resolve, reject) => {
    fetch('/api/ranks', myInit)
      .then((response) => response.json())
      .then(resolve)
      .catch(reject);
  });
};
export const fetchRank = async (id: number): Promise<Rank> => {
  const myInit: RequestInit = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  };

  return new Promise((resolve, reject) => {
    fetch(`/api/ranks/${id}`, myInit)
      .then((response) => response.json())
      .then(resolve)
      .catch(reject);
  });
};
