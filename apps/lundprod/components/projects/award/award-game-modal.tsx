import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  chakra,
  useBoolean,
} from '@chakra-ui/react';
import {
  GAME_PER_PAGE,
  GAME_TYPE,
  Game as IGDBGame,
  QUERY_OPERATOR,
} from '@discord-bot-v2/igdb-front';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useFetcher } from '~/lundprod/hooks/useFetcher';
import { Game } from '~/lundprod/types/awards';

type AwardGameModalProps = {
  onSave: (game: Game) => void;
  onClose: VoidFunction;
};

export const AwardGameModal = ({ onSave, onClose }: AwardGameModalProps) => {
  const { t } = useTranslation();
  const { post } = useFetcher();

  const {
    handleSubmit,
    getValues,
    register,
    formState: { errors },
    trigger,
    watch,
  } = useForm<{ game: Game; search: string }>({
    defaultValues: {
      search: '',
    },
  });
  const [isLoading, setIsLoading] = useBoolean(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [data, setData] = useState<IGDBGame[] | null>(null);

  const selectedGameId = watch('game.igdb');

  const searchResults = async (searchHook: string, page: number) => {
    try {
      setIsLoading.on();
      const results = await post(
        '/api/games/list',
        {
          page,
        },
        JSON.stringify({
          search: searchHook,
          withImage: 'true',
          filters: [
            {
              field: 'game_type',
              operator: QUERY_OPERATOR.EQ,
              value: GAME_TYPE.MAIN_GAME,
            },
          ],
        }),
      );

      setData(results.games || []);
    } catch (err) {
      setData([]);
    } finally {
      setIsLoading.off();
    }
  };

  const onSearch = async () => {
    const isValid = await trigger('search');

    if (isValid) {
      setSearch(getValues('search'));
      setPage(1);
      await searchResults(getValues('search'), 1);
    }
  };

  const onChangePage = async (newPage: number) => {
    setPage(newPage);
    await searchResults(search, newPage);
  };

  const onSelectGame = (
    id: string,
    cover: string | undefined,
    name: string,
  ) => {
    submit({ game: { igdb: id, image: cover, label: name, isBest: false } });
  };

  const submit = ({ game }: { game: Game }) => {
    onSave(game);
    onClose();
  };

  return (
    <Modal isOpen size="3xl" onClose={onClose}>
      <ModalOverlay />
      <form onSubmit={handleSubmit(submit)}>
        <ModalContent>
          <ModalHeader>{t('awards.gameAward.headerNewGame')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={!!errors.search}>
              <Text fontWeight="bold">{t('awards.gameAward.search')}</Text>
              <InputGroup>
                <Input
                  {...register('search', {
                    required: t('awards.gameAward.required'),
                  })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      onSearch();
                    }
                  }}
                />
                <InputRightElement w="fit-content">
                  <Button onClick={onSearch} size="sm" mr={1}>
                    {t('awards.gameAward.searchButton')}
                  </Button>
                </InputRightElement>
              </InputGroup>
              {!!errors.search && (
                <FormErrorMessage>{errors.search.message}</FormErrorMessage>
              )}
            </FormControl>
            {isLoading ? (
              <Flex p="30px" justifyContent="center">
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="orange.400"
                />
              </Flex>
            ) : data ? (
              <>
                <TableContainer>
                  <Table my={3} variant="striped">
                    <chakra.colgroup>
                      <chakra.col w="60px" />
                      <chakra.col />
                      <chakra.col w="120px" />
                    </chakra.colgroup>
                    <Thead>
                      <Tr>
                        <Th></Th>
                        <Th>{t('awards.gameAward.table.name')}</Th>
                        <Th>{t('awards.gameAward.table.action')}</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data.map(({ id, cover, name }) => (
                        <Tr
                          sx={
                            id.toString() === selectedGameId
                              ? {
                                  '& td': {
                                    bg: 'var(--chakra-colors-green-100) !important',
                                  },
                                }
                              : {}
                          }
                        >
                          <Td p={0} pl="10px">
                            {cover && (
                              <Image src={cover.url} maxW="50px" maxH="50px" />
                            )}
                          </Td>
                          <Td px="10px">
                            <Text>{name}</Text>
                          </Td>
                          <Td>
                            <Button
                              colorScheme="teal"
                              size="sm"
                              ml="auto"
                              mr={0}
                              onClick={() =>
                                onSelectGame(id.toString(), cover?.url, name)
                              }
                            >
                              {t('awards.gameAward.table.select')}
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
                <Flex justifyContent="space-between" mt={2}>
                  <Button
                    leftIcon={<ChevronLeftIcon />}
                    size="xs"
                    colorScheme="orange"
                    isDisabled={page === 1}
                    onClick={() => onChangePage(page - 1)}
                  >
                    {t('awards.gameAward.previous')}
                  </Button>
                  <Button
                    rightIcon={<ChevronRightIcon />}
                    size="xs"
                    colorScheme="orange"
                    isDisabled={data.length !== GAME_PER_PAGE}
                    onClick={() => onChangePage(page + 1)}
                  >
                    {t('awards.gameAward.next')}
                  </Button>
                </Flex>
              </>
            ) : null}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={onClose}>
              {t('awards.gameAward.close')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};
