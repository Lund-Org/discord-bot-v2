import { Box, ChakraProvider, Flex } from '@chakra-ui/react';
import { css, Global } from '@emotion/react';
import { MDXProvider } from '@mdx-js/react';
import { withTRPC } from '@trpc/next';
import { AppProps, AppType } from 'next/app';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';

import { Header } from '../components/header';
import { components } from '../components/mdx-components';
import { theme } from '../theme';
import Script from 'next/script';
import { Footer } from '../components/home/footer';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { getI18nInstance } from '../i18n';
import { I18nextProvider } from 'react-i18next';
import { MENU_HEIGHT } from '../utils/constants';
import { trpc } from '../utils/trpc';

const CustomApp: AppType = ({ Component, pageProps }: AppProps) => {
  const globalCSS = css`
    html {
      min-width: 360px;
    }

    .filter-stars option {
      background: var(--chakra-colors-gray-600) !important;
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

  const { query, locale } = useRouter();

  const i18nInstance = useMemo(() => {
    // TODO: handle hydration

    // const propsLanguage = pageProps.language;
    // const localStorageLanguage = (
    //   typeof window !== 'undefined' ? window : {}
    // )?.localStorage?.getItem('i18nextLng');
    // const queryLanguage = query.language
    //   ? Array.isArray(query.language)
    //     ? query.language[0]
    //     : query.language
    //   : undefined;

    // const languageToUse =
    //   propsLanguage || localStorageLanguage || locale || queryLanguage;

    return getI18nInstance(/*languageToUse*/);
  }, [locale, query.language, pageProps.language]);

  return (
    <>
      <Head>
        <title>LundProd</title>
      </Head>
      <main>
        <SessionProvider session={pageProps.session}>
          <MDXProvider components={components}>
            <I18nextProvider i18n={i18nInstance}>
              <ChakraProvider theme={theme}>
                <Global styles={globalCSS} />
                <Flex
                  minH="100vh"
                  flexDir="column"
                  position="relative"
                  pt={MENU_HEIGHT}
                >
                  <Header />
                  <Flex
                    flex={1}
                    bg="gray.800"
                    color="gray.100"
                    flexDir="column"
                  >
                    <Box flex={1} w="100%">
                      <Component {...pageProps} />
                    </Box>
                    <Footer />
                  </Flex>
                </Flex>
              </ChakraProvider>
            </I18nextProvider>
          </MDXProvider>
        </SessionProvider>
      </main>
      {!!process.env.NX_GOOGLE_ANALYTICS_ID && (
        <>
          {/* Google tag (gtag.js) */}
          <Script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NX_GOOGLE_ANALYTICS_ID}`}
          />
          <Script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', '${process.env.NX_GOOGLE_ANALYTICS_ID}');`,
            }}
          />
        </>
      )}
    </>
  );
};

export default trpc.withTRPC(CustomApp);
