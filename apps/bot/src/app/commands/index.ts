import { birthdayResponse } from './birthday';
import { gachaButtonResponse, gachaMenuResponse, gachaResponse } from './gacha';
import { googleResponse } from './google';
import { howlongtobeatResponse } from './howlongtobeat';
import { joinResponse } from './join';
import { pingResponse } from './ping';
import { pollResponse } from './poll';
import { pongResponse } from './pong';
import { ppResponse } from './pp';
import { shifumiResponse } from './shifumi';
import { sportResponse } from './sport';

export const commandsResponses = [
  birthdayResponse,
  gachaResponse,
  googleResponse,
  howlongtobeatResponse,
  joinResponse,
  pingResponse,
  pongResponse,
  pollResponse,
  ppResponse,
  shifumiResponse,
  sportResponse,
];

export const menusCallback = [gachaMenuResponse];

export const buttonsCallback = [gachaButtonResponse];
