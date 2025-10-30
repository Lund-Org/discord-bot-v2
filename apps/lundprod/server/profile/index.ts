import { TServer } from '../types';
import {
  getBacklogProcedure,
  getMyBacklogProcedure,
} from './get-backlog.procedure';
import {
  getExpectedGamesProcedure,
  getMyExpectedGamesProcedure,
} from './get-expected-games.procedure';

export function getProfilesRouter(t: TServer) {
  return {
    getBacklog: getBacklogProcedure(t),
    getMyBacklog: getMyBacklogProcedure(t),
    getExpectedGames: getExpectedGamesProcedure(t),
    getMyExpectedGames: getMyExpectedGamesProcedure(t),
  };
}
