import { Box, Flex, Heading } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { SocialNetworkCard } from '../components/home/social-network-card';
import { NetworkKey, networks } from '../utils/url';
import { useGetSocialNetworkCategoryName } from '../hooks/use-get-social-network-category-name';

export function Contact() {
  const { t } = useTranslation();

  return (
    <Box maxW="1200px" p="30px" m="auto">
      <Flex direction="column" gap={2}>
        <Heading variant="h3">{t('contact.networkTitle')}</Heading>
        <IconList networkKey="global" />
        <IconList networkKey="lundprod" />
        <IconList networkKey="lundprodGameDev" />
      </Flex>
    </Box>
  );
}

export default Contact;

const IconList = ({ networkKey }: { networkKey: NetworkKey }) => {
  const label = useGetSocialNetworkCategoryName(networkKey);

  return (
    <Box mb={8}>
      <Heading variant="h6" w={{ base: '100%', md: 'fit-content' }}>
        {label}
      </Heading>
      <Flex flexWrap="wrap" gap={3} alignItems="center">
        {networks[networkKey].map((network, index) => (
          <SocialNetworkCard key={index} {...network} />
        ))}
      </Flex>
    </Box>
  );
};
