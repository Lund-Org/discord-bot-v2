import { ArrayElement } from '../types';
import { Vector } from './type';

export const TOP = 0;
export const RIGHT = 90;
export const BOTTOM = 180;
export const LEFT = 270;

export const FACING = [TOP, RIGHT, BOTTOM, LEFT] as const;
export type Facing = ArrayElement<typeof FACING>;

export const FACING_TO_STRING: Record<Facing, string> = {
  [TOP]: 'top',
  [RIGHT]: 'right',
  [BOTTOM]: 'bottom',
  [LEFT]: 'left',
};

export const FACING_TO_MOD: Record<Facing, Vector> = {
  [TOP]: [0, -1],
  [RIGHT]: [1, 0],
  [BOTTOM]: [0, 1],
  [LEFT]: [-1, 0],
};

export const FACING_INVERSE: Record<Facing, Facing> = {
  [TOP]: BOTTOM,
  [RIGHT]: LEFT,
  [BOTTOM]: TOP,
  [LEFT]: RIGHT,
};

export const FACING_MOD_RIGHT: Record<Facing, Facing> = {
  [TOP]: RIGHT,
  [RIGHT]: BOTTOM,
  [BOTTOM]: LEFT,
  [LEFT]: TOP,
};

export const FACING_MOD_LEFT: Record<Facing, Facing> = {
  [TOP]: LEFT,
  [RIGHT]: TOP,
  [BOTTOM]: RIGHT,
  [LEFT]: BOTTOM,
};
