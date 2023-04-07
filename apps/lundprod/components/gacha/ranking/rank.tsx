import { Box, BoxProps, Flex, Text } from '@chakra-ui/react';
import Link from 'next/link';

import { Rank as RankType } from '~/lundprod/utils/types';
import { getUserProfileUrl } from '~/lundprod/utils/url';

type RankProps = {
  rank: RankType;
  level: number;
};

export const Rank = ({ rank, level }: RankProps) => {
  const getRankStyle = (): BoxProps => {
    switch (level) {
      case 1:
        return {
          width: '200px',
          height: '200px',
          fontSize: '18px',
          borderColor: 'gold',
          background: 'rgba(255, 215, 0, 0.3)',
        };
      case 2:
        return {
          width: '180px',
          height: '180px',
          fontSize: '16px',
          borderColor: 'silver',
          background: 'rgba(192, 192, 192, 0.3)',
        };
      default:
        return {
          width: '160px',
          height: '160px',
          fontSize: '14px',
          borderColor: 'brown',
          background: 'rgba(165, 42, 42, 0.3)',
        };
    }
  };
  const getMedal = () => {
    switch (level) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      default:
        return '🥉';
    }
  };

  return (
    <Flex
      borderRadius="100px"
      border="3px solid white"
      textAlign="center"
      flexDirection="column"
      justifyContent="center"
      margin="15px auto"
      {...getRankStyle()}
    >
      <Box fontSize="3em">{getMedal()}</Box>
      <Text fontWeight="bold" _hover={{ color: 'blue.300' }}>
        <Link href={getUserProfileUrl(rank.discordId)}>{rank.username}</Link>
      </Text>
      <Text>Niveau : {rank.level.currentLevel}</Text>
      <Text>XP : {rank.currentXP}</Text>
    </Flex>
  );
};
