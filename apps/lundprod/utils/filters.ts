import { CardType } from '@prisma/client';

import { Filters } from './types';

export const AllCards = 'all';

export const options = [AllCards, '*', '**', '***', '****'];

export const filterCards = <T extends CardType>(
  cards: T[],
  filters: Filters
) => {
  return cards.filter(
    (card) =>
      card.name.toLowerCase().includes(filters.search.toLowerCase()) &&
      (filters.fusion === false || !!card.isFusion === filters.fusion) &&
      (filters.filterStars === AllCards ||
        card.level === filters.filterStars.length)
  );
};
