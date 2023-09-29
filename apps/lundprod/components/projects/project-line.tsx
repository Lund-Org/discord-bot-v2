import {
  AspectRatio,
  Box,
  chakra,
  Flex,
  Heading,
  Text,
  useBoolean,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useMemo } from 'react';

import { DoubleArrowIcon } from '../icons/double-arrow';

type ProjectLineProps = {
  mode: 'light' | 'dark';
  label: string;
  to?: string;
  newTab?: boolean;
  description: string;
  bgImg: string;
  date: string;
};

export const ProjectLine = ({
  mode,
  label,
  to,
  bgImg,
  description,
  newTab,
  date,
}: ProjectLineProps) => {
  const [overLine, setOverLine] = useBoolean(false);
  const style =
    mode === 'light'
      ? {
          bg: 'gray.100',
          color: 'gray.800',
        }
      : {
          bg: 'gray.700',
          color: 'gray.100',
        };
  const Wrapper = useMemo(() => (to ? chakra(Link) : Box), [to]);

  return (
    <Wrapper
      {...(to && { href: to, ...(newTab && { target: '_blank' }) })}
      w="100%"
      display="block"
      {...style}
      onMouseEnter={() => setOverLine.on()}
      onMouseLeave={() => setOverLine.off()}
      position="relative"
      overflow="hidden"
      borderTop="2px solid black"
      borderBottom="2px solid black"
    >
      <AspectRatio
        ratio={1000 / 200}
        w="100%"
        maxW="1000"
        overflow="hidden"
        mx="auto"
        {...style}
      >
        <Box
          p={{ base: '5px', sm: '10px', md: '20px' }}
          justifyContent="unset !important"
          alignItems="unset !important"
          display="block !important"
          bgImage={`url('${bgImg}')`}
          bgSize="cover"
        >
          <Flex gap={1} alignItems="center" mb="2%">
            {to && (
              <Box
                opacity={0.75}
                position="relative"
                pr="10px"
                {...(overLine && {
                  animation:
                    '0.8s linear 0s infinite alternate none running slidein',
                })}
              >
                <DoubleArrowIcon
                  boxSize={{ base: 6, sm: 7, md: 8 }}
                  color={style.color}
                />
              </Box>
            )}
            <Heading
              fontSize={{ base: '1em', sm: '1.5em', md: '2em', lg: '2.5em' }}
              color="inherit"
            >
              {label}
            </Heading>
          </Flex>
          <Text
            fontSize={{ base: '.75em', sm: '1em', md: '1.25em', lg: '1.5em' }}
            lineHeight={{
              base: '.95em',
              sm: '1.2em',
              md: '1.45em',
              lg: '1.7em',
            }}
            maxW="30%"
          >
            {description}
          </Text>
          <Text
            as="span"
            fontSize={{ base: '.75em', sm: '.8em', md: '1em' }}
            p="3px 5px"
            background="blackAlpha.800"
            color="white"
            position="absolute"
            top={0}
            right={0}
          >
            {date}
          </Text>
        </Box>
      </AspectRatio>
    </Wrapper>
  );
};
