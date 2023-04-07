import { Card, CardBody, Heading, Image } from '@chakra-ui/react';
import styled from '@emotion/styled';
import Link from 'next/link';

type SocialNetworkCardProps = {
  imgSrc: string;
  title: string;
  url: string;
};

const StyledLink = styled(Link)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

export const SocialNetworkCard = ({
  imgSrc,
  title,
  url,
}: SocialNetworkCardProps) => {
  return (
    <Card
      w={{ base: '8rem', md: '10rem' }}
      h="100%"
      m="auto"
      _hover={{ bg: 'gray.900' }}
      textAlign="center"
    >
      <CardBody color="gray.200">
        <StyledLink href={url} target="_blank" rel="noreferrer noopener">
          <Image src={imgSrc} alt={title} />
          <Heading fontSize={{ base: 'md', md: '3xl' }}>{title}</Heading>
        </StyledLink>
      </CardBody>
    </Card>
  );
};
