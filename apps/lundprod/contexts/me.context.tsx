import type { BacklogStatus } from '@prisma/client';
import { keepPreviousData } from '@tanstack/react-query';
import { groupBy } from 'lodash';
import { createContext, ReactNode, useContext, useMemo } from 'react';
import z from 'zod';

import { backlogItemSchema, expectedGameSchema } from '../server/common-schema';
import { trpc } from '../utils/trpc';

export type BacklogGame = z.infer<typeof backlogItemSchema>;
export type ExpectedGame = z.infer<typeof expectedGameSchema>;

//-- Types
type MeProvider = {
  backlog: BacklogGame[];
  backlogByStatus: Partial<Record<BacklogStatus, BacklogGame[]>>;
  expectedGames: ExpectedGame[];
  isLoading: boolean;
  isInitialLoading: boolean;
};

type MeProps = {
  children: ReactNode;
};

//-- Context declaration

export const MeContext = createContext<MeProvider>({
  backlog: [],
  backlogByStatus: {},
  expectedGames: [],
  isLoading: true,
  isInitialLoading: true,
});

export const useMe = (): MeProvider => useContext(MeContext);

//-- Exposed Provider
export const MeProvider = ({ children }: MeProps) => {
  const {
    data: backlog = [],
    isFetching: isFetchingBacklog,
    isLoading: isInitialLoadingBacklog,
  } = trpc.getMyBacklog.useQuery(
    {},
    {
      placeholderData: keepPreviousData,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    },
  );
  const {
    data: expectedGames = [],
    isFetching: isFetchingExpectedGames,
    isLoading: isInitialLoadingExpectedGames,
  } = trpc.getMyExpectedGames.useQuery(
    {},
    {
      placeholderData: keepPreviousData,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    },
  );

  const backlogByStatus = useMemo(
    () =>
      groupBy(backlog, 'status') as unknown as Partial<
        Record<BacklogStatus, BacklogGame[]>
      >,
    [backlog],
  );

  return (
    <MeContext.Provider
      value={{
        backlog,
        backlogByStatus,
        expectedGames,
        isLoading: isFetchingBacklog || isFetchingExpectedGames,
        isInitialLoading:
          isInitialLoadingBacklog || isInitialLoadingExpectedGames,
      }}
    >
      {children}
    </MeContext.Provider>
  );
};
