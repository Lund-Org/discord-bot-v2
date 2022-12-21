import { Box, Divider, Heading, Text } from '@chakra-ui/react';
import { RankByUser } from '@discord-bot-v2/common';
import styled from '@emotion/styled';
import Link from 'next/link';
import { formatDate, formatDateTime } from '../../../utils/dates';
import { ProfileType } from '../../../utils/types';

type GeneralInformationProps = {
  profile: ProfileType;
  rank: RankByUser;
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
  return (
    <Box>
      <Heading>{profile.username}</Heading>
      {profile.twitchUsername && (
        <Text as="span" fontSize="13px">
          Ou&nbsp;
          <Link
            href={`https://twitch.tv/${profile.twitchUsername}`}
            target="_blank"
            rel="noreferrer"
          >
            {profile.twitchUsername}
          </Link>
          &nbsp;sur Twitch
        </Text>
      )}
      <Divider my={2} borderBottomWidth="2px" />
      <CustomText>Points actuels : {profile.points}</CustomText>
      <CustomText>Niveau actuel : {rank.level.currentLevel}</CustomText>
      <CustomText>Rang actuel : {rank.position}</CustomText>
      <CustomText>XP actuelle : {rank.currentXP}</CustomText>
      <CustomText>XP du prochain niveau : {rank.level.xpNextLevel}</CustomText>
      <CustomText>
        A rejoint le Discord le {formatDate(new Date(profile.joinDate))}
      </CustomText>
      {profile.lastDailyDraw ? (
        <CustomText>
          Dernier tirage de carte le{' '}
          {formatDateTime(new Date(profile.lastDailyDraw))}
        </CustomText>
      ) : null}
    </Box>
  );
};
