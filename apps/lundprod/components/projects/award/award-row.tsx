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
import { FieldArrayWithId, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { AwardForm, Game } from '~/lundprod/types/awards';

import { AwardGame } from './award-game';
import { AwardGameModal } from './award-game-modal';

type AwardRowProps = {
  field: FieldArrayWithId<AwardForm, 'awards', 'id'>;
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
  const {
    fields: games,
    append,
    remove,
    update,
  } = useFieldArray({
    name: `awards.${index}.games`,
  });
  const [isNewGameModalDisplayed, setIsNewGameModalDisplayed] =
    useBoolean(false);

  const onAddGame = (game: Game) => {
    append({ ...game, isBest: false });
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
          {games.map((_game, index) => {
            const game = _game as FieldArrayWithId<
              AwardForm,
              'awards.0.games',
              'id'
            >;
            return (
              <AwardGame
                key={game.id}
                game={game}
                onDelete={() => remove(index)}
                isBest={game.isBest}
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
        {isNewGameModalDisplayed && (
          <AwardGameModal
            onSave={onAddGame}
            onClose={setIsNewGameModalDisplayed.off}
          />
        )}
      </Box>
    </Box>
  );
};
