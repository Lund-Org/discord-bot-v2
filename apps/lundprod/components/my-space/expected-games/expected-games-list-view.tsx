import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Tag, TagLabel, Text } from '@chakra-ui/react';
import { getPlatformLabel } from '@discord-bot-v2/igdb-front';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import { useExpectedGame } from '~/lundprod/contexts/expected-games-context';
import { formatReleaseDate } from '~/lundprod/utils/dates';

type ExpectedGamesListViewProps = {
  readOnly?: boolean;
};

export const ExpectedGamesListView = ({
  readOnly = true,
}: ExpectedGamesListViewProps) => {
  const { t } = useTranslation();
  const { expectedGames, removeFromExpectedList, setModalData } =
    useExpectedGame();

  if (!expectedGames.length) {
    return <Text>{t('mySpace.expectedGames.list.noExpectedGames')}</Text>;
  }

  return (
    <Box maxW="800px">
      {expectedGames.map((expectedGame) => {
        const platformWording = getPlatformLabel(
          expectedGame.releaseDate.platformId,
        );

        return (
          <Box
            key={expectedGame.id}
            display={['block', 'flex']}
            p="12px 20px"
            borderRadius="8px"
            border="1px solid"
            borderColor="gray.200"
            gap={2}
            mb="20px"
            _hover={{ bg: 'whiteAlpha.100' }}
          >
            <Flex flexDir="column" gap="4px">
              <Text>{expectedGame.name}</Text>
              <Flex alignItems="center" gap="12px">
                {!!platformWording && (
                  <Tag variant="outline" size="sm">
                    <TagLabel>{platformWording}</TagLabel>
                  </Tag>
                )}
                <Text>
                  {expectedGame.releaseDate.date
                    ? formatReleaseDate(new Date(expectedGame.releaseDate.date))
                    : 'TBD'}
                </Text>
              </Flex>
              {expectedGame.addToBacklog && (
                <Text fontStyle="italic" fontSize="0.8em">
                  {t('mySpace.expectedGames.list.addedToBacklog')}
                </Text>
              )}
              {expectedGame.cancelled && (
                <Text color="red.400" fontSize="0.8em">
                  {t('mySpace.expectedGames.list.cancelled')}
                </Text>
              )}
            </Flex>
            <Box alignSelf="flex-start" ml="auto" mt={[2, 0]}>
              <Link
                href={expectedGame.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="sm"
                  color="gray.700"
                  rightIcon={<ExternalLinkIcon />}
                >
                  {t('mySpace.expectedGames.list.info')}
                </Button>
              </Link>
            </Box>
            {!readOnly && (
              <Flex flexDir="column" gap="4px">
                <Button
                  size="sm"
                  colorScheme="blue"
                  onClick={() =>
                    setModalData({
                      type: 'update',
                      initialAddToBacklog: expectedGame.addToBacklog,
                      platformId: expectedGame.releaseDate.platformId,
                      game: {
                        id: expectedGame.igdbId,
                        name: expectedGame.name,
                      },
                      region: expectedGame.releaseDate.region,
                    })
                  }
                >
                  {t('mySpace.expectedGames.list.edit')}
                </Button>
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => removeFromExpectedList(expectedGame.igdbId)}
                >
                  {t('mySpace.expectedGames.list.delete')}
                </Button>
              </Flex>
            )}
          </Box>
        );
      })}
    </Box>
  );
};
