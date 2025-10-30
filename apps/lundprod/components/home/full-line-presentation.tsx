import {
  Box,
  Divider,
  Flex,
  Heading,
  Image,
  useBreakpointValue,
} from '@chakra-ui/react';
import { ReactNode, useMemo } from 'react';

type FullLinePresentationProps = {
  children: ReactNode;
  theme: 'light' | 'dark';
  title: string;
  illustration: { src: string };
  illustrationPosition: 'left' | 'right';
};

export const FullLinePresentation = ({
  children,
  theme,
  title,
  illustration,
  illustrationPosition,
}: FullLinePresentationProps) => {
  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });
  const illustrationComponent = useMemo(
    () => (
      <Image
        src={illustration.src}
        alt={title}
        w="100%"
        maxW={{ base: '330px', md: '500px' }}
        m="auto"
      />
    ),
    [illustration, title]
  );
  const description = useMemo(
    () => (
      <>
        <Heading color={theme === 'light' ? 'orange.600' : 'orange.300'}>
          {title}
        </Heading>
        <Divider
          mb={10}
          borderColor={theme === 'light' ? 'gray.900' : 'gray.100'}
        />
        {isMobile && illustrationComponent}
        {children}
      </>
    ),
    [isMobile, theme, title, illustrationComponent, children]
  );

  return (
    <Box
      w="100%"
      bg={theme === 'light' ? 'gray.100' : 'gray.800'}
      color={theme === 'light' ? 'gray.800' : 'gray.100'}
      py="30px"
    >
      <Box maxW="1200px" m="auto">
        <Flex alignItems={{ base: 'initial', md: 'center' }}>
          {illustrationPosition === 'left' ? (
            <>
              {!isMobile && (
                <Flex w="50%" maxW="500px">
                  {illustrationComponent}
                </Flex>
              )}
              <Box w={{ base: '100%', md: '50%' }} mb="0px" px="20px" ml="auto">
                {description}
              </Box>
            </>
          ) : (
            <>
              <Box w={{ base: '100%', md: '50%' }} mb="0px" px="20px">
                {description}
              </Box>
              {!isMobile && (
                <Flex w="50%" maxW="500px" ml="auto">
                  {illustrationComponent}
                </Flex>
              )}
            </>
          )}
        </Flex>
      </Box>
    </Box>
  );
};
