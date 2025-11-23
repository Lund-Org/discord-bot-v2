import {
  Button,
  Checkbox,
  Divider,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { t } from 'i18next';
import { omit } from 'lodash';
import { useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { useMe } from '~/lundprod/contexts/me.context';
import { useErrorToast, useSuccessToast } from '~/lundprod/hooks/use-toast';
import { updateBacklogItemCache } from '~/lundprod/utils/cache-management/my-backlog';
import { trpc } from '~/lundprod/utils/trpc';

import { ProsConsSection } from './pros-cons-section';
import { ProgressSection } from './progress-section';
import { ReviewSection } from './review-section';
import { ReviewModalForm } from './types';

type ReviewModalProps = {
  backlogItemId: number | null;
  onClose: VoidFunction;
};

export const ReviewModal = ({ backlogItemId, onClose }: ReviewModalProps) => {
  const { backlog } = useMe();
  const queryClient = trpc.useUtils();
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();

  const item = useMemo(
    () => backlog.find(({ id }) => id === backlogItemId),
    [backlog, backlogItemId],
  );
  const defaultValues = useMemo(
    () => ({
      rating: item?.backlogItemReview?.rating || 0,
      review: item?.backlogItemReview?.review || '',
      duration: item?.backlogItemReview?.duration || 0,
      completion: item?.backlogItemReview?.completion || 0,
      completionComment:
        item?.backlogItemReview?.completionComment || undefined,
      pros: item?.backlogItemReview?.pros || [{ value: '' }],
      cons: item?.backlogItemReview?.cons || [{ value: '' }],
      shouldNotify: true,
    }),
    [item],
  );

  const form = useForm<ReviewModalForm>({
    defaultValues,
  });
  const shouldNotify = form.watch('shouldNotify');

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues]);

  const { mutateAsync: upsertReview, isPending } =
    trpc.upsertReview.useMutation();

  const onSubmit = async (data: ReviewModalForm) => {
    try {
      const { newBacklogItem } = await upsertReview({
        ...omit(data, ['pros', 'cons', 'duration', 'completion']),
        itemId: backlogItemId!,
        // For some reason, these value are strings where it should be numbers
        duration: parseInt(data.duration.toString(), 10),
        completion: parseInt(data.completion.toString(), 10),
        cons: data.cons.map(({ value }) => value),
        pros: data.pros.map(({ value }) => value),
      });

      queryClient.getMyBacklog.setData(
        {},
        updateBacklogItemCache(newBacklogItem),
      );

      successToast({
        title: t('reviewModal.successTitle'),
      });

      onClose();
    } catch (err) {
      errorToast({
        title: t('reviewModal.errorTitle'),
        description: t('reviewModal.errorDescription'),
      });
    }
  };

  return (
    <Modal isOpen={!!backlogItemId} onClose={onClose} size="3xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader borderBottom="1px solid" borderColor="gray.200">
          {t('reviewModal.title')}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Flex pb="12px" flexDir="column" gap={4}>
                <ProgressSection />
                <Divider
                  maxW="400px"
                  borderColor="gray.600"
                  mx="auto"
                  mt="20px"
                />
                <ReviewSection />
                <ProsConsSection />
                <Divider
                  maxW="400px"
                  borderColor="gray.600"
                  mx="auto"
                  mt="20px"
                  mb="20px"
                />
                <Checkbox
                  isChecked={shouldNotify}
                  onChange={() => form.setValue('shouldNotify', !shouldNotify)}
                >
                  {t('changeStateModal.notifyOnDiscordLabel')}
                </Checkbox>
                <Flex justifyContent="center" gap={4}>
                  <Button onClick={onClose} isDisabled={isPending}>
                    {t('reviewModal.cancel')}
                  </Button>
                  <Button
                    type="submit"
                    isLoading={isPending}
                    colorScheme="orange"
                  >
                    {t('reviewModal.submit')}
                  </Button>
                </Flex>
              </Flex>
            </form>
          </FormProvider>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
