import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { BacklogGame } from '~/lundprod/contexts/me.context';
import { BacklogItemMoveType, SortType } from '~/lundprod/server/types';
import { reorderMyBacklog } from '~/lundprod/utils/cache-management/my-backlog';
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
      moveBacklogItem(
        { direction, itemId, status },
        {
          onSuccess: () => {
            queryClient.getMyBacklog.setData(
              {},
              reorderMyBacklog(itemId, direction),
            );
          },
          onError: () => {
            errorToast({
              title: t('myBacklog.error.reorderTitle'),
              description: t('myBacklog.error.reorderDescription'),
            });
          },
        },
      );
    },
    [moveBacklogItem, queryClient.getMyBacklog, errorToast, t],
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
    isSortIsLoading,
    isRemoveBacklogItemLoading,
  };
};
