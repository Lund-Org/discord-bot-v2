import { Vector } from './type';

export class Random {
  intBetween(min: number, max: number) {
    const rand = Math.random();
    const range = max - min;

    return min + Math.round(rand * range);
  }

  floatBetween(min: number, max: number) {
    const rand = Math.random();
    const range = max - min;

    return min + rand * range;
  }

  int(min: number, max: number) {
    return this.intBetween(min, max);
  }

  float(min = 0, max = 1) {
    return this.floatBetween(min, max);
  }

  vec(min: [number, number], max: [number, number]): Vector {
    // min and max are vectors [int, int];
    // returns [min[0]<=x<=max[0], min[1]<=y<=max[1]]
    return [this.int(min[0], max[0]), this.int(min[1], max[1])];
  }

  choose<T>(items: T[], remove = false) {
    const idx = this.intBetween(0, items.length - 1);
    if (remove) {
      return items.splice(idx, 1)[0];
    } else {
      return items[idx];
    }
  }

  maybe(probability: number) {
    return this.float() <= probability;
  }
}
