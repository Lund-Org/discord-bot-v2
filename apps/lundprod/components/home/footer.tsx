import {
  Box,
  Divider,
  Flex,
  Image,
  ListItem,
  Text,
  UnorderedList,
  useBreakpointValue,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import styled from '@emotion/styled';
import { illustrationTrip } from '../../assets';
import { networks } from '../../utils/url';
import { LightStyledLink } from './styled-link';

const InlineStyledLink = styled(LightStyledLink)`
  display: inline-block;
`;

const StyledLink = styled(LightStyledLink)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
`;

export const Footer = () => {
  const isMobile = !!useBreakpointValue({
    base: true,
    md: false,
  });

  return (
    <Box w="100%" bg="blackAlpha.600">
      <Flex
        h={{ base: 'auto', md: '200px' }}
        maxW="1200px"
        m="auto"
        p="30px"
        flexDirection={{ base: 'column', md: 'row' }}
      >
        <UnorderedList listStyleType="none">
          <ListItem>
            <StyledLink href="/">Accueil</StyledLink>
          </ListItem>
          <ListItem>
            <StyledLink href="/gacha">Gacha &gt; Liste</StyledLink>
          </ListItem>
          <ListItem>
            <StyledLink href="/gacha/ranking">Gacha &gt; Classement</StyledLink>
          </ListItem>
        </UnorderedList>
        <Divider
          orientation={isMobile ? 'horizontal' : 'vertical'}
          mx={{ base: 0, md: '60px' }}
          my={{ base: '30px', md: 0 }}
        />
        <UnorderedList listStyleType="none">
          {networks.map((network, index) => (
            <ListItem key={index}>
              <StyledLink
                href={network.url}
                target="_blank"
                rel="noreferrer noopener"
              >
                <Text as="span">{network.title}</Text>
                <ExternalLinkIcon ml="6px" />
              </StyledLink>
            </ListItem>
          ))}
        </UnorderedList>
        <Divider
          orientation={isMobile ? 'horizontal' : 'vertical'}
          mx={{ base: 0, md: '60px' }}
          my={{ base: '30px', md: 0 }}
        />
        <Flex flex={1}>
          <Flex
            flex={1}
            justifyContent={{ base: 'flex-end', md: 'space-between' }}
            alignItems={{ base: 'center', md: 'flex-end' }}
            flexDirection="column"
          >
            <Image
              src={illustrationTrip.src}
              alt="Good bye"
              ml="auto"
              maxH="100px"
            />
            <Text fontSize="10px" textAlign="right">
              Site fonctionnant avec{' '}
              <InlineStyledLink
                href="https://nextjs.org/"
                target="_blank"
                rel="noreferrer noopener"
              >
                <Text as="span">Next</Text>
                <ExternalLinkIcon ml="6px" />
              </InlineStyledLink>{' '}
              avec les illustrations de{' '}
              <InlineStyledLink
                href="https://undraw.co/"
                target="_blank"
                rel="noreferrer noopener"
              >
                <Text as="span">Undraw</Text>
                <ExternalLinkIcon ml="6px" />
              </InlineStyledLink>
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};
