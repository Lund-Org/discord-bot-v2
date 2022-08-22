import { AllCardsParams, CardType, Inventory } from '@discord-bot-v2/common';

export const fetchAllCards = async ({
  filters = {},
}: AllCardsParams): Promise<CardType[]> => {
  const myInit: RequestInit = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  };

  return new Promise((resolve, reject) => {
    fetch(`/api/cards?filters=${encodeURI(JSON.stringify(filters))}`, myInit)
      .then((response) => response.json())
      .then(resolve)
      .catch(reject);
  });
};
export const fetchCardsToGold = async (id: string): Promise<Inventory[]> => {
  const myInit: RequestInit = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  };

  return new Promise((resolve, reject) => {
    fetch(`/api/cards/to-gold/${id}`, myInit)
      .then((response) => response.json())
      .then(resolve)
      .catch(reject);
  });
};
