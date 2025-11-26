import { Box, Divider, Flex, Text } from '@chakra-ui/react';

import {
  CardsToGoldType,
  CardWithFusionDependencies,
  ProfileType,
} from '~/lundprod/utils/types';

import { GachaCardToGoldList } from './gacha-card-to-gold-list';
import { GachaFusionList } from './gacha-fusion-list';
import { GachaInventoryList } from './gacha-inventory-list';
import { useTranslation } from 'react-i18next';
import { formatDate } from '~/lundprod/utils/dates';
import { RankByUser } from '@discord-bot-v2/common';

type GachaTabProps = {
  profile: ProfileType;
  cardsToGold: CardsToGoldType;
  fusions: CardWithFusionDependencies[];
  rank: RankByUser | null;
};

export const GachaView = ({
  profile,
  cardsToGold,
  fusions,
  rank,
}: GachaTabProps) => {
  const { t } = useTranslation();

  if (!profile.player) {
    return null;
  }

  return (
    <Box>
      {rank && (
        <Box lineHeight="30px" mb="24px">
          <Text>
            {t('profile.gacha.level', { level: rank.level.currentLevel })}
          </Text>
          <Text>{t('profile.gacha.rank', { rank: rank.position })}</Text>
          <Text>{t('profile.gacha.xp', { xp: rank.currentXP })}</Text>
          <Text>
            {t('profile.gacha.xpToNextLevel', { xp: rank.level.xpNextLevel })}
          </Text>
          <Text>
            {t('profile.gacha.points', { points: profile.player.points })}
          </Text>
          <Divider w="200px" my="16px" />
          <Text>
            {t('profile.gacha.join', {
              date: formatDate(t, new Date(profile.player.joinDate)),
            })}
          </Text>
          {profile.player.lastDailyDraw ? (
            <Text>
              {t('profile.gacha.lastDraw', {
                date: formatDate(t, new Date(profile.player.lastDailyDraw)),
              })}
            </Text>
          ) : null}
        </Box>
      )}
      <Flex flexWrap="wrap" w="100%" justifyContent="center" gap={10} pt="20px">
        <GachaInventoryList
          width={{ base: '100%', md: 'calc(50% - var(--chakra-space-5))' }}
          profile={profile}
        />
        <GachaCardToGoldList
          width={{ base: '100%', md: 'calc(50% - var(--chakra-space-5))' }}
          cardsToGold={cardsToGold}
        />
        <GachaFusionList
          width={{ base: '100%', md: 'calc(50% - var(--chakra-space-10))' }}
          fusionCards={fusions}
        />
      </Flex>
    </Box>
  );
};
