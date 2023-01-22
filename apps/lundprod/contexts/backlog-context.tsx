/* eslint-disable @typescript-eslint/no-empty-function */
import { GAME_TYPE, platForms } from '@discord-bot-v2/igdb';
import { BacklogItem, BacklogStatus } from '@prisma/client';
import { clone, curry } from 'lodash';
import { createContext, ReactNode, useContext, useState } from 'react';
import { useFetcher } from '../hooks/useFetcher';
import { mapToCategory, TypeMap } from '../utils/backlog';
import { ArrayElement, IGDBGame } from '../utils/types';

type PlatForm = ArrayElement<typeof platForms>;
export type BacklogItemLight = Pick<
  BacklogItem,
  'igdbGameId' | 'name' | 'category' | 'url' | 'status' | 'reason'
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
  updateBacklogStatus: (id: number, status: BacklogStatus) => void;
  updateAbandonedReason: (id: number, reason: string) => Promise<void>;
  onSortByStatus: (status: BacklogStatus) => void;
};

type BacklogContextProps = {
  children: ReactNode;
  backlog: BacklogItemLight[];
};

//-- Context declaration

export const BacklogContext = createContext<BacklogContextProvider>({
  searchValue: '',
  setSearchValue: () => {},
  category: [],
  setCategory: () => {},
  platforms: [],
  setPlatforms: () => {},
  backlog: [],
  addToBacklog: () => {},
  removeFromBacklog: () => {},
  updateBacklogStatus: () => {},
  updateAbandonedReason: async () => {},
  onSortByStatus: () => {},
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
      status: BacklogStatus.BACKLOG,
      reason: '',
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
  const onSortByStatus = (sortStatus: BacklogStatus) => {
    setBacklog(
      clone(backlog).sort((a, b) => {
        if (a.status !== b.status) {
          return a.status === sortStatus ? -1 : 1;
        }
        return 0;
      })
    );
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
    updateBacklogStatus: curry(updateBacklogStatus)({
      backlog,
      setBacklog,
      fetcher,
    }),
    updateAbandonedReason: curry(updateAbandonedReason)({
      backlog,
      setBacklog,
      fetcher,
    }),
    onSortByStatus,
  };

  return (
    <BacklogContext.Provider value={providerParameters}>
      {children}
    </BacklogContext.Provider>
  );
};

//-----------

type UpdateBacklogCurriedParam = {
  backlog: BacklogItemLight[];
  setBacklog: (newBacklog: BacklogItemLight[]) => void;
  fetcher: ReturnType<typeof useFetcher>;
};

function updateBacklogStatus(
  curriedParam: UpdateBacklogCurriedParam,
  id: number,
  status: BacklogStatus
) {
  return findItemChangePropertyAndRequestAPI(
    curriedParam,
    id,
    status,
    'status',
    '/api/backlog/change-status'
  );
}
function updateAbandonedReason(
  curriedParam: UpdateBacklogCurriedParam,
  id: number,
  reason: string
) {
  return findItemChangePropertyAndRequestAPI(
    curriedParam,
    id,
    reason,
    'reason',
    '/api/backlog/update-abandoned-reason'
  );
}

function findItemChangePropertyAndRequestAPI<T>(
  { backlog, setBacklog, fetcher }: UpdateBacklogCurriedParam,
  id: number,
  param: T,
  name: string,
  url: string
) {
  const newBacklog = clone(backlog);
  const itemToUpdate = newBacklog.find(({ igdbGameId }) => igdbGameId === id);
  const oldValue = itemToUpdate[name];

  itemToUpdate[name] = param;

  setBacklog(newBacklog);
  return fetcher(url, undefined, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ igdbGameId: id, [name]: param }),
  }).catch(() => {
    itemToUpdate[name] = oldValue;
    setBacklog(newBacklog);
  });
}
