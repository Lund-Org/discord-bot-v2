import { TServer } from '../types';
import { getGamesProcedure } from './get-games.procedure';

export function getGamesRouter(t: TServer) {
  return {
    getGames: getGamesProcedure(t),
  };
}
