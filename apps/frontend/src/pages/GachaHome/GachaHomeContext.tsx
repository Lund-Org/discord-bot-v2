import { CardType, Filters } from '@discord-bot-v2/common';
import React, { useContext, useEffect, useState } from 'react';
import { fetchAllCards } from '../../API/cardsAPI';
import { AllCards } from '../../utils/filters';

//-- Types
type GachaHomeContextProvider = {
  filters: Filters;
  updateFilters: React.Dispatch<React.SetStateAction<Filters>>;
  cards: CardType[];
  cardSelected: CardType | null;
  selectCard: (card: CardType | null) => void;
  filterPanelState: boolean;
  toggleFilterPanelState: () => void;
};
type GachaHomeContextProps = {
  children: JSX.Element | JSX.Element[] | null;
};

//-- Context declaration

export const GachaHomeContext = React.createContext<GachaHomeContextProvider>({
  filters: {
    gold: false,
    fusion: false,
    filterStars: 'all',
    search: '',
  },
  updateFilters: () => null,
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
}: GachaHomeContextProps): JSX.Element => {
  const [state, updateState] = useState({
    gold: false,
    fusion: false,
    filterStars: AllCards,
    search: '',
  });
  const [cards, updateCards] = useState([] as CardType[]);
  const [cardSelected, updateCardSelected] = useState<CardType | null>(
    null,
  );
  const [filterPanelState, updateFilterPanelState] = useState(false);

  useEffect(() => {
    fetchAllCards({
      filters: {
        ...(state.filterStars === AllCards
          ? {}
          : { level: state.filterStars.length }),
        search: state.search,
        fusion: state.fusion,
      },
    }).then((cards: CardType[]) => {
      updateCards(cards);
    });
  }, [state.filterStars, state.search, state.fusion]);

  const providerParameters = {
    filters: state,
    updateFilters: updateState,
    cards,
    cardSelected,
    selectCard: (card: CardType | null) => {
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
