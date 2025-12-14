import { Box, Heading, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { Trans } from 'react-i18next';

import { ProfileType } from '~/lundprod/utils/types';

type GeneralInformationProps = {
  profile: ProfileType;
};

export const GeneralInformation = ({ profile }: GeneralInformationProps) => {
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
                  style={{ color: 'var(--chakra-colors-orange-300)' }}
                />
              ),
            }}
          />
        </Text>
      )}
    </Box>
  );
};
