import { birthdayResponse } from './birthday';
import { gachaButtonResponse, gachaMenuResponse, gachaResponse } from './gacha';
import { googleResponse } from './google';
import { howlongtobeatResponse } from './howlongtobeat';
import { joinResponse } from './join';
import { pingResponse } from './ping';
import { pollResponse } from './poll';
import { pongResponse } from './pong';
import { ppResponse } from './pp';
import { roll6Response, roll20Response, roll100Response } from './roll';
import { shifumiResponse } from './shifumi';

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
  roll6Response,
  roll20Response,
  roll100Response,
  shifumiResponse,
];

export const menusCallback = [gachaMenuResponse];

export const buttonsCallback = [gachaButtonResponse];
