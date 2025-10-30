import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Box,
  Divider,
  Flex,
  Image,
  Select,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import styled from '@emotion/styled';

import { NetworkKey, networks } from '~/lundprod/utils/url';

import { LightStyledLink } from '../styled-link';
import { useGetSocialNetworkCategoryName } from '~/lundprod/hooks/use-get-social-network-category-name';
import { supportedLanguages } from '@discord-bot-v2/translation';
import { useTranslation } from 'react-i18next';

type NetworkElement = (typeof networks)[NetworkKey][number];

const InlineStyledLink = styled(LightStyledLink)`
  display: inline-block;
`;

export const Footer = () => {
  const {
    t,
    i18n: { language, changeLanguage },
  } = useTranslation();
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box w="100%" bg="blackAlpha.600" position="relative">
      <Box
        maxW="1200px"
        m="auto"
        p="30px"
        pb={{ base: '50px', md: '30px' }}
        textAlign="center"
        w="fit-content"
      >
        <Box
          gap={2}
          justifyContent="center"
          alignItems="stretch"
          display={{ base: 'block', md: 'flex' }}
        >
          {[
            { category: 'global', networks: networks.global },
            { category: 'divider', networks: [] },
            { category: 'lundprod', networks: networks.lundprod },
            { category: 'divider', networks: [] },
            { category: 'lundprodGameDev', networks: networks.lundprodGameDev },
          ].map(
            (
              networkBlock: {
                category: NetworkKey | 'divider';
                networks: NetworkElement[];
              },
              index,
            ) => (
              <Box key={index}>
                {networkBlock.category === 'divider' ? (
                  <Divider
                    orientation="vertical"
                    h="100%"
                    w="1px"
                    display={isMobile ? 'none' : 'block'}
                  />
                ) : (
                  <FooterSocial
                    category={networkBlock.category}
                    networks={networkBlock.networks}
                  />
                )}
              </Box>
            ),
          )}
        </Box>

        <Text fontSize="10px" mt="15px">
          Site fonctionnant avec&nbsp;
          <InlineStyledLink
            href="https://nextjs.org/"
            target="_blank"
            rel="noreferrer noopener"
          >
            <Text as="span">Next</Text>
            <ExternalLinkIcon ml="6px" />
          </InlineStyledLink>
          &nbsp; avec les illustrations de&nbsp;
          <InlineStyledLink
            href="https://undraw.co/"
            target="_blank"
            rel="noreferrer noopener"
          >
            <Text as="span">Undraw</Text>
            <ExternalLinkIcon ml="6px" />
          </InlineStyledLink>
        </Text>
      </Box>
      {/* Todo : uncomment when hydration handled */}
      {/* <Box
        position="absolute"
        bottom={3}
        right={{ base: '50%', md: 3 }}
        transform={{ base: 'translateX(50%)', md: 'translateX(0%)' }}
      >
        <Select
          className="filter-stars"
          value={language}
          onChange={(e) => changeLanguage(e.target.value)}
          w="fit-content"
          size="xs"
        >
          <option value={supportedLanguages.fr}>{t('language.fr')}</option>
          <option value={supportedLanguages.en}>{t('language.en')}</option>
        </Select>
      </Box> */}
    </Box>
  );
};

const FooterSocial = ({
  category,
  networks,
}: {
  category: NetworkKey;
  networks: NetworkElement[];
}) => {
  const categoryLabel = useGetSocialNetworkCategoryName(category);

  return (
    <Box mb={{ base: 2, md: 0 }}>
      <Text mb={1} fontSize="12px" fontWeight="bold">
        {categoryLabel}
      </Text>
      <Flex
        gap={{ base: 3, md: 1 }}
        justifyContent={{ base: 'center', md: 'space-evenly' }}
      >
        {networks.map((network) => (
          <LightStyledLink
            key={network.url}
            href={network.url}
            target="_blank"
            rel="noreferrer noopener"
          >
            <Image src={network.imgSrc} alt={network.title} h="20px" />
          </LightStyledLink>
        ))}
      </Flex>
    </Box>
  );
};
