/* eslint-disable @typescript-eslint/no-empty-function */
import { LightGame, PlatFormType, REGION } from '@discord-bot-v2/igdb-front';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';

import { ExpectedGamesModal } from '../components/my-space/expected-games/expecte-games-modal';
import { useFetcher } from '../hooks/useFetcher';
import { ExpectedGame } from '../utils/api/expected-games';
import { mapToCategory, TypeMap } from '../utils/backlog';
import { ContextWithGameSearch } from '../utils/types';

//-- Types
type ModalDataType = {
  type: 'creation' | 'update';
  initialAddToBacklog?: boolean;
  platformId: number;
  game: LightGame;
  region: REGION;
} | null;

type ExpectedGameContextProvider = ContextWithGameSearch & {
  expectedGames: ExpectedGame[];
  addToExpectedList: (
    expectedGame: LightGame,
    addToBacklog: boolean,
    platformId: number,
    region: REGION
  ) => void;
  updateExpectedList: (igdbGameId: number, addToBacklog: boolean) => void;
  removeFromExpectedList: (id: number) => void;
  modalData: ModalDataType;
  setModalData: (data: ModalDataType) => void;
};

type ExpectedGameContextProps = {
  children: ReactNode;
  expectedGames: ExpectedGame[];
};

//-- Context declaration

export const ExpectedGameContext = createContext<ExpectedGameContextProvider>({
  searchValue: { current: '' },
  category: [],
  setCategory: () => {},
  platforms: [],
  setPlatforms: () => {},
  expectedGames: [],
  addToExpectedList: () => {},
  updateExpectedList: () => {},
  removeFromExpectedList: () => {},
  modalData: null,
  setModalData: () => {},
});

export const useExpectedGame = (): ExpectedGameContextProvider =>
  useContext(ExpectedGameContext);

//-- Exposed Provider
export const ExpectedGameProvider = ({
  expectedGames: initialExpectedGames,
  children,
}: ExpectedGameContextProps) => {
  const [expectedGames, setExpectedGames] = useState(initialExpectedGames);
  const [modalData, setModalData] = useState<ModalDataType>(null);
  const [category, setCategory] = useState(mapToCategory(TypeMap.GAME));
  const [platforms, setPlatforms] = useState<PlatFormType[]>([]);
  const searchValue = useRef('');
  const { get, post } = useFetcher();

  const addToExpectedList = useCallback(
    async (
      expectedGame: LightGame,
      addToBacklog: boolean,
      platformId: number,
      region: REGION
    ) => {
      await post(
        '/api/expected-games/add',
        undefined,
        JSON.stringify({
          igdbGameId: expectedGame.id,
          platformId,
          addToBacklog,
          region,
        })
      );
      const { expectedGames: newList } = await get('/api/expected-games/list');
      setExpectedGames(newList);
    },
    [get, post]
  );
  const updateExpectedList = useCallback(
    async (igdbGameId: number, addToBacklog: boolean) => {
      await post(
        '/api/expected-games/update',
        undefined,
        JSON.stringify({
          igdbGameId,
          data: {
            addToBacklog,
          },
        })
      );
      const { expectedGames: newList } = await get('/api/expected-games/list');
      setExpectedGames(newList);
    },
    [get, post]
  );
  const removeFromExpectedList = useCallback(
    async (id: number) => {
      await post(
        '/api/expected-games/remove',
        undefined,
        JSON.stringify({
          igdbGameId: id,
        })
      );

      const { expectedGames: newList } = await get('/api/expected-games/list');
      setExpectedGames(newList);
    },
    [get, post]
  );

  const providerParameters = {
    searchValue,
    category,
    setCategory,
    platforms,
    setPlatforms,
    expectedGames,
    addToExpectedList,
    updateExpectedList,
    removeFromExpectedList,
    modalData,
    setModalData,
  };

  return (
    <ExpectedGameContext.Provider value={providerParameters}>
      {children}
      {modalData && <ExpectedGamesModal onClose={() => setModalData(null)} />}
    </ExpectedGameContext.Provider>
  );
};
