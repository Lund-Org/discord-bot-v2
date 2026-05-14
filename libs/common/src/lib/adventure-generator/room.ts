import { Piece, PieceOptions } from './piece';
import { Vector } from './type';

export class Room extends Piece {
  room_size: Vector;

  constructor(options: PieceOptions) {
    /*
     * note, size to be provided is size without walls.
     */
    const refinedOptions = {
      room_size: options.size,
      size: [options.size[0] + 2, options.size[1] + 2] satisfies Vector,
      symmetric: false,
    };

    super(refinedOptions);

    this.walls.set_square([1, 1], this.room_size, false);

    if (!this.symmetric) {
      // any point at any wall can be exit
      this.add_perimeter([1, 0], [this.size[0] - 2, 0], 180);
      this.add_perimeter([0, 1], [0, this.size[1] - 2], 90);
      this.add_perimeter(
        [1, this.size[1] - 1],
        [this.size[0] - 2, this.size[1] - 1],
        0,
      );
      this.add_perimeter(
        [this.size[0] - 1, 1],
        [this.size[0] - 1, this.size[1] - 2],
        270,
      );
    } else {
      // only middle of each wall can be exit
      const [w, h] = this.get_center_pos();

      this.perimeter = [
        [[w, 0], 180],
        [[this.size[0] - 1, h], 270],
        [[w, this.size[1] - 1], 0],
        [[0, h], 90],
      ];
    }
  }
}
