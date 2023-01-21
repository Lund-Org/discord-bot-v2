import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';
import { Box, Button, Flex } from '@chakra-ui/react';
import { GAME_PER_PAGE } from '@discord-bot-v2/igdb';

type GamePaginationProps = {
  currentGameCount: number;
  page: number;
  changePage: (newPage: number) => void;
};

export function GamePagination({
  currentGameCount,
  page,
  changePage,
}: GamePaginationProps) {
  const goNextPage = () => {
    changePage(page + 1);
  };
  const goPreviousPage = () => {
    changePage(page - 1);
  };
  const goFirstPage = () => {
    changePage(1);
  };

  return (
    <Flex justifyContent="space-between" mt="20px">
      <Box>
        {page > 1 && (
          <>
            <Button
              color="gray.700"
              _hover={{ bg: 'gray.300' }}
              onClick={goFirstPage}
              mr={2}
            >
              <ArrowLeftIcon boxSize={2} />
            </Button>
            <Button
              color="gray.700"
              _hover={{ bg: 'gray.300' }}
              onClick={goPreviousPage}
            >
              <ChevronLeftIcon mr={1} />
              Précédent
            </Button>
          </>
        )}
      </Box>
      <Box>
        <Button variant="outline" _hover={{}} cursor="default">
          Page {page}
        </Button>
      </Box>
      <Box>
        {currentGameCount === GAME_PER_PAGE && (
          <Button
            color="gray.700"
            _hover={{ bg: 'gray.300' }}
            onClick={goNextPage}
          >
            Suivant
            <ChevronRightIcon ml={1} />
          </Button>
        )}
      </Box>
    </Flex>
  );
}
