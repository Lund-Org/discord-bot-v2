import { Box, ChakraProvider, Flex } from '@chakra-ui/react';
import { css, Global } from '@emotion/react';
import { MDXProvider } from '@mdx-js/react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';

import { Header } from '../components/header';
import { components } from '../components/mdx-components';
import { theme } from '../theme';

function CustomApp({ Component, pageProps }: AppProps) {
  const globalCSS = css`
    html {
      min-width: 360px;
    }

    @keyframes slidein {
      0%,
      100% {
        left: 0;
      }
      50% {
        left: 10px;
      }
    }
  `;

  return (
    <>
      <Head>
        <title>LundProd</title>
      </Head>
      <main>
        <SessionProvider session={pageProps.session}>
          <MDXProvider components={components}>
            <ChakraProvider theme={theme}>
              <Global styles={globalCSS} />
              <Flex h="100vh" minH="100vh" flexDir="column">
                <Header />
                <Box flex={1} overflow="auto" bg="gray.800" color="gray.100">
                  <Component {...pageProps} />
                </Box>
              </Flex>
            </ChakraProvider>
          </MDXProvider>
        </SessionProvider>
      </main>
    </>
  );
}

export default CustomApp;
