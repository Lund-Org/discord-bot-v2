import { t } from './trpc';

export type TServer = typeof t;

export type TMiddleware = Parameters<TServer['middleware']>[0];
