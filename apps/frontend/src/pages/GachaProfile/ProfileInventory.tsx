import { CardType, Inventory } from '@discord-bot-v2/common';
import { CardListElement } from '../../components/CardListElement';
import { isCardType } from '../../utils/filters';

type ProfileInventoryProps<T = Inventory> = {
  cards: T[];
  textFormatter: (card: T) => string;
  className?: string;
};

export const ProfileInventory = <T extends Inventory | CardType>({
  cards,
  textFormatter,
  className = '',
}: ProfileInventoryProps<T>) => {
  return (
    <ul className={`inventory ${className}`}>
      {cards.map((card, index) => (
        <li key={index}>
          <CardListElement card={isCardType(card) ? card : card.cardType} />
          <span>{textFormatter(card)}</span>
        </li>
      ))}
    </ul>
  );
};
