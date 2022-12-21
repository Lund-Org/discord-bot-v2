import { ListItem, OrderedList, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { Rank } from '../../../utils/types';
import { getGachaProfileUrl } from '../../../utils/url';

type RankListProps = {
  ranks: Rank[];
};

const RankList = ({ ranks }: RankListProps) => {
  return (
    <OrderedList start={4} pt="35px" pl={{ base: '35px', md: '0' }}>
      {ranks.map((rank) => (
        <ListItem className="ranklist-item" key={rank.id} pl="15px" pb="10px">
          <Link href={getGachaProfileUrl(rank.discordId)}>
            <Text as="span" fontWeight="bold" _hover={{ color: 'blue.500' }}>
              {rank.username}
            </Text>
          </Link>
          <Text as="span">
            , niveau {rank.level.currentLevel} avec {rank.currentXP}xp
          </Text>
        </ListItem>
      ))}
    </OrderedList>
  );
};

export default RankList;
