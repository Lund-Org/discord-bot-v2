import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  chakra,
  Collapse,
  Flex,
  Image,
  Table,
  Tag,
  TagLabel,
  Tbody,
  Td,
  Text,
  Tr,
} from '@chakra-ui/react';
import { ArrayElement } from '@discord-bot-v2/common';
import {
  Game,
  translateGameType,
  translateRegion,
} from '@discord-bot-v2/igdb-front';
import { TFunction } from 'i18next';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { formatReleaseDate } from '~/lundprod/utils/dates';

import { Tooltip } from '../tooltip';

type SearchGameLineProps = {
  game: Game;
  onGameSelect: (game: Game, platformId?: number) => void;
  onGameUnselect: (game: Game, platformId?: number) => void;
  selectByPlatform: boolean;
  isGameSelected: (game: Game, platformId?: number) => boolean;
  isDisabled: boolean;
};

export const SearchGameLine = ({
  game,
  onGameSelect,
  onGameUnselect,
  selectByPlatform,
  isGameSelected,
  isDisabled,
}: SearchGameLineProps) => {
  const { t } = useTranslation();

  const [areDetailsDisplayed, setAreDetailsDisplayed] = useState(false);

  const oneOfThePlatformSelected = game.platforms?.some(({ id }) =>
    isGameSelected(game, id),
  );

  return (
    <Box
      mt={2}
      boxShadow="0px 0px 2px 0px rgba(0,0,0,0.75)"
      borderRadius={8}
      _hover={{
        boxShadow: '0px 0px 4px 0px rgba(0,0,0,0.75)',
        bg: 'gray.100',
      }}
      p="8px"
    >
      <Flex alignItems="center">
        {game.cover ? (
          <Image src={game.cover.url} h="90px" w="90px" />
        ) : (
          <Box bg="#111" h="90px" w="90px" />
        )}
        <Flex flex={1} px="8px" py="4px" gap={2} alignItems="center">
          <Flex flex={1} flexDir="column" gap={2} alignItems="flex-start">
            <Text>{game.name}</Text>
            <Flex alignItems="center" gap={2}>
              <Tag variant="outline" size="md" bg="white">
                {translateGameType(t, game.game_type)}
              </Tag>
              <chakra.a
                display="inline-flex"
                target="_blank"
                href={game.url}
                rel="noopener noreferrer"
              >
                <ExternalLinkIcon
                  cursor="pointer"
                  color="gray.600"
                  _hover={{
                    color: 'gray.900',
                  }}
                />
              </chakra.a>
            </Flex>
          </Flex>
          <Flex gap={1}>
            <Button
              colorScheme="orange"
              size="sm"
              onClick={() => setAreDetailsDisplayed((x) => !x)}
            >
              {t('gameModal.details')}
            </Button>
            <Tooltip
              label={t('gameModal.selectByPlatform')}
              isDisabled={!selectByPlatform}
              hasArrow
            >
              <Button
                colorScheme={
                  selectByPlatform
                    ? 'gray'
                    : isGameSelected(game)
                      ? 'red'
                      : 'teal'
                }
                size="sm"
                onClick={() =>
                  isGameSelected(game)
                    ? onGameUnselect(game)
                    : onGameSelect(game)
                }
                isDisabled={selectByPlatform || isDisabled}
              >
                {!selectByPlatform && isGameSelected(game)
                  ? t('gameModal.remove')
                  : t('gameModal.select')}
              </Button>
            </Tooltip>
          </Flex>
        </Flex>
      </Flex>
      <Collapse in={areDetailsDisplayed}>
        <Table
          variant="unstyled"
          borderTop="1px solid"
          borderColor="gray.300"
          mt={2}
        >
          <Tbody>
            {game.platforms?.map((platform, index) => {
              const releaseDates = (game.release_dates || []).filter(
                ({ platform: { id: platformId } }) =>
                  platformId === platform.id,
              );

              const selected =
                selectByPlatform && isGameSelected(game, platform.id);

              return (
                <Tr
                  key={platform.id}
                  borderBottom={
                    index === (game.platforms || []).length - 1
                      ? undefined
                      : '1px solid'
                  }
                  borderColor="gray.300"
                >
                  <Td fontWeight={600}>{platform.name}</Td>
                  <Td>
                    {releaseDates.map((releaseDate) => (
                      <Flex key={releaseDate.id} gap={1} py="2px">
                        <Text>{getReleaseDateWording(t, releaseDate)}</Text>
                        <Tag variant="outline" size="sm" bg="white">
                          <TagLabel>
                            {translateRegion(t, releaseDate.release_region)}
                          </TagLabel>
                        </Tag>
                      </Flex>
                    ))}
                  </Td>
                  {selectByPlatform && (
                    <Td>
                      <Button
                        colorScheme={selected ? 'red' : 'teal'}
                        size="sm"
                        onClick={() =>
                          selected
                            ? onGameUnselect(game, platform.id)
                            : onGameSelect(game, platform.id)
                        }
                        isDisabled={
                          isDisabled || (!selected && oneOfThePlatformSelected)
                        }
                      >
                        {selected
                          ? t('gameModal.remove')
                          : t('gameModal.select')}
                      </Button>
                    </Td>
                  )}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Collapse>
    </Box>
  );
};

function getReleaseDateWording(
  t: TFunction,
  releaseDate?: ArrayElement<Exclude<Game['release_dates'], undefined>>,
) {
  return releaseDate
    ? releaseDate.date
      ? formatReleaseDate(new Date(releaseDate.date * 1000))
      : releaseDate.human
    : t('gameModal.unknown');
}
