import { AddIcon, DeleteIcon, StarIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  InputGroup,
  InputRightAddon,
  IconButton,
  Box,
  Checkbox,
  Divider,
} from '@chakra-ui/react';
import { BacklogStatus } from '@prisma/client';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FieldArrayPath, useFieldArray, useForm } from 'react-hook-form';

import {
  BacklogItemLight,
  useBacklog,
} from '~/lundprod/contexts/backlog-context';

type BacklogSetDetailsProps = {
  igdbId: number;
  status: BacklogStatus;
  item: BacklogItemLight;
};

const STATUS_WITH_DETAILS: BacklogStatus[] = [
  BacklogStatus.ABANDONED,
  BacklogStatus.FINISHED,
];

type FormData = {
  review: string;
  rating: number;
  duration?: number;
  completion?: number;
  completionComment?: string;
  pros: { value: string }[];
  cons: { value: string }[];
  ratingValidation: string;
  shouldNotify: boolean;
};

export const BacklogSetDetails = ({
  igdbId,
  status,
  item,
}: BacklogSetDetailsProps) => {
  const { t } = useTranslation();
  const { updateBacklogDetails } = useBacklog();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const defaultValues = useMemo(() => {
    return {
      review: item.review || '',
      rating: item.rating || 0,
      completion: item.completion || undefined,
      completionComment: item.completionComment || '',
      duration: item.duration,
      pros: item.pros?.length
        ? item.pros.map((value) => ({ value }))
        : [{ value: '' }],
      cons: item.cons?.length
        ? item.cons.map((value) => ({ value }))
        : [{ value: '' }],
      ratingValidation: '',
      shouldNotify: true,
    };
  }, [item]);

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<FormData>({
    defaultValues,
  });

  useEffect(() => {
    if (isModalOpen) {
      reset(defaultValues);
    }
  }, [isModalOpen]);

  const newRating = watch('rating');
  const _proFields = watch('pros');
  const _conFields = watch('cons');
  const completionComment = watch('completionComment');

  const {
    fields: proFields,
    remove: removePro,
    append: appendPro,
  } = useFieldArray({
    control,
    name: 'pros',
  });
  const {
    fields: conFields,
    remove: removeCon,
    append: appendCon,
  } = useFieldArray({
    control,
    name: 'cons',
  });

  const onSubmit = async (data: FormData) => {
    try {
      await updateBacklogDetails(igdbId, {
        ...data,
        pros: data.pros.map(({ value }) => value),
        cons: data.cons.map(({ value }) => value),
      });
      setIsModalOpen(false);
    } catch (e) {}
  };

  if (!STATUS_WITH_DETAILS.includes(status)) {
    return null;
  }

  return (
    <>
      <Button
        variant="outline"
        _hover={{ bg: 'gray.600' }}
        size="sm"
        onClick={() => setIsModalOpen(true)}
      >
        <AddIcon />
      </Button>
      <Modal
        isOpen={isModalOpen}
        size="2xl"
        onClose={() => setIsModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('mySpace.backlog.details.addDetails')}</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <Flex flexDir="column" gap={3}>
                <Flex gap={4}>
                  <FormControl>
                    <FormLabel>{t('mySpace.backlog.details.note')}</FormLabel>
                    <Flex gap={1}>
                      {Array.from({ length: 5 }, (_, index) => (
                        <StarIcon
                          key={index}
                          color={index + 1 <= newRating ? 'gold' : 'gray.300'}
                          onClick={() => setValue('rating', index + 1)}
                          cursor="pointer"
                          boxSize="20px"
                        />
                      ))}
                      <input
                        type="hidden"
                        {...register('ratingValidation', {
                          validate: () =>
                            newRating === 0 ? 'invalid' : undefined,
                        })}
                      />
                    </Flex>
                  </FormControl>
                  <FormControl maxW="200px">
                    <FormLabel>
                      {t('mySpace.backlog.details.duration')}
                    </FormLabel>
                    <InputGroup flex={1}>
                      <Input
                        type="number"
                        {...register('duration', { min: 0 })}
                        isInvalid={!!errors.duration}
                      />
                      <InputRightAddon>
                        {t('mySpace.backlog.details.durationHour')}
                      </InputRightAddon>
                    </InputGroup>
                  </FormControl>
                  <FormControl maxW="200px">
                    <FormLabel>
                      {t('mySpace.backlog.details.completion')}
                    </FormLabel>
                    <InputGroup flex={1}>
                      <Input
                        type="number"
                        {...register('completion', { min: 0, max: 100 })}
                        isInvalid={!!errors.completion}
                      />
                      <InputRightAddon>
                        {t('mySpace.backlog.details.completionPercentage')}
                      </InputRightAddon>
                    </InputGroup>
                  </FormControl>
                </Flex>
                <FormControl>
                  <FormLabel>
                    {t('mySpace.backlog.details.completionComment')}
                  </FormLabel>
                  <InputGroup flex={1}>
                    <Input
                      type="text"
                      {...register('completionComment', {
                        validate: (value) =>
                          value && value.length > 255 ? 'invalid' : undefined,
                      })}
                      isInvalid={!!errors.completionComment}
                    />
                  </InputGroup>
                  <CharactersLeft lengthMax={255} str={completionComment} />
                </FormControl>
                <FormControl>
                  <FormLabel>{t('mySpace.backlog.details.comment')}</FormLabel>
                  <Textarea
                    {...register('review', { required: true })}
                    isInvalid={!!errors.review}
                    minH="250px"
                  />
                </FormControl>
                <Flex gap={4} flexDir={{ base: 'column', sm: 'row' }}>
                  <FormControl>
                    <Flex>
                      <FormLabel>{t('mySpace.backlog.details.pros')}</FormLabel>
                      <Button
                        leftIcon={<AddIcon />}
                        aria-label={''}
                        onClick={() => appendPro({ value: '' })}
                        size="xs"
                        colorScheme="green"
                      >
                        {t('mySpace.backlog.details.add')}
                      </Button>
                    </Flex>
                    {proFields.map((field, index) => (
                      <Box key={field.id} mb={2}>
                        <Flex
                          gap={2}
                          mb={2}
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Input
                            {...register(`pros.${index}.value`, {
                              validate: (value) =>
                                value.length > 255 || value.length === 0
                                  ? 'invalid'
                                  : undefined,
                            })}
                            isInvalid={!!errors.pros?.[index]?.value}
                          />
                          {proFields.length > 1 && (
                            <IconButton
                              icon={<DeleteIcon />}
                              aria-label={''}
                              onClick={() => removePro(index)}
                            />
                          )}
                        </Flex>
                        <CharactersLeft
                          lengthMax={255}
                          str={_proFields[index].value}
                        />
                      </Box>
                    ))}
                  </FormControl>
                  <FormControl>
                    <Flex>
                      <FormLabel>{t('mySpace.backlog.details.cons')}</FormLabel>
                      <Button
                        leftIcon={<AddIcon />}
                        aria-label={''}
                        onClick={() => appendCon({ value: '' })}
                        size="xs"
                        colorScheme="red"
                      >
                        {t('mySpace.backlog.details.add')}
                      </Button>
                    </Flex>
                    {conFields.map((field, index) => (
                      <Box key={field.id} mb={2}>
                        <Flex
                          gap={2}
                          mb={2}
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Input
                            {...register(`cons.${index}.value`, {
                              validate: (value) =>
                                value.length > 255 || value.length === 0
                                  ? 'invalid'
                                  : undefined,
                            })}
                            isInvalid={!!errors.cons?.[index]?.value}
                          />
                          {conFields.length > 1 && (
                            <IconButton
                              icon={<DeleteIcon />}
                              aria-label={''}
                              onClick={() => removeCon(index)}
                            />
                          )}
                        </Flex>
                        <CharactersLeft
                          lengthMax={255}
                          str={_conFields[index].value}
                        />
                      </Box>
                    ))}
                  </FormControl>
                </Flex>
                <FormControl>
                  <Divider w="100%" h="1px" my="15px" />
                  <Checkbox {...register(`shouldNotify`)}>
                    {t('mySpace.backlog.details.shouldNotify')}
                  </Checkbox>
                </FormControl>
              </Flex>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="green"
                type="submit"
                isLoading={isSubmitting}
              >
                {t('mySpace.backlog.details.save')}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

const CharactersLeft = ({
  str,
  lengthMax,
}: {
  str: string;
  lengthMax: number;
}) => {
  const { t } = useTranslation();
  return (
    <FormHelperText color={str.length > lengthMax ? 'red.600' : 'inherit'}>
      {t('mySpace.backlog.details.charactersLeft', {
        count: lengthMax - str.length,
      })}
    </FormHelperText>
  );
};
