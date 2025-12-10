import { StarIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightAddon,
} from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { CharactersLeft } from '~/lundprod/components/characters-left';

import { ReviewModalForm } from './types';
import { pipeValidators, useValidateMax, useValidateMin } from './validations';

export const ProgressSection = () => {
  const { t } = useTranslation();
  const {
    register,
    setValue,
    formState: { errors },
    watch,
  } = useFormContext<ReviewModalForm>();
  const newRating = watch('rating');
  const completionComment = watch('completionComment');

  const min1 = useValidateMin(1);
  const max100 = useValidateMax(100);

  return (
    <Box>
      <Heading variant="h4" mb={2} color="gray.700">
        {t('reviewModal.progressTitle')}
      </Heading>
      <Flex
        alignItems="flex-start"
        justifyContent="space-between"
        flexDir={{ base: 'column', sm: 'row' }}
      >
        <FormControl maxW="150px">
          <FormLabel>{t('reviewModal.note')}</FormLabel>
          {Array.from({ length: 5 }, (_, index) => (
            <StarIcon
              key={index}
              color={index + 1 <= newRating ? 'gold' : 'gray.300'}
              onClick={() => setValue('rating', index + 1)}
              cursor="pointer"
              boxSize="20px"
            />
          ))}
        </FormControl>
        <FormControl maxW="200px" isInvalid={!!errors.duration}>
          <FormLabel>{t('reviewModal.duration')}</FormLabel>
          <InputGroup flex={1}>
            <Input
              type="number"
              {...register('duration', { validate: min1 })}
              isInvalid={!!errors.duration}
              step={1}
            />
            <InputRightAddon>{t('reviewModal.durationHour')}</InputRightAddon>
          </InputGroup>
          <FormErrorMessage>
            {errors.duration && errors.duration.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl maxW="200px" isInvalid={!!errors.completion}>
          <FormLabel>{t('reviewModal.completion')}</FormLabel>
          <InputGroup flex={1}>
            <Input
              type="number"
              {...register('completion', {
                validate: pipeValidators(min1, max100),
              })}
              isInvalid={!!errors.completion}
              step={1}
            />
            <InputRightAddon>
              {t('reviewModal.completionPercentage')}
            </InputRightAddon>
          </InputGroup>
          <FormErrorMessage>
            {errors.completion && errors.completion.message}
          </FormErrorMessage>
        </FormControl>
      </Flex>

      <Box mt="12px">
        <FormControl>
          <FormLabel>{t('reviewModal.completionComment')}</FormLabel>
          <Input
            type="text"
            {...register('completionComment')}
            isInvalid={!!errors.completionComment}
          />
          <CharactersLeft str={completionComment || ''} lengthMax={255} />
        </FormControl>
      </Box>
    </Box>
  );
};
