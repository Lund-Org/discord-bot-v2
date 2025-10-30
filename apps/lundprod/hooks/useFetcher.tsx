import { Text, useToast } from '@chakra-ui/react';
import Link from 'next/link';
import { useCallback, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';

export const useFetcher = () => {
  const { t } = useTranslation();
  const toast = useToast();

  const fetcher = useMemo(
    () =>
      (
        url: string,
        queryParams?: Record<string, unknown | unknown[]>,
        init?: RequestInit,
      ) => {
        const query = new URLSearchParams();

        if (queryParams) {
          Object.entries(queryParams).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              value.forEach((v) => query.append(key, String(v)));
            } else {
              query.append(key, String(value));
            }
          });
        }

        return fetch(`${url}?${query.toString()}`, init).then((response) => {
          if (response.ok) {
            return response.json();
          }

          if (response.status === 401) {
            toast({
              title: 'Erreur',
              description: (
                <Text>
                  <Trans
                    i18nKey="fetcher.unauthenticated"
                    components={{
                      signinLink: <Link href="/auth/signin" />,
                    }}
                  />
                </Text>
              ),
              status: 'error',
              duration: 9000,
              isClosable: true,
              position: 'bottom-left',
            });
          } else {
            toast({
              title: 'Erreur',
              description: t('fetcher.unknown'),
              status: 'error',
              duration: 9000,
              isClosable: true,
              position: 'bottom-left',
            });
          }

          return response.text().then((errorTxt) => {
            throw new Error(`The request failed\n${errorTxt}`);
          });
        });
      },
    [toast],
  );

  const get = useCallback(
    (url: string, queryParams?: Record<string, unknown | unknown[]>) => {
      return fetcher(url, queryParams, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    [fetcher],
  );

  const post = useCallback(
    (
      url: string,
      queryParams?: Record<string, unknown | unknown[]>,
      body?: BodyInit,
    ) => {
      return fetcher(url, queryParams, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });
    },
    [fetcher],
  );

  return { get, post };
};
