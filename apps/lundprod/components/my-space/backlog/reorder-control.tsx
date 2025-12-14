import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons';
import { Box, Flex, Input } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { BacklogGame } from '~/lundprod/contexts/me.context';
import { BacklogItemMoveType } from '~/lundprod/server/types';

type ReorderControlProps = {
  firstRow: boolean;
  lastRow: boolean;
  gameId: number;
  status: BacklogGame['status'];
  onArrowClick: (
    gameId: number,
    dir: BacklogItemMoveType,
    status: BacklogGame['status'],
  ) => void;
  moveToPosition: (gameId: number, newPosition: number) => void;
  index: number;
};

export const ReorderControl = ({
  firstRow,
  lastRow,
  gameId,
  status,
  onArrowClick,
  moveToPosition,
  index,
}: ReorderControlProps) => {
  const [position, setPosition] = useState(index);

  useEffect(() => {
    setPosition(index);
  }, [index]);

  const onChange = (value: string) => {
    if (value === '') {
      return;
    }

    const valueAsNumber = parseInt(value, 10);

    setPosition(isNaN(valueAsNumber) ? index : valueAsNumber);
  };

  const onSubmitPosition = () => {
    if (position === index) {
      return;
    }

    moveToPosition(gameId, position);
  };

  return (
    <Flex alignItems="center" gap={2} pr="10px">
      <Input
        type="number"
        value={position}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.code === 'Enter') {
            onSubmitPosition();
          }
        }}
        onBlur={onSubmitPosition}
        minW="35px"
        px="4px"
        textAlign="center"
        sx={{
          '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
            display: 'none',
          },
          '&[type=number]': {
            MozAppearance: 'textfield',
          },
        }}
      />
      <Flex h="100%" flexDir="column" justifyContent="center" display="block">
        <Box
          color={firstRow ? 'gray.700' : 'gray.500'}
          _hover={firstRow ? undefined : { color: 'gray.300' }}
          mb={1}
          onClick={
            firstRow
              ? undefined
              : () => onArrowClick(gameId, BacklogItemMoveType.UP, status)
          }
          cursor={firstRow ? 'not-allowed' : 'pointer'}
          w="fit-content"
        >
          <ArrowUpIcon boxSize="24px" />
        </Box>
        <Box
          color={lastRow ? 'gray.700' : 'gray.500'}
          _hover={lastRow ? undefined : { color: 'gray.300' }}
          mt={1}
          onClick={
            lastRow
              ? undefined
              : () => onArrowClick(gameId, BacklogItemMoveType.DOWN, status)
          }
          cursor={lastRow ? 'not-allowed' : 'pointer'}
          w="fit-content"
        >
          <ArrowDownIcon boxSize="24px" />
        </Box>
      </Flex>
    </Flex>
  );
};
