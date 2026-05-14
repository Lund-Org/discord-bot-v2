import { Vector } from './type';

export class Array2d {
  rows: Array<Array<boolean>>;

  constructor(
    private size: Vector = [0, 0],
    default_value = null,
  ) {
    this.rows = [];

    for (let y = 0; y < size[1]; y++) {
      const row = [];
      for (let x = 0; x < size[0]; x++) {
        row.push(default_value);
      }
      this.rows.push(row);
    }
  }

  iter(callback: (pos: Vector, other: boolean) => void, context?: any) {
    for (let y = 0; y < this.size[1]; y++) {
      for (let x = 0; x < this.size[0]; x++) {
        callback.apply(context, [[x, y], this.get([x, y])]);
      }
    }
  }

  get([x, y]: [number, number]) {
    if (this.rows[y] === undefined) {
      return undefined;
    }
    return this.rows[y][x];
  }

  set([x, y]: Vector, val: boolean) {
    this.rows[y][x] = val;
  }

  set_horizontal_line(
    [start_x, start_y]: Vector,
    delta_x: number,
    val: boolean,
  ) {
    const c = Math.abs(delta_x);
    const mod = delta_x < 0 ? -1 : 1;

    for (let x = 0; x <= c; x++) {
      this.set([start_x + x * mod, start_y], val);
    }
  }

  set_vertical_line([start_x, start_y]: Vector, delta_y: number, val: boolean) {
    const c = Math.abs(delta_y);
    const mod = delta_y < 0 ? -1 : 1;

    for (let y = 0; y <= c; y++) {
      this.set([start_x, start_y + y * mod], val);
    }
  }

  get_square([x, y]: Vector, [size_x, size_y]: Vector) {
    const retv = new Array2d([size_x, size_y]);
    for (let dx = 0; dx < size_x; dx++) {
      for (let dy = 0; dy < size_y; dy++) {
        retv.set([dx, dy], this.get([x + dx, y + dy]));
      }
    }
    return retv;
  }

  set_square([x, y]: Vector, [size_x, size_y]: Vector, val: boolean) {
    for (let dx = 0; dx < size_x; dx++) {
      for (let dy = 0; dy < size_y; dy++) {
        this.set([x + dx, y + dy], val);
      }
    }
  }
}
