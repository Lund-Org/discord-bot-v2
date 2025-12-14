import { sortBy } from 'lodash';

import { BacklogGame } from '~/lundprod/contexts/me.context';
import { BacklogItemMoveType } from '~/lundprod/server/types';

export const reorderMyBacklog =
  (itemId: number, direction: BacklogItemMoveType) =>
  (data: BacklogGame[] | undefined) => {
    const item = (data || []).find(({ id }) => itemId === id);
    const tmpList = [...(data || [])].filter(
      ({ status }) => status === item?.status,
    );
    const itemIndex = tmpList.findIndex(({ id }) => itemId === id);

    if (direction === BacklogItemMoveType.UP) {
      const previousItem = tmpList[itemIndex - 1];

      ++previousItem.order;
      --tmpList[itemIndex].order;
    } else {
      const nextItem = tmpList[itemIndex + 1];

      --nextItem.order;
      ++tmpList[itemIndex].order;
    }

    return sortBy(data || [], ['status', 'order']);
  };

export const moveItemInMyBacklog =
  (itemId: number, newPosition: number) =>
  (data: BacklogGame[] | undefined) => {
    const item = (data || []).find(({ id }) => itemId === id);

    if (!item) {
      return data;
    }

    const dirIncrement = item.order < newPosition ? -1 : 1;
    const statusList = [...(data || [])].filter(
      ({ status }) => status === item.status,
    );
    const maxNewPosition = Math.min(statusList.length, newPosition);
    const toReorderList = statusList.filter(({ order }) =>
      item.order < newPosition
        ? order >= item.order && order <= maxNewPosition
        : order <= item.order && order >= newPosition,
    );

    toReorderList.forEach((backlogItem) => {
      backlogItem.order += dirIncrement;
    });
    item.order = maxNewPosition;

    return sortBy(data || [], ['status', 'order']);
  };

export const updateBacklogItemCache =
  (newItemValue: BacklogGame) => (data: BacklogGame[] | undefined) => {
    const itemIndex = (data || []).findIndex(
      ({ id }) => newItemValue.id === id,
    );
    const newList = [...(data || [])];

    newList[itemIndex] = newItemValue;

    return newList;
  };

export const updateStatusBacklogItemCache =
  (newItemValue: BacklogGame) => (data: BacklogGame[] | undefined) => {
    const itemIndex = (data || []).findIndex(
      ({ id }) => newItemValue.id === id,
    );

    const currentStatus = (data || [])[itemIndex].status;
    const currentOrder = (data || [])[itemIndex].order;

    const newList = [...(data || [])];

    newList[itemIndex] = newItemValue;

    newList.forEach((item) => {
      if (item.status === currentStatus && item.order >= currentOrder) {
        --item.order;
      }
    });

    return newList;
  };
