import { CardType, Filters, Inventory } from '@discord-bot-v2/common';

export const AllCards = 'all';

export const options = [AllCards, '*', '**', '***', '****'];

export const filterCards = <T extends CardType | Inventory>(
  cards: T[],
  filters: Filters
) => {
  return cards
    .filter((card) => (filters.fusion ? isFusion(card) : true))
    .filter((card) =>
      filters.search ? searchName(card, filters.search) : true
    )
    .filter((card) =>
      filters.filterStars !== AllCards
        ? filterLevel(card, filters.filterStars)
        : true
    );
};

function isFusion(value: CardType | Inventory) {
  if (isCardType(value)) {
    return value.isFusion;
  }

  return value.cardType.isFusion;
}

function searchName(value: CardType | Inventory, search: string) {
  if (isCardType(value)) {
    return value.name.includes(search);
  }

  return value.cardType.name.includes(search);
}

function filterLevel(value: CardType | Inventory, filterLevel: string) {
  if (isCardType(value)) {
    return value.level === filterLevel.length;
  }

  return value.cardType.level === filterLevel.length;
}

export function isCardType(value: CardType | Inventory): value is CardType {
  return 'id' in value && 'isFusion' in value;
}
