import { SmallCloseIcon, StarIcon } from '@chakra-ui/icons';
import { Box, Flex, IconButton, Image, Text } from '@chakra-ui/react';
import { FieldArrayWithId } from 'react-hook-form';
import { AwardForm } from '~/lundprod/types/awards';

type AwardGameProps = {
  game: FieldArrayWithId<AwardForm, 'awards.0.games', 'id'>;
  onDelete: VoidFunction;
  isBest: boolean;
  onClick: (value: boolean) => void;
};

export const AwardGame = ({
  game,
  onDelete,
  isBest,
  onClick,
}: AwardGameProps) => {
  return (
    <Box position="relative" role="group">
      <IconButton
        onClick={onDelete}
        _groupHover={{
          display: 'inline-flex',
        }}
        display="none"
        icon={<SmallCloseIcon color="black" />}
        aria-label={''}
        position="absolute"
        top={0}
        right={0}
        boxSize={4}
        variant="ghost"
        borderRadius={20}
        bg="whitesmoke"
        p="2px"
        w="fit-content"
        transform="translate(50%, -50%)"
        minW="fit-content"
      />
      <Flex
        onClick={() => onClick(!isBest)}
        flexDir="column"
        justifyContent="center"
        p="8px"
        border="1px solid"
        borderColor={isBest ? 'orange.300' : 'blue.700'}
        bg={isBest ? 'orange.500' : 'blue.900'}
        borderRadius={4}
        cursor="pointer"
      >
        <Image src={game.image} maxW="50px" mx="auto" />
        <Text color={isBest ? 'black' : 'white'}>{game.label}</Text>
      </Flex>
      {isBest && (
        <Flex mt="5px" gap={2} alignItems="center" justifyContent="center">
          <StarIcon color="gold" />
          <Text>Winner</Text>
        </Flex>
      )}
    </Box>
  );
};
