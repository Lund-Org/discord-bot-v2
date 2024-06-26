import { ExternalLinkIcon } from '@chakra-ui/icons';
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
import styled from '@emotion/styled';

import { illustrationTrip } from '~/lundprod/assets';
import { networks } from '~/lundprod/utils/url';

import { LightStyledLink } from '../styled-link';

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
      <Box maxW="1200px" m="auto" p="30px" textAlign="center" w="fit-content">
        <Flex gap={2} justifyContent="center">
          {networks.map((network, index) => (
            <Box key={index}>
              <StyledLink
                href={network.url}
                target="_blank"
                rel="noreferrer noopener"
              >
                <Image src={network.imgSrc} alt={network.title} h="20px" />
              </StyledLink>
            </Box>
          ))}
        </Flex>

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
    </Box>
  );
};
