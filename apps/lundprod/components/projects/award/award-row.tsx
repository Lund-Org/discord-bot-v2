import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Spacer,
  useBoolean,
} from '@chakra-ui/react';
import { Game } from '@discord-bot-v2/igdb-front';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { AwardForm, AwardGameType } from '~/lundprod/types/awards';

import { SearchGameModal } from '../../search-game-modal/search-game-modal';
import { AwardGame } from './award-game';

type AwardRowProps = {
  field: AwardForm['awards'][number];
  index: number;
  onDelete: (index: number) => void;
  onEditAward: VoidFunction;
};

export const AwardRow = ({
  field,
  index,
  onDelete,
  onEditAward,
}: AwardRowProps) => {
  const { t } = useTranslation();
  const { control } = useFormContext<AwardForm>();
  const {
    fields: games,
    append,
    remove,
    update,
  } = useFieldArray({
    name: `awards.${index}.games`,
    control,
    keyName: '_id',
  });
  const [isNewGameModalDisplayed, setIsNewGameModalDisplayed] =
    useBoolean(false);

  const onAddGame = (game: Game) => {
    append({ ...game, isBest: false });
  };
  const onRemoveGame = (game: Game) => {
    const index = games.findIndex(({ id }) => game.id == id);

    if (index !== -1) {
      remove(index);
    }
  };

  const setAward = (index: number, value: boolean) => {
    games.forEach((game, gameIndex) => {
      update(
        gameIndex,
        index === gameIndex
          ? { ...game, isBest: value }
          : { ...game, isBest: false },
      );
    });
  };

  return (
    <Box>
      <Box
        className="award-row"
        border="1px solid var(--chakra-colors-gray-900)"
        borderRadius={5}
        p="20px"
        transition="all .3s ease"
        _hover={{
          bg: 'gray.700',
        }}
        bg="gray.900"
        position="relative"
        pb="40px"
        mb="30px"
      >
        <Flex gap={3} alignItems="center">
          <Box position="relative">
            <Heading
              as="h4"
              variant="h4"
              position="relative"
              zIndex={1}
              mb="15px"
            >
              {field.label}
            </Heading>
            <Box
              sx={{ '.award-row:hover &': { width: '20px', bg: 'blue.700' } }}
              h="10px"
              w="200px"
              position="absolute"
              transition="width .3s ease, background .3s ease"
              bg="blue.600"
              bottom="5px"
              left="-3px"
              zIndex={0}
            />
          </Box>
          <Spacer />
          <IconButton
            data-screenshot="hidden"
            cursor="pointer"
            p="10px"
            as={EditIcon}
            colorScheme="blue"
            aria-label="edit"
            onClick={onEditAward}
          />
          <IconButton
            data-screenshot="hidden"
            cursor="pointer"
            p="10px"
            as={DeleteIcon}
            colorScheme="red"
            aria-label="delete"
            onClick={() => onDelete(index)}
          />
        </Flex>
        <Flex py="20px" gap="10px" flexWrap="wrap">
          {games.map((game, index) => {
            return (
              <AwardGame
                key={game._id}
                game={game}
                onDelete={() => remove(index)}
                isBest={(game as AwardGameType).isBest}
                onClick={(value) => setAward(index, value)}
              />
            );
          })}
        </Flex>
        <Button
          data-screenshot="hidden"
          colorScheme="blue"
          leftIcon={<AddIcon color="white" />}
          onClick={setIsNewGameModalDisplayed.on}
        >
          {t('awards.addGame')}
        </Button>
        <SearchGameModal
          isOpen={isNewGameModalDisplayed}
          onClose={setIsNewGameModalDisplayed.off}
          onGameSelected={onAddGame}
          onGameUnselected={onRemoveGame}
          futureGame={false}
          isGameSelected={(game) => !!games.find(({ id }) => game.id === id)}
          isLoading={false}
        />
      </Box>
    </Box>
  );
};
