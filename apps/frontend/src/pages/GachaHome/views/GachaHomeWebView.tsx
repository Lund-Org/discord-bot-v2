import Card from '../../../components/Card';
import FusionDetails from '../../../components/FusionDetails';
import { useGachaHome } from '../GachaHomeContext';
import { GachaHomeEmptyView } from './GachaHomeEmptyView';

export const GachaHomeWebView = () => {
  const { cardSelected, filters, updateFilters } = useGachaHome();

  if (!cardSelected) {
    return <GachaHomeEmptyView />;
  }

  return (
    <div className="gacha-home-web-view">
      <div className="gacha-home-web-view-card-block">
        <Card
          imageUrl={cardSelected.imageName}
          type={filters.gold ? 'gold' : 'basic'}
        />
      </div>
      <div className="flex-centered pad-y-10">
        <label className="switch">
          <input
            type="checkbox"
            onChange={() => updateFilters({ ...filters, gold: !filters.gold })}
            checked={filters.gold}
          />
          <span className="slider round"></span>
        </label>
        <span>Visualiser en or</span>
      </div>
      <p className="center card-lore">{cardSelected.lore}</p>
      {cardSelected.isFusion ? <FusionDetails card={cardSelected} /> : null}
    </div>
  );
};
