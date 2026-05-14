import { Facing } from './constants';
import { Piece } from './piece';

export type Vector = [number, number];

export type Exit = [Vector, Facing] | [Vector, Facing, Piece];

export type RoomDefinition = {
  min_size: Vector;
  max_size: Vector;
  max_exits: number;
};
