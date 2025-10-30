import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../server/trpc';
import { createTRPCNext } from '@trpc/next';

function getBaseUrl() {
  return (
    process.env.WEBSITE_URL ||
    process.env.NX_PUBLIC_WEBSITE_URL ||
    'http://localhost:4200'
  );
}

export const trpc = createTRPCNext<AppRouter>({
  config(config) {
    return {
      links: [
        httpBatchLink({
          /**
           * If you want to use SSR, you need to use the server's full URL
           * @see https://trpc.io/docs/v11/ssr
           **/
          url: `${getBaseUrl()}/api/trpc`,
          // You can pass any HTTP headers you wish here
          async headers() {
            return {
              // authorization: getAuthCookie(),
            };
          },
        }),
      ],
    };
  },
  /**
   * @see https://trpc.io/docs/v11/ssr
   **/
  ssr: false,
});
