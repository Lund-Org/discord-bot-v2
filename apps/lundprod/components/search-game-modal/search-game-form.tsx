import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
} from '@chakra-ui/react';
import { platForms } from '@discord-bot-v2/igdb-front';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TypeMap } from '../../utils/backlog';
import { SearchFormValues } from './type';

type SearchGameFormProps = {
  submitSearch: (data: SearchFormValues) => void;
  isFetching: boolean;
};

export const SearchGameForm = ({
  submitSearch,
  isFetching,
}: SearchGameFormProps) => {
  const { t } = useTranslation();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<SearchFormValues>({
    defaultValues: {
      query: '',
      type: TypeMap.GAME,
      platformId: '',
    },
    mode: 'onSubmit',
  });

  return (
    <Box as="form" pb="20px" onSubmit={handleSubmit(submitSearch)}>
      <FormControl isInvalid={!!errors.type}>
        <RadioGroup defaultValue={TypeMap.GAME}>
          <Stack direction="row" justifyContent="center">
            <Radio
              {...register('type', { required: true })}
              value={TypeMap.GAME}
            >
              {t('gameModal.game')}
            </Radio>
            <Radio
              {...register('type', { required: true })}
              value={TypeMap.DLC}
            >
              {t('gameModal.dlc')}
            </Radio>
          </Stack>
        </RadioGroup>
        <FormErrorMessage>
          {errors.type && errors.type.message}
        </FormErrorMessage>
      </FormControl>
      <Flex flexDir={{ base: 'column', md: 'row' }} gap="15px" my="5px">
        <FormControl w={{ base: '100%', md: '50%' }} isInvalid={!!errors.query}>
          <Input
            {...register('query', {
              validate: (query) =>
                query.length >= 2 ? true : t('gameModal.minLength'),
            })}
            placeholder={t('gameModal.gamePlaceholder')}
          />
          <FormErrorMessage>
            {errors.query && errors.query.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl w={{ base: '100%', md: '50%' }}>
          <Select
            {...register('platformId')}
            placeholder={t('gameModal.filterPlatformPlaceholder')}
            bg="gray.100"
            color="gray.800"
          >
            {platForms.map(({ id, name }) => (
              <option key={id} value={String(id)}>
                {name}
              </option>
            ))}
          </Select>
        </FormControl>
      </Flex>
      <Box textAlign="center">
        <Button
          type="submit"
          colorScheme="teal"
          isLoading={isSubmitting || isFetching}
        >
          {t('gameModal.search')}
        </Button>
      </Box>
    </Box>
  );
};
