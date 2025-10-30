import { t } from './trpc';

export type TServer = typeof t;

export type TMiddleware = Parameters<TServer['middleware']>[0];

export enum SortType {
  ALPHABETICAL_ORDER = 'ALPHABETICAL_ORDER',
  DATE_ORDER = 'DATE_ORDER',
}

export enum BacklogItemMoveType {
  UP = 'UP',
  DOWN = 'DOWN',
}

export const MAX_NOTE_SIZE = 255;
