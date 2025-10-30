import { Flex } from '@chakra-ui/react';

import {
  CardsToGoldType,
  CardWithFusionDependencies,
  ProfileType,
} from '~/lundprod/utils/types';

import { CardToGoldList } from './card-to-gold-list';
import { FusionList } from './fusion-list';
import { InventoryList } from './inventory-list';

type GachaTabProps = {
  profile: ProfileType;
  cardsToGold: CardsToGoldType;
  fusions: CardWithFusionDependencies[];
};

export const GachaTab = ({ profile, cardsToGold, fusions }: GachaTabProps) => {
  if (!profile.player) {
    return null;
  }

  return (
    <Flex flexWrap="wrap" w="100%" justifyContent="center" gap={10} pt="20px">
      <InventoryList
        width={{ base: '100%', md: 'calc(50% - var(--chakra-space-10))' }}
        profile={profile}
      />
      <CardToGoldList
        width={{ base: '100%', md: 'calc(50% - var(--chakra-space-10))' }}
        cardsToGold={cardsToGold}
      />
      <FusionList
        width={{ base: '100%', md: 'calc(50% - var(--chakra-space-10))' }}
        fusionCards={fusions}
      />
    </Flex>
  );
};
