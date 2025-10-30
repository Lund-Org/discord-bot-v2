import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
} from '@chakra-ui/react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CharactersLeft } from '~/lundprod/components/characters-left';
import { ReviewModalForm } from './types';
import { useLength } from './validations';

export const ProsConsSection = () => {
  const { t } = useTranslation();
  const {
    control,
    register,
    formState: { errors },
    watch,
  } = useFormContext<ReviewModalForm>();

  const validateLength = useLength(1, 255);

  const _proFields = watch('pros');
  const _conFields = watch('cons');

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
  } = useFieldArray<ReviewModalForm>({
    control,
    name: 'cons',
  });

  return (
    <Flex gap={4} flexDir={{ base: 'column', sm: 'row' }}>
      <FormControl>
        <Flex>
          <FormLabel>{t('reviewModal.pros')}</FormLabel>
          <Button
            leftIcon={<AddIcon />}
            aria-label={''}
            onClick={() => appendPro({ value: '' })}
            size="xs"
            colorScheme="green"
          >
            {t('reviewModal.add')}
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
                  validate: validateLength,
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
            <CharactersLeft lengthMax={255} str={_proFields[index].value} />
          </Box>
        ))}
      </FormControl>
      <FormControl>
        <Flex>
          <FormLabel>{t('reviewModal.cons')}</FormLabel>
          <Button
            leftIcon={<AddIcon />}
            aria-label={''}
            onClick={() => appendCon({ value: '' })}
            size="xs"
            colorScheme="red"
          >
            {t('reviewModal.add')}
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
                  validate: validateLength,
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
            <CharactersLeft lengthMax={255} str={_conFields[index].value} />
          </Box>
        ))}
      </FormControl>
    </Flex>
  );
};
