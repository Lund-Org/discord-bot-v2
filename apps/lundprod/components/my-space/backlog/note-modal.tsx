import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useMe } from '~/lundprod/contexts/me.context';
import { useErrorToast, useSuccessToast } from '~/lundprod/hooks/use-toast';
import { MAX_NOTE_SIZE } from '~/lundprod/server/types';
import { updateBacklogItemCache } from '~/lundprod/utils/cache-management/my-backlog';
import { trpc } from '~/lundprod/utils/trpc';

import { CharactersLeft } from '../../characters-left';

type NoteFormValues = {
  note: string;
};

type NoteModalProps = {
  onClose: VoidFunction;
  backlogItemId: number | null;
};

export const NoteModal = ({ onClose, backlogItemId }: NoteModalProps) => {
  const { t } = useTranslation();
  const { backlog } = useMe();
  const queryClient = trpc.useUtils();
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();

  const note = backlog.find(({ id }) => id === backlogItemId)?.note;

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    watch,
  } = useForm<NoteFormValues>({
    defaultValues: {
      note: note || '',
    },
    mode: 'onSubmit',
  });

  const { mutateAsync: updateNote, isPending } =
    trpc.updateBacklogItemNote.useMutation();

  useEffect(() => {
    if (backlogItemId) {
      setValue('note', note || '');
    }
  }, [backlogItemId, note, setValue]);

  const onSubmit = async (data: NoteFormValues) => {
    if (!backlogItemId) {
      return;
    }

    try {
      const { newBacklogItem } = await updateNote({
        itemId: backlogItemId,
        note: data.note,
      });

      queryClient.getMyBacklog.setData(
        {},
        updateBacklogItemCache(newBacklogItem),
      );

      successToast({
        title: t('noteModal.successTitle'),
        description: t('noteModal.successDescription'),
      });

      onClose();
    } catch (err) {
      errorToast({
        title: t('noteModal.errorTitle'),
        description: t('noteModal.errorDescription'),
      });
    }
  };

  const formNote = watch('note');

  return (
    <Modal isOpen={!!backlogItemId} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader borderBottom="1px solid" borderColor="gray.200">
          {t('noteModal.title')}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box as="form" pb="20px" onSubmit={handleSubmit(onSubmit)}>
            <Text mb={4}>{t('noteModal.description')}</Text>
            <FormControl isInvalid={!!errors.note}>
              <Textarea
                {...register('note', {
                  validate: (_note) =>
                    _note.length <= MAX_NOTE_SIZE
                      ? true
                      : t('noteModal.maxLength'),
                })}
                placeholder={t('noteModal.placeholder')}
                minH="200px"
                resize="vertical"
              />
              <CharactersLeft str={formNote} lengthMax={MAX_NOTE_SIZE} />
              <FormErrorMessage>
                {errors.note && errors.note.message}
              </FormErrorMessage>
            </FormControl>
            <Flex justifyContent="center" gap={2} mt={4} pb="16px">
              <Button onClick={onClose} type="button" isDisabled={isPending}>
                {t('noteModal.cancel')}
              </Button>
              <Button type="submit" colorScheme="orange" isLoading={isPending}>
                {t('noteModal.submit')}
              </Button>
            </Flex>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
