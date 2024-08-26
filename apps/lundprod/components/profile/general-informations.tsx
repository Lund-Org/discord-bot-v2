import { Box, Divider, Heading, Text } from '@chakra-ui/react';
import { RankByUser } from '@discord-bot-v2/common';
import styled from '@emotion/styled';
import Link from 'next/link';
import { Trans, useTranslation } from 'react-i18next';

import { formatDate } from '~/lundprod/utils/dates';
import { ProfileType } from '~/lundprod/utils/types';

type GeneralInformationProps = {
  profile: ProfileType;
  rank: RankByUser | null;
};

const CustomText = styled(Text)`
  margin-top: 1em;
  margin-bottom: 1em;
  font-size: 16px;
`;

export const GeneralInformation = ({
  profile,
  rank,
}: GeneralInformationProps) => {
  const { t } = useTranslation();
  const playerInformations = profile.player ? (
    <>
      <CustomText>
        {t('profile.points', { points: profile.player.points })}
      </CustomText>
      {rank && (
        <CustomText>
          {t('profile.level', { level: rank.level.currentLevel })}
        </CustomText>
      )}
      {rank && (
        <CustomText>{t('profile.rank', { rank: rank.position })}</CustomText>
      )}
      {rank && (
        <CustomText>{t('profile.xp', { xp: rank.currentXP })}</CustomText>
      )}
      {rank && (
        <CustomText>
          {t('profile.xpToNextLevel', { xp: rank.level.xpNextLevel })}
        </CustomText>
      )}
      <CustomText>
        {t('profile.join', {
          date: formatDate(t, new Date(profile.player.joinDate)),
        })}
      </CustomText>
      {profile.player.lastDailyDraw ? (
        <CustomText>
          {t('profile.lastDraw', {
            date: formatDate(t, new Date(profile.player.lastDailyDraw)),
          })}
        </CustomText>
      ) : null}
    </>
  ) : null;

  return (
    <Box>
      <Heading>{profile.username}</Heading>
      {profile.twitchUsername && (
        <Text as="span" fontSize="13px">
          <Trans
            i18nKey="profile.onTwitch"
            values={{ username: profile.twitchUsername }}
            components={{
              twitchLink: (
                <Link
                  href={`https://twitch.tv/${profile.twitchUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              ),
            }}
          />
        </Text>
      )}
      <Divider my={2} borderBottomWidth="2px" />
      {playerInformations}
    </Box>
  );
};
