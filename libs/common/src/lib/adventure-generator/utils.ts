import { Facing, FACING_TO_MOD } from './constants';
import { Rectangle } from './rectangle';
import { Vector } from './type';

type Callback = (param: [number, number]) => void;

export function iter_adjacent([x, y]: Vector, cb: Callback) {
  cb([x - 1, y]);
  cb([x, y - 1]);
  cb([x + 1, y]);
  cb([x, y + 1]);
}

export function iter_2d(size: Vector, callback: Callback) {
  for (let y = 0; y < size[1]; y++) {
    for (let x = 0; x < size[0]; x++) {
      callback([x, y]);
    }
  }
}

export function iter_range(from: Vector, to: Vector, callback: Callback) {
  let [fx, fy, tx, ty] = [0, 0, 0, 0];

  if (from[0] < to[0]) {
    fx = from[0];
    tx = to[0];
  } else {
    fx = to[0];
    tx = from[0];
  }

  if (from[1] < to[1]) {
    fy = from[1];
    ty = to[1];
  } else {
    fy = to[1];
    ty = from[1];
  }

  for (let x = fx; x <= tx; x++) {
    for (let y = fy; y <= ty; y++) {
      callback([x, y]);
    }
  }
}

export function intersects(
  pos_1: Vector,
  size_1: Vector,
  pos_2: Vector,
  size_2: Vector,
) {
  const rect1 = new Rectangle(...pos_1, ...size_1);
  const rect2 = new Rectangle(...pos_2, ...size_2);

  return rect1.intersects(rect2);
}

export function array_test<T>(array: Array<T>, test: (data: T) => boolean) {
  for (let i = 0; i < array.length; i++) {
    if (test(array[i])) {
      return true;
    }
  }
  return false;
}

export function add(p1: Vector, p2: Vector): Vector {
  return [p1[0] + p2[0], p1[1] + p2[1]];
}

export function shift(pos: Vector, facing: Facing) {
  return add(pos, FACING_TO_MOD[facing]);
}

export function shift_left(pos: Vector, facing: Facing) {
  return shift(pos, ((facing - 90 + 360) % 360) as Facing);
}

export function shift_right(pos: Vector, facing: Facing) {
  return shift(pos, ((facing + 90 + 360) % 360) as Facing);
}
