import { GAME_TYPE, platForms } from '@discord-bot-v2/igdb';
import { BacklogItem } from '@prisma/client';
import { createContext, ReactNode, useContext, useState } from 'react';
import { useFetcher } from '../hooks/useFetcher';
import { mapToCategory, TypeMap } from '../utils/backlog';
import { ArrayElement, IGDBGame } from '../utils/types';

type PlatForm = ArrayElement<typeof platForms>;
export type BacklogItemLight = Pick<
  BacklogItem,
  'igdbGameId' | 'name' | 'category' | 'url'
>;
type IGDBGameLight = Pick<BacklogItem, 'id' | 'name' | 'category' | 'url'>;

//-- Types
type BacklogContextProvider = {
  searchValue: string;
  setSearchValue: (str: string) => void;
  category: GAME_TYPE[];
  setCategory: (val: GAME_TYPE[]) => void;
  platforms: PlatForm[];
  setPlatforms: (platforms: PlatForm[]) => void;
  backlog: BacklogItemLight[];
  addToBacklog: (backlogItem: IGDBGameLight) => void;
  removeFromBacklog: (id: number) => void;
};

type BacklogContextProps = {
  children: ReactNode;
  backlog: BacklogItemLight[];
};

//-- Context declaration

export const BacklogContext = createContext<BacklogContextProvider>({
  searchValue: '',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSearchValue: () => {},
  category: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCategory: () => {},
  platforms: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setPlatforms: () => {},
  backlog: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  addToBacklog: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  removeFromBacklog: () => {},
});

export const useBacklog = (): BacklogContextProvider =>
  useContext(BacklogContext);

//-- Exposed Provider
export const BacklogProvider = ({
  backlog: initialBacklog,
  children,
}: BacklogContextProps) => {
  const [backlog, setBacklog] = useState(initialBacklog);
  const [category, setCategory] = useState(mapToCategory(TypeMap.GAME));
  const [searchValue, setSearchValue] = useState('');
  const [platforms, setPlatforms] = useState<PlatForm[]>([]);
  const fetcher = useFetcher();

  const addToBacklog = (game: IGDBGame) => {
    const newItem: BacklogItemLight = {
      igdbGameId: game.id,
      name: game.name,
      category: game.category,
      url: game.url,
    };

    setBacklog([...backlog, newItem]);
    return fetcher(`/api/backlog/add`, undefined, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newItem),
    }).catch(() => {
      setBacklog((_backlog) => {
        const backlogCopy = [..._backlog];
        backlogCopy.length -= 1;
        return backlogCopy;
      });
    });
  };
  const removeFromBacklog = (id: number) => {
    // This logic is just for the catch if the request fails
    const itemIndex = backlog.findIndex((item) => item.igdbGameId === id);
    const newBacklog = [...backlog];
    const [backupItem] = newBacklog.splice(itemIndex, 1);

    setBacklog(newBacklog);
    return fetcher(`/api/backlog/remove`, undefined, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    }).catch(() => {
      setBacklog((_backlog) => [..._backlog, backupItem]);
    });
  };

  const providerParameters = {
    searchValue,
    setSearchValue,
    category,
    setCategory,
    platforms,
    setPlatforms,
    backlog,
    addToBacklog,
    removeFromBacklog,
  };

  return (
    <BacklogContext.Provider value={providerParameters}>
      {children}
    </BacklogContext.Provider>
  );
};
