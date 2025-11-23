import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';
import { Button, Flex, IconButton, Text } from '@chakra-ui/react';

type PaginationProps = {
  page: number;
  totalPage: number;
  goToPage: (newPage: number) => void;
  isLoading?: boolean;
};

export const Pagination = ({
  page,
  totalPage,
  goToPage,
  isLoading,
}: PaginationProps) => {
  return (
    <Flex justifyContent="center" gap={4} alignItems="center">
      <IconButton
        onClick={() => goToPage(1)}
        colorScheme="orange"
        isDisabled={page === 1 || isLoading}
        icon={<ArrowLeftIcon />}
        aria-label="First"
      />
      <IconButton
        onClick={() => goToPage(page - 1)}
        colorScheme="orange"
        isDisabled={page === 1 || isLoading}
        icon={<ChevronLeftIcon />}
        aria-label="Previous"
      />
      {page !== 1 && (
        <Button
          variant="outline"
          cursor="pointer"
          colorScheme="orange"
          onClick={() => goToPage(1)}
        >
          1
        </Button>
      )}
      {page > 2 && <Text>...</Text>}
      <Button variant="ghost" cursor="default" colorScheme="whiteAlpha">
        {page}
      </Button>
      {page < totalPage - 1 && <Text>...</Text>}
      {page !== totalPage && totalPage !== 1 && (
        <Button
          variant="outline"
          cursor="pointer"
          colorScheme="orange"
          onClick={() => goToPage(totalPage)}
        >
          {totalPage}
        </Button>
      )}
      <IconButton
        onClick={() => goToPage(page + 1)}
        type="button"
        colorScheme="orange"
        isDisabled={page === totalPage || isLoading}
        icon={<ChevronRightIcon />}
        aria-label="Next"
      />
      <IconButton
        onClick={() => goToPage(totalPage)}
        colorScheme="orange"
        isDisabled={page === totalPage || isLoading}
        icon={<ArrowRightIcon />}
        aria-label="Last"
      />
    </Flex>
  );
};
