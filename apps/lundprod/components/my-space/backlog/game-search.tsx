import {
  Box,
  Button,
  Flex,
  Input,
  Select,
  Tag,
  TagCloseButton,
  TagLabel,
  RadioGroup,
  Stack,
  Radio,
} from '@chakra-ui/react';
import { platForms } from '@discord-bot-v2/igdb';
import { ChangeEventHandler, useState } from 'react';
import { useBacklog } from '~/lundprod/contexts/backlog-context';
import { TypeMap, mapToCategory, mapToTypeMap } from '~/lundprod/utils/backlog';

type GameSearchProps = {
  onSearch: () => Promise<void>;
};

export function GameSearch({ onSearch }: GameSearchProps) {
  const [isSearching, setIsSearching] = useState(false);
  const { category, setCategory, setSearchValue, platforms, setPlatforms } =
    useBacklog();

  const onSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchValue(e.target.value);
  };
  const onSelectChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    const selectedPlatform = platForms.find(
      ({ id }) => String(id) === e.target.value
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
            <Radio value={TypeMap.GAME}>Jeu</Radio>
            <Radio value={TypeMap.DLC}>DLC</Radio>
          </Stack>
        </RadioGroup>
      </Box>
      <Flex flexDir={{ base: 'column', md: 'row' }} gap="15px" my="5px">
        <Input
          name="search"
          w={{ base: '100%', md: '50%' }}
          placeholder="Nom du jeu à chercher"
          onChange={onSearchChange}
          onKeyDown={(e) => e.key === 'Enter' && !isSearching && searchGames()}
        />
        <Select
          w={{ base: '100%', md: '50%' }}
          placeholder="Ajouter un filtre par plate-forme"
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
        Chercher
      </Button>
    </Box>
  );
}
