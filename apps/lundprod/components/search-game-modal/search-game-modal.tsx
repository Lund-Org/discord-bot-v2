import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Spinner,
  Text,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from '@chakra-ui/react';
import { Game, GAME_PER_PAGE } from '@discord-bot-v2/igdb-front';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { trpc } from '~/lundprod/utils/trpc';
import { TypeMap } from '~/lundprod/utils/backlog';

import { SearchGameForm } from './search-game-form';
import { SearchFormValues } from './type';
import { SearchGameLine } from './search-game-line';

type SearchGameModalProps = {
  isOpen: boolean;
  onClose: VoidFunction;
  onGameSelected: (game: Game, platformId?: number) => void;
  futureGame: boolean;
  size?: ModalProps['size'];
  selectByPlatform?: boolean;
  isGameSelected: (game: Game, platformId?: number) => boolean;
};

export const SearchGameModal = ({
  isOpen,
  onClose,
  onGameSelected,
  futureGame,
  size = '3xl',
  selectByPlatform = false,
  isGameSelected,
}: SearchGameModalProps) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState<SearchFormValues | null>(null);

  const utils = trpc.useUtils();
  const payload = {
    withImage: true,
    dlc: formData?.type === TypeMap.DLC,
    query: formData?.query || '',
    futureGame,
    page,
    platformId: formData?.platformId ? +formData.platformId : undefined,
  };
  const { data, isFetching } = trpc.getGames.useQuery(payload, {
    enabled: !!formData,
    placeholderData: (previousData) => (!formData ? undefined : previousData),
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (!isOpen) {
      setFormData(null);
      setPage(1);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen && !formData) {
      utils.getGames.reset();
    }
  }, [isOpen, formData]);

  const onNextPage = () => {
    setPage((p) => p + 1);
  };

  const onPreviousPage = () => {
    setPage((p) => (p > 1 ? p - 1 : p));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader borderBottom="1px solid" borderColor="gray.200">
          {t('gameModal.title')}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SearchGameForm submitSearch={setFormData} isFetching={isFetching} />
          <Box position="relative">
            <Flex flexDir="column" gap={4}>
              {data &&
                data?.map((game) => (
                  <SearchGameLine
                    key={game.id}
                    game={game}
                    onGameSelect={onGameSelected}
                    selectByPlatform={selectByPlatform}
                    isGameSelected={isGameSelected}
                  />
                ))}
            </Flex>
            {data && data.length === 0 && (
              <Flex gap={2} flexDir="column" alignItems="center">
                <Heading variant="h3" color="primary.700">
                  {page > 1
                    ? t('gameModal.noMoreResults.title')
                    : t('gameModal.noResults.title')}
                </Heading>
                <Text>
                  {page > 1
                    ? t('gameModal.noMoreResults.text')
                    : t('gameModal.noResults.text')}
                </Text>
              </Flex>
            )}
            {isFetching && data && (
              <Center
                position="absolute"
                inset={0}
                bg="rgba(255, 255, 255, .6)"
              >
                <Spinner size="lg" />
              </Center>
            )}
          </Box>
          {data && (data.length || (!data.length && page > 1)) && (
            <Flex justifyContent="center" gap={2} mt={4} pb="16px">
              <Button
                onClick={onPreviousPage}
                type="button"
                colorScheme="orange"
                isDisabled={page === 1 || isFetching}
                leftIcon={<ChevronLeftIcon mt={1} />}
              >
                {t('gameModal.previousPage')}
              </Button>
              <Button
                onClick={onNextPage}
                type="button"
                colorScheme="orange"
                isDisabled={data.length < GAME_PER_PAGE || isFetching}
                rightIcon={<ChevronRightIcon mt={1} />}
              >
                {t('gameModal.nextPage')}
              </Button>
            </Flex>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
