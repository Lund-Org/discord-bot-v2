import { Card, CardBody, Heading, Image } from '@chakra-ui/react';
import Link from 'next/link';

type SocialNetworkCardProps = {
  imgSrc: string;
  title: string;
  url: string;
};

export const SocialNetworkCard = ({
  imgSrc,
  title,
  url,
}: SocialNetworkCardProps) => {
  return (
    <Link href={url} target="_blank" rel="noreferrer noopener">
      <Card
        bg="blackAlpha.100"
        _hover={{ bg: 'gray.900' }}
        textAlign="center"
        w={{ base: '100px', md: '120px' }}
        h={{ base: '100px', md: '120px' }}
      >
        <CardBody
          color="gray.200"
          display="flex"
          flexDir="column"
          gap={2}
          alignItems="center"
          justifyContent="space-between"
          p={3}
        >
          <Image
            src={imgSrc}
            alt={title}
            maxW={undefined}
            w={{ base: '45px', md: '60px' }}
            h={{ base: '45px', md: '60px' }}
          />
          <Heading fontSize={{ base: 'sm', md: 'md' }}>{title}</Heading>
        </CardBody>
      </Card>
    </Link>
  );
};
