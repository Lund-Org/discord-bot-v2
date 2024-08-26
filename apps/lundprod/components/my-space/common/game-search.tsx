import {
  Box,
  Button,
  Flex,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Tag,
  TagCloseButton,
  TagLabel,
} from '@chakra-ui/react';
import { platForms } from '@discord-bot-v2/igdb-front';
import { ChangeEventHandler, Context, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { mapToCategory, mapToTypeMap, TypeMap } from '~/lundprod/utils/backlog';
import { ContextWithGameSearch } from '~/lundprod/utils/types';

type GameSearchProps<T extends ContextWithGameSearch> = {
  onSearch: () => Promise<void>;
  context: Context<T>;
};

export function GameSearch<T extends ContextWithGameSearch>({
  context,
  onSearch,
}: GameSearchProps<T>) {
  const { t } = useTranslation();
  const [isSearching, setIsSearching] = useState(false);
  const { category, setCategory, searchValue, platforms, setPlatforms } =
    useContext<T>(context);

  const onSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    searchValue.current = e.target.value;
  };
  const onSelectChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    const selectedPlatform = platForms.find(
      ({ id }) => String(id) === e.target.value,
    );

    if (selectedPlatform) {
      setPlatforms([...platforms, selectedPlatform]);
    }
  };
  const removePlatform = (removeId: number) => {
    setPlatforms(platforms.filter(({ id }) => id !== removeId));
  };
  const searchGames = async () => {
    setIsSearching(true);

    onSearch().finally(() => setIsSearching(false));
  };

  const possibleOptions = platForms.filter((platform) => {
    return !platforms.find(({ id }) => id === platform.id);
  });

  return (
    <Box>
      <Box>
        <RadioGroup
          onChange={(v: TypeMap) => setCategory(mapToCategory(v))}
          value={mapToTypeMap(category)}
        >
          <Stack direction="row">
            <Radio value={TypeMap.GAME}>
              {t('mySpace.backlog.search.game')}
            </Radio>
            <Radio value={TypeMap.DLC}>{t('mySpace.backlog.search.dlc')}</Radio>
          </Stack>
        </RadioGroup>
      </Box>
      <Flex flexDir={{ base: 'column', md: 'row' }} gap="15px" my="5px">
        <Input
          name="search"
          w={{ base: '100%', md: '50%' }}
          placeholder={t('mySpace.backlog.search.gamePlaceholder')}
          onChange={onSearchChange}
          onKeyDown={(e) => e.key === 'Enter' && !isSearching && searchGames()}
        />
        <Select
          w={{ base: '100%', md: '50%' }}
          placeholder={t('mySpace.backlog.search.filterPlatformPlaceholder')}
          onChange={onSelectChange}
          bg="gray.100"
          color="gray.800"
        >
          {possibleOptions.map((possibleOption) => (
            <option key={possibleOption.id} value={String(possibleOption.id)}>
              {possibleOption.name}
            </option>
          ))}
        </Select>
      </Flex>
      <Box minH="40px">
        {platforms.map((platform) => (
          <Tag key={platform.id} mr={2}>
            <TagLabel>{platform.abbreviation || platform.name}</TagLabel>
            <TagCloseButton onClick={() => removePlatform(platform.id)} />
          </Tag>
        ))}
      </Box>
      <Button
        colorScheme="orange"
        onClick={searchGames}
        isLoading={isSearching}
      >
        {t('mySpace.backlog.search.search')}
      </Button>
    </Box>
  );
}
