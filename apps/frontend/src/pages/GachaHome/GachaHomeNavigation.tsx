import { CardListElement } from '../../components/CardListElement';
import { filterCards } from '../../utils/filters';
import { useGachaHome } from './GachaHomeContext';
import { GachaHomeFilterView } from './views/GachaHomeFilterView';
import { GachaHomeMobileView } from './views/GachaHomeMobileView';

type Props = {
  mobile: boolean;
};

export const GachaHomeNavigation = ({ mobile }: Props) => {
  const {
    cardSelected,
    filterPanelState,
    toggleFilterPanelState,
    cards,
    filters,
    selectCard,
  } = useGachaHome();
  const filteredCards = filterCards(cards, filters);
  const toggleFilter = () => {
    toggleFilterPanelState();
    if (mobile && !filterPanelState) {
      selectCard(null);
    }
  };

  return (
    <div className={`home-navigation ${mobile ? 'mobile-navigation' : ''}`}>
      <div className="filters-section">
        <h4 onClick={toggleFilter}>
          <i className="fas fa-bars"></i>
          <span>Filtres</span>
        </h4>
        <div className={`filter-${filterPanelState ? 'opened' : 'closed'}`}>
          {filterPanelState ? <GachaHomeFilterView /> : null}
        </div>
      </div>
      <ul>
        {filteredCards.map((card, index) => (
          <li key={index} id={`card_${card.id}`}>
            <CardListElement card={card} />
            {mobile && cardSelected?.id === card.id ? (
              <GachaHomeMobileView />
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
};
