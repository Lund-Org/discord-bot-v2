import {
  Box,
  FormControl,
  FormLabel,
  Heading,
  Textarea,
} from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ReviewModalForm } from './types';

export const ReviewSection = () => {
  const { t } = useTranslation();
  const {
    register,
    formState: { errors },
  } = useFormContext<ReviewModalForm>();

  return (
    <Box>
      <Heading variant="h4" mb={2} color="gray.700">
        {t('reviewModal.reviewTitle')}
      </Heading>
      <FormControl>
        <FormLabel>{t('reviewModal.review')}</FormLabel>
        <Textarea
          {...register('review', { required: true })}
          isInvalid={!!errors.review}
          minH="250px"
        />
      </FormControl>
    </Box>
  );
};
