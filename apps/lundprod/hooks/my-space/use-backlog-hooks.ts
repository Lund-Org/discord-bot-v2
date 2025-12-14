import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { BacklogGame } from '~/lundprod/contexts/me.context';
import { BacklogItemMoveType, SortType } from '~/lundprod/server/types';
import {
  moveItemInMyBacklog,
  reorderMyBacklog,
} from '~/lundprod/utils/cache-management/my-backlog';
import { trpc } from '~/lundprod/utils/trpc';

import { useErrorToast, useSuccessToast } from '../use-toast';

export const useBacklogHooks = () => {
  const { t } = useTranslation();
  const queryClient = trpc.useUtils();
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();

  const [changeStatusBacklogItemId, setChangeStatusBacklogItemId] = useState<
    number | null
  >(null);
  const [updateNoteBacklogItemId, setUpdateNoteBacklogItemId] = useState<
    number | null
  >(null);
  const [updateReviewBacklogItemId, setUpdateReviewBacklogItemId] = useState<
    number | null
  >(null);
  const [removeBacklogItemId, setRemoveBacklogItemId] = useState<number | null>(
    null,
  );

  const { mutateAsync: sortMyBacklog, isPending: isSortIsLoading } =
    trpc.sortMyBacklog.useMutation();
  const { mutate: moveBacklogItem } = trpc.moveBacklogItem.useMutation();
  const { mutate: moveBacklogItemToPosition } =
    trpc.moveBacklogItemToPosition.useMutation();
  const {
    mutateAsync: removeBacklogItem,
    isPending: isRemoveBacklogItemLoading,
  } = trpc.removeBacklogItem.useMutation();

  const onRemoveBacklogItem = useCallback(async () => {
    if (!removeBacklogItemId) {
      return;
    }

    try {
      await removeBacklogItem({ itemId: removeBacklogItemId });

      queryClient.getMyBacklog.setData({}, (data) =>
        (data || []).filter((item) => item.id !== removeBacklogItemId),
      );
      setRemoveBacklogItemId(null);
      successToast({
        title: t('myBacklog.success.deleteTitle'),
      });
    } catch (err) {
      errorToast({
        title: t('myBacklog.error.deleteTitle'),
        description: t('myBacklog.error.deleteDescription'),
      });
    }
  }, [
    removeBacklogItemId,
    removeBacklogItem,
    queryClient.getMyBacklog,
    successToast,
    t,
    errorToast,
  ]);

  const sortByName = useCallback(
    async (status: BacklogGame['status']) => {
      try {
        await sortMyBacklog({
          status,
          order: SortType.ALPHABETICAL_ORDER,
        });

        queryClient.getMyBacklog.invalidate();
        successToast({
          title: t('myBacklog.success.reorderTitle'),
          description: t('myBacklog.success.reorderDescription'),
        });
      } catch (err) {
        errorToast({
          title: t('myBacklog.error.reorderTitle'),
          description: t('myBacklog.error.reorderDescription'),
        });
      }
    },
    [sortMyBacklog, queryClient.getMyBacklog, successToast, t, errorToast],
  );

  const sortByDate = useCallback(
    async (status: BacklogGame['status']) => {
      try {
        await sortMyBacklog({
          status,
          order: SortType.DATE_ORDER,
        });

        queryClient.getMyBacklog.invalidate();
        successToast({
          title: t('myBacklog.success.reorderTitle'),
          description: t('myBacklog.success.reorderDescription'),
        });
      } catch (err) {
        errorToast({
          title: t('myBacklog.error.reorderTitle'),
          description: t('myBacklog.error.reorderDescription'),
        });
      }
    },
    [sortMyBacklog, queryClient.getMyBacklog, successToast, t, errorToast],
  );

  const onArrowClick = useCallback(
    (
      itemId: number,
      direction: BacklogItemMoveType,
      status: BacklogGame['status'],
    ) => {
      // optimistic update
      queryClient.getMyBacklog.setData({}, reorderMyBacklog(itemId, direction));

      moveBacklogItem(
        { direction, itemId, status },
        {
          onError: () => {
            errorToast({
              title: t('myBacklog.error.reorderTitle'),
              description: t('myBacklog.error.reorderDescription'),
            });

            queryClient.getMyBacklog.setData(
              {},
              reorderMyBacklog(
                itemId,
                direction === BacklogItemMoveType.UP
                  ? BacklogItemMoveType.DOWN
                  : BacklogItemMoveType.UP,
              ),
            );
          },
        },
      );
    },
    [moveBacklogItem, queryClient.getMyBacklog, errorToast, t],
  );

  const moveToPosition = useCallback(
    (itemId: number, newPosition: number) => {
      const currentData = queryClient.getMyBacklog.getData({});

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const currentPosition = (currentData || []).find(
        ({ id }) => id === itemId,
      )!.order!;

      // optimistic update
      queryClient.getMyBacklog.setData(
        {},
        moveItemInMyBacklog(itemId, newPosition),
      );

      moveBacklogItemToPosition(
        { itemId, newPosition },
        {
          onError: () => {
            errorToast({
              title: t('myBacklog.error.reorderTitle'),
              description: t('myBacklog.error.reorderDescription'),
            });

            queryClient.getMyBacklog.setData(
              {},
              moveItemInMyBacklog(itemId, currentPosition),
            );
          },
        },
      );
    },
    [queryClient.getMyBacklog, moveBacklogItemToPosition, errorToast, t],
  );

  return {
    onRemoveBacklogItem,
    sortByName,
    sortByDate,
    onArrowClick,
    changeStatusBacklogItemId,
    setChangeStatusBacklogItemId,
    updateNoteBacklogItemId,
    setUpdateNoteBacklogItemId,
    updateReviewBacklogItemId,
    setUpdateReviewBacklogItemId,
    removeBacklogItemId,
    setRemoveBacklogItemId,
    moveToPosition,
    isSortIsLoading,
    isRemoveBacklogItemLoading,
  };
};
