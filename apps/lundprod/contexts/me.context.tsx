import { keepPreviousData } from '@tanstack/react-query';

import { createContext, ReactNode, useContext, useMemo } from 'react';
import { groupBy } from 'lodash';
import z from 'zod';

import { trpc } from '../utils/trpc';
import { backlogItemSchema, expectedGameSchema } from '../server/common-schema';
import type { BacklogStatus } from '@prisma/client';

export type BacklogGame = z.infer<typeof backlogItemSchema>;
export type ExpectedGame = z.infer<typeof expectedGameSchema>;

//-- Types
type MeProvider = {
  backlog: BacklogGame[];
  backlogByStatus: Partial<Record<BacklogStatus, BacklogGame[]>>;
  expectedGames: ExpectedGame[];
  isLoading: boolean;
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
});

export const useMe = (): MeProvider => useContext(MeContext);

//-- Exposed Provider
export const MeProvider = ({ children }: MeProps) => {
  const { data: backlog = [], isFetching: isFetchingBacklog } =
    trpc.getMyBacklog.useQuery(
      {},
      {
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
        staleTime: Infinity,
      },
    );
  const { data: expectedGames = [], isFetching: isFetchingExpectedGames } =
    trpc.getMyExpectedGames.useQuery(
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
      }}
    >
      {children}
    </MeContext.Provider>
  );
};
