import { TServer } from '../types';
import {
  getBacklogProcedure,
  getMyBacklogProcedure,
} from './get-backlog.procedure';

export function getProfilesRouter(t: TServer) {
  return {
    getBacklog: getBacklogProcedure(t),
    getMyBacklog: getMyBacklogProcedure(t),
  };
}
