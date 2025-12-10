import { BacklogGame } from '~/lundprod/contexts/me.context';
import { BacklogItemMoveType } from '~/lundprod/server/types';

export const reorderMyBacklog =
  (itemId: number, direction: BacklogItemMoveType) =>
  (data: BacklogGame[] | undefined) => {
    const item = (data || []).find(({ id }) => itemId === id);
    const newList = [...(data || [])].filter(
      ({ status }) => status === item?.status,
    );
    const itemIndex = newList.findIndex(({ id }) => itemId === id);

    if (direction === BacklogItemMoveType.UP) {
      const previousItem = newList[itemIndex - 1];

      newList[itemIndex - 1] = newList[itemIndex];
      newList[itemIndex] = previousItem;
      --newList[itemIndex - 1].order;
      ++newList[itemIndex].order;
    } else {
      const nextItem = newList[itemIndex + 1];

      newList[itemIndex + 1] = newList[itemIndex];
      newList[itemIndex] = nextItem;
      ++newList[itemIndex + 1].order;
      --newList[itemIndex].order;
    }

    return newList;
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
