import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import { AllCards, filterCards } from '../utils/filters';
import { CardWithFusionDependencies, Filters } from '../utils/types';

//-- Types
type GachaHomeContextProvider = {
  filters: Filters;
  updateFilters: (data: Filters) => void;
  filteredCards: CardWithFusionDependencies[];
  cards: CardWithFusionDependencies[];
  cardSelected: CardWithFusionDependencies | null;
  selectCard: (card: CardWithFusionDependencies | null) => void;
  filterPanelState: boolean;
  toggleFilterPanelState: () => void;
};
type GachaHomeContextProps = {
  children: ReactNode;
  cards: CardWithFusionDependencies[];
};

//-- Context declaration

export const GachaHomeContext = createContext<GachaHomeContextProvider>({
  filters: {
    gold: false,
    fusion: false,
    filterStars: 'all',
    search: '',
  },
  updateFilters: () => null,
  filteredCards: [],
  cards: [],
  cardSelected: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  selectCard: () => {},
  filterPanelState: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toggleFilterPanelState: () => {},
});

export const useGachaHome = (): GachaHomeContextProvider =>
  useContext(GachaHomeContext);

//-- Exposed Provider
export const GachaHomeProvider = ({
  children,
  cards,
}: GachaHomeContextProps) => {
  const [state, updateState] = useState({
    gold: false,
    fusion: false,
    filterStars: AllCards,
    search: '',
  });
  const [filteredCards, setFilteredCards] = useState(cards);
  const [cardSelected, updateCardSelected] =
    useState<CardWithFusionDependencies | null>(null);
  const [filterPanelState, updateFilterPanelState] = useState(false);

  useEffect(() => {
    setFilteredCards(filterCards<CardWithFusionDependencies>(cards, state));
  }, [state, cards]);

  const providerParameters = {
    filters: state,
    updateFilters: updateState,
    cards,
    filteredCards,
    cardSelected,
    selectCard: (card: CardWithFusionDependencies | null) => {
      updateCardSelected(card);
    },
    filterPanelState,
    toggleFilterPanelState: () => {
      updateFilterPanelState(!filterPanelState);
    },
  };

  return (
    <GachaHomeContext.Provider value={providerParameters}>
      {children}
    </GachaHomeContext.Provider>
  );
};
