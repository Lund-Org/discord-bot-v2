/* eslint-disable @typescript-eslint/no-empty-function */
import { ArrayElement } from '@discord-bot-v2/common';
import { Game,GAME_TYPE, platForms } from '@discord-bot-v2/igdb-front';
import { BacklogItem, BacklogStatus } from '@prisma/client';
import { chain, clone, curry } from 'lodash';
import {
  createContext,
  MutableRefObject,
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';

import { useFetcher } from '../hooks/useFetcher';
import { mapToCategory, TypeMap } from '../utils/backlog';

type PlatForm = ArrayElement<typeof platForms>;
export type BacklogItemLight = Pick<
  BacklogItem,
  | 'igdbGameId'
  | 'name'
  // | 'category'
  | 'url'
  | 'status'
  | 'reason'
  | 'rating'
  | 'order'
> & {
  category: GAME_TYPE | string;
};
type IGDBGameLight = Pick<
  BacklogItem,
  'id' | 'name' | /*'category' |*/ 'url'
> & {
  category: GAME_TYPE | string;
};
type BacklogReorder = { oldOrder: number; newOrder: number; igdbId: number };

//-- Types
type BacklogContextProvider = {
  searchValue: MutableRefObject<string>;
  category: GAME_TYPE[];
  setCategory: (val: GAME_TYPE[]) => void;
  platforms: PlatForm[];
  setPlatforms: (platforms: PlatForm[]) => void;
  backlog: BacklogItemLight[];
  addToBacklog: (backlogItem: IGDBGameLight) => void;
  removeFromBacklog: (id: number) => void;
  updateBacklogStatus: (id: number, status: BacklogStatus) => void;
  updateBacklogDetails: (
    id: number,
    reason: string,
    rating: number
  ) => Promise<void>;
  onReorder: (orderPayload: BacklogReorder) => void;
};

type BacklogContextProps = {
  children: ReactNode;
  backlog: BacklogItemLight[];
};

//-- Context declaration

export const BacklogContext = createContext<BacklogContextProvider>({
  searchValue: { current: '' },
  category: [],
  setCategory: () => {},
  platforms: [],
  setPlatforms: () => {},
  backlog: [],
  addToBacklog: () => {},
  removeFromBacklog: () => {},
  updateBacklogStatus: () => {},
  updateBacklogDetails: async () => {},
  onReorder: () => {},
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
  const searchValue = useRef('');
  const [platforms, setPlatforms] = useState<PlatForm[]>([]);
  const fetcher = useFetcher();

  const addToBacklog = useCallback(
    (game: Game) => {
      const newItem: BacklogItemLight = {
        igdbGameId: game.id,
        name: game.name,
        category: game.category,
        url: game.url,
        status: BacklogStatus.BACKLOG,
        reason: '',
        rating: 0,
        order: backlog.length,
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
    },
    [setBacklog, backlog, fetcher]
  );
  const removeFromBacklog = useCallback(
    (id: number) => {
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
    },
    [setBacklog, backlog, fetcher]
  );
  const onReorder = useCallback(
    (payload: { oldOrder: number; newOrder: number; igdbId: number }) => {
      const backupBacklog = backlog;

      setBacklog(
        chain(backlog)
          .map((backlogItem) => {
            if (backlogItem.igdbGameId === payload.igdbId) {
              return { ...backlogItem, order: payload.newOrder };
            }

            if (
              payload.oldOrder < payload.newOrder &&
              backlogItem.order >= payload.oldOrder &&
              backlogItem.order <= payload.newOrder
            ) {
              return { ...backlogItem, order: backlogItem.order - 1 };
            } else if (
              payload.oldOrder > payload.newOrder &&
              backlogItem.order <= payload.oldOrder &&
              backlogItem.order >= payload.newOrder
            ) {
              return { ...backlogItem, order: backlogItem.order + 1 };
            }

            return backlogItem;
          })
          .sortBy(['order'])
          .value()
      );

      return fetcher(`/api/backlog/reorder`, undefined, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }).catch(() => {
        setBacklog(backupBacklog);
      });
    },
    [setBacklog, backlog, fetcher]
  );

  const providerParameters = {
    searchValue,
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
    updateBacklogDetails: curry(updateBacklogDetails)({
      backlog,
      setBacklog,
      fetcher,
    }),
    onReorder,
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
function updateBacklogDetails(
  curriedParam: UpdateBacklogCurriedParam,
  id: number,
  reason: string,
  rating: number
) {
  return findItemChangePropertyAndRequestAPI(
    curriedParam,
    id,
    [reason, rating],
    ['reason', 'rating'],
    '/api/backlog/update-backlog-details'
  );
}

function findItemChangePropertyAndRequestAPI<T>(
  { backlog, setBacklog, fetcher }: UpdateBacklogCurriedParam,
  id: number,
  param: T | T[],
  name: string | string[],
  url: string
) {
  const newBacklog = clone(backlog);
  const itemToUpdate = newBacklog.find(({ igdbGameId }) => igdbGameId === id);
  let oldValue;
  let payload;

  if (typeof name === 'string') {
    oldValue = itemToUpdate[name];
    itemToUpdate[name] = param;
    payload = JSON.stringify({ igdbGameId: id, [name]: param });
  } else {
    oldValue = name.map((n, index) => {
      itemToUpdate[n] = param[index];
      return itemToUpdate[n];
    });
    payload = JSON.stringify(
      name.reduce(
        (acc, n, index) => {
          return {
            ...acc,
            [n]: param[index],
          };
        },
        { igdbGameId: id }
      )
    );
  }

  setBacklog(newBacklog);
  return fetcher(url, undefined, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: payload,
  }).catch(() => {
    if (typeof name === 'string') {
      itemToUpdate[name] = oldValue;
    } else {
      name.forEach((n, index) => {
        itemToUpdate[n] = oldValue[index];
      });
    }

    setBacklog(newBacklog);
  });
}
