import { CardType } from '@discord-bot-v2/common';
import { useGachaHome } from '../pages/GachaHome/GachaHomeContext';
import { CardListElement } from './CardListElement';

const FusionDetails = ({ card }: { card: CardType }) => {
  const { selectCard } = useGachaHome();
  const clickOnCard = (card: CardType) => {
    selectCard(card);
  };

  return (
    <div className="fusion-dependencies">
      <h5>Composants pour la fusion :</h5>
      <ul className="fusion-details">
        {card.fusionDependencies.map((fusionDependency, index) => (
          <li key={index} onClick={() => clickOnCard(fusionDependency)}>
            <CardListElement card={fusionDependency} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FusionDetails;
