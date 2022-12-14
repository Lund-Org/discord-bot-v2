import { Box, ChakraProvider, Flex } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { Header } from '../components/header';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to lundprod!</title>
      </Head>
      <main>
        <ChakraProvider>
          <Flex flexDir="column" minH="100vh">
            <Header />
            <Box flex={1} bg="gray.800" color="gray.100">
              <Component {...pageProps} />
            </Box>
          </Flex>
        </ChakraProvider>
      </main>
    </>
  );
}

export default CustomApp;
