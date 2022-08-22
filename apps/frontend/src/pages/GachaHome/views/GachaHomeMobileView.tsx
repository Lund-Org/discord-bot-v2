import Card from '../../../components/Card';
import FusionDetails from '../../../components/FusionDetails';
import { useGachaHome } from '../GachaHomeContext';

export const GachaHomeMobileView = () => {
  const { cardSelected, filters } = useGachaHome();

  if (!cardSelected) {
    return null;
  }

  return (
    <div className="gacha-home-mobile-view">
      <div className="gacha-home-mobile-view-card-block">
        <Card
          imageUrl={cardSelected.imageName}
          type={filters.gold ? 'gold' : 'basic'}
        />
      </div>
      <p className="center card-lore">{cardSelected.lore}</p>
      {cardSelected.isFusion ? <FusionDetails card={cardSelected} /> : null}
    </div>
  );
};
