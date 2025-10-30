import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormLabel,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
} from '@chakra-ui/react';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useErrorToast, useSuccessToast } from '~/lundprod/hooks/use-toast';
import { trpc } from '~/lundprod/utils/trpc';
import { updateStatusBacklogItemCache } from '~/lundprod/utils/cache-management/my-backlog';
import { BacklogGame } from '~/lundprod/contexts/me.context';
import { getBacklogStatusTranslation } from '~/lundprod/utils/backlog';

type ChangeStateModalProps<T> = {
  backlogItemId: number | null;
  onClose: VoidFunction;
  currentStatus: T;
  values: T[];
};

export const ChangeStateModal = <
  T extends BacklogGame['status'] = BacklogGame['status'],
>({
  backlogItemId,
  onClose,
  currentStatus,
  values,
}: ChangeStateModalProps<T>) => {
  const [status, setStatus] = useState<T>(currentStatus);
  const [notifyOnDiscord, setNotifyOnDiscord] = useState(true);
  const queryClient = trpc.useUtils();
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();

  const { mutateAsync: changeBacklogItemStatus, isPending } =
    trpc.changeBacklogItemStatus.useMutation();

  // reset default status for next opening
  useEffect(() => {
    if (!backlogItemId) {
      setStatus(currentStatus);
      setNotifyOnDiscord(true);
    }
  }, [backlogItemId, currentStatus]);

  const onSubmit = async () => {
    if (!backlogItemId) {
      return;
    }

    if (status === currentStatus) {
      onClose();
    }

    try {
      const { newBacklogItem } = await changeBacklogItemStatus({
        itemId: backlogItemId,
        notifyOnDiscord,
        status,
      });

      queryClient.getMyBacklog.setData(
        {},
        updateStatusBacklogItemCache(newBacklogItem),
      );

      successToast({
        title: t('changeStateModal.successTitle'),
        description: t('changeStateModal.successDescription'),
      });

      onClose();
    } catch (err) {
      errorToast({
        title: t('changeStateModal.errorTitle'),
        description: t('changeStateModal.errorDescription'),
      });
    }
  };
  return (
    <Modal isOpen={!!backlogItemId} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader borderBottom="1px solid" borderColor="gray.200">
          {t('changeStateModal.title')}
        </ModalHeader>
        <ModalBody>
          <Flex pb="12px" flexDir="column" gap={2}>
            <Text>{t('changeStateModal.text')}</Text>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as T)}
            >
              {values.map((_status) => (
                <option key={_status} value={_status}>
                  {getBacklogStatusTranslation(t, _status)}
                </option>
              ))}
            </Select>
            <Checkbox
              isChecked={notifyOnDiscord}
              onChange={() => setNotifyOnDiscord((x) => !x)}
            >
              {t('changeStateModal.notifyOnDiscordLabel')}
            </Checkbox>
          </Flex>
          <Flex justifyContent="center" gap={2} mt={4} pb="16px">
            <Button onClick={onClose} type="button" isDisabled={isPending}>
              {t('changeStateModal.cancel')}
            </Button>
            <Button
              onClick={onSubmit}
              type="button"
              colorScheme="orange"
              isLoading={isPending}
              isDisabled={currentStatus === status}
            >
              {t('changeStateModal.validate')}
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
