/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Game,
  GAME_TYPE,
  gameTypeMapping,
  PlatFormType,
} from '@discord-bot-v2/igdb-front';
import { BacklogItem, BacklogItemReview, BacklogStatus } from '@prisma/client';
import { chain, clone, curry } from 'lodash';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';

import { useFetcher } from '../hooks/useFetcher';
import {
  BacklogItemFields,
  BacklogItemReviewFields,
} from '../utils/api/backlog';
import { mapToCategory, TypeMap } from '../utils/backlog';
import { ContextWithGameSearch } from '../utils/types';

export type BacklogItemLight = Pick<
  BacklogItem,
  Exclude<BacklogItemFields, 'game_type'>
> &
  Pick<BacklogItemReview, Exclude<BacklogItemReviewFields, 'pros' | 'cons'>> & {
    game_type: GAME_TYPE | string;
    pros: string[];
    cons: string[];
  };
type IGDBGameLight = Pick<BacklogItem, 'id' | 'name' | 'url'> & {
  game_type: GAME_TYPE | string;
};
type BacklogReorder = { oldOrder: number; newOrder: number; igdbId: number };

type UpdateData = {
  review: string;
  rating: number;
  duration?: number;
  completion?: number;
  completionComment?: string;
  pros: string[];
  cons: string[];
  shouldNotify: boolean;
};

//-- Types
type BacklogContextProvider = ContextWithGameSearch & {
  backlog: BacklogItemLight[];
  addToBacklog: (backlogItem: IGDBGameLight) => void;
  removeFromBacklog: (id: number) => void;
  updateBacklogStatus: (id: number, status: BacklogStatus) => void;
  updateBacklogDetails: (id: number, data: UpdateData) => Promise<void>;
  updateBacklogNote: (id: number, note: string) => Promise<void>;
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
  updateBacklogNote: async () => {},
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
  const [platforms, setPlatforms] = useState<PlatFormType[]>([]);
  const { post } = useFetcher();

  const addToBacklog = useCallback(
    (game: Game) => {
      const newItem: BacklogItemLight = {
        igdbGameId: game.id,
        name: game.name,
        game_type: gameTypeMapping[game.game_type] || '',
        url: game.url,
        status: BacklogStatus.BACKLOG,
        note: null,
        review: '',
        completion: null,
        completionComment: '',
        duration: null,
        pros: [],
        cons: [],
        rating: 0,
        order: backlog.length,
      };

      setBacklog([...backlog, newItem]);
      return post(
        `/api/backlog/add`,
        undefined,
        JSON.stringify({
          igdbGameId: newItem.igdbGameId,
          name: newItem.name,
          game_type: newItem.game_type,
          url: newItem.url,
        }),
      ).catch(() => {
        setBacklog((_backlog) => {
          const backlogCopy = [..._backlog];
          backlogCopy.length -= 1;
          return backlogCopy;
        });
      });
    },
    [setBacklog, backlog, post],
  );
  const removeFromBacklog = useCallback(
    (id: number) => {
      // This logic is just for the catch if the request fails
      const itemIndex = backlog.findIndex((item) => item.igdbGameId === id);
      const newBacklog = [...backlog];
      const [backupItem] = newBacklog.splice(itemIndex, 1);

      setBacklog(newBacklog);
      return post(
        `/api/backlog/remove`,
        undefined,
        JSON.stringify({ id }),
      ).catch(() => {
        setBacklog((_backlog) => [..._backlog, backupItem]);
      });
    },
    [setBacklog, backlog, post],
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
          .value(),
      );

      return post(
        `/api/backlog/reorder`,
        undefined,
        JSON.stringify(payload),
      ).catch(() => {
        setBacklog(backupBacklog);
      });
    },
    [setBacklog, backlog, post],
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
      post,
    }),
    updateBacklogDetails: curry(updateBacklogDetails)({
      backlog,
      setBacklog,
      post,
    }),
    updateBacklogNote: curry(updateBacklogNote)({
      backlog,
      setBacklog,
      post,
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
  post: ReturnType<typeof useFetcher>['post'];
};

function updateBacklogStatus(
  curriedParam: UpdateBacklogCurriedParam,
  id: number,
  status: BacklogStatus,
) {
  return findItemChangePropertyAndRequestAPI(
    curriedParam,
    id,
    status,
    'status',
    '/api/backlog/change-status',
  );
}
function updateBacklogDetails(
  curriedParam: UpdateBacklogCurriedParam,
  id: number,
  data: UpdateData,
) {
  return findItemChangePropertyAndRequestAPI(
    curriedParam,
    id,
    [
      data.review,
      data.rating,
      data.duration,
      data.completion,
      data.completionComment,
      data.pros,
      data.cons,
      data.shouldNotify,
    ],
    [
      'review',
      'rating',
      'duration',
      'completion',
      'completionComment',
      'pros',
      'cons',
      'shouldNotify',
    ],
    '/api/backlog/update-backlog-details',
  );
}
function updateBacklogNote(
  curriedParam: UpdateBacklogCurriedParam,
  id: number,
  note: string,
) {
  return findItemChangePropertyAndRequestAPI(
    curriedParam,
    id,
    [note],
    ['note'],
    '/api/backlog/update-backlog-note',
  );
}

function findItemChangePropertyAndRequestAPI<T>(
  { backlog, setBacklog, post }: UpdateBacklogCurriedParam,
  id: number,
  param: T | T[],
  name: string | string[],
  url: string,
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
        { igdbGameId: id },
      ),
    );
  }

  setBacklog(newBacklog);
  return post(url, undefined, payload).catch((err) => {
    if (typeof name === 'string') {
      itemToUpdate[name] = oldValue;
    } else {
      name.forEach((n, index) => {
        itemToUpdate[n] = oldValue[index];
      });
    }

    setBacklog(newBacklog);
    throw err;
  });
}
