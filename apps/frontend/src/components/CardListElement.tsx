import { CardType } from '@discord-bot-v2/common';
import { useGachaHome } from '../pages/GachaHome/GachaHomeContext';

type CardListElementProps = {
  card: CardType;
};

export const CardListElement = ({ card }: CardListElementProps) => {
  const { selectCard } = useGachaHome();

  const selectCardAction = () => {
    selectCard(card);

    if (window.innerWidth <= 600) {
      document.getElementById(`card_${card.id}`)?.scrollIntoView();
    }
  };

  return (
    <div className="card-list-item" onClick={() => selectCardAction()}>
      <span className="fusion-icon">
        {card.isFusion ? <i className="fas fa-atom"></i> : null}
      </span>
      <span className="level-icon">
        {Array.from(Array(card.level)).map((item, index) => (
          <i className="fas fa-star fa-xs" key={index}></i>
        ))}
      </span>
      <span className="card-name">
        #{card.id} - {card.name}
      </span>
    </div>
  );
};
