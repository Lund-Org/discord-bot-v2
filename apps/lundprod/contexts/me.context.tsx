import { ArrayElement } from '@discord-bot-v2/common';
import { keepPreviousData } from '@tanstack/react-query';

import { createContext, ReactNode, useContext, useMemo } from 'react';
import { groupBy } from 'lodash';
import z from 'zod';

import { trpc } from '../utils/trpc';
import { backlogItemSchema } from '../server/common-schema';
import type { BacklogStatus } from '@prisma/client';

export type BacklogGame = z.infer<typeof backlogItemSchema>;

//-- Types
type MeProvider = {
  backlog: BacklogGame[];
  backlogByStatus: Partial<Record<BacklogStatus, BacklogGame[]>>;
};

type MeProps = {
  children: ReactNode;
};

//-- Context declaration

export const Me = createContext<MeProvider>({
  backlog: [],
  backlogByStatus: {},
});

export const useMe = (): MeProvider => useContext(Me);

//-- Exposed Provider
export const BacklogProvider = ({ children }: MeProps) => {
  const { data, isFetching } = trpc.getMyBacklog.useQuery(
    {},
    {
      placeholderData: keepPreviousData,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    },
  );

  const backlogByStatus = useMemo(
    () =>
      groupBy(data, 'status') as unknown as Partial<
        Record<BacklogStatus, BacklogGame[]>
      >,
    [],
  );

  return (
    <Me.Provider value={{ backlog: data || [], backlogByStatus }}>
      {children}
    </Me.Provider>
  );
};
