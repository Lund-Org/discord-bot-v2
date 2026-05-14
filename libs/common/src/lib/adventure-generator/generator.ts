import { FACING_INVERSE } from './constants';
import { Piece, PieceOptions } from './piece';
import { Random } from './random';
import { Rectangle } from './rectangle';
import { Exit, Vector } from './type';

export class Generator extends Piece {
  random: Random;
  minx = 0;
  maxx = 0;
  miny = 0;
  maxy = 0;

  constructor(options: PieceOptions) {
    super(options);

    this.random = new Random();

    this.start_pos = [0, 0];
    this.minx = this.size[0];
    this.maxx = 0;
    this.miny = this.size[1];
    this.maxy = 0;
  }

  add_piece(piece: Piece, position: Vector) {
    super.add_piece(piece, position);

    this.minx = Math.min(this.minx, piece.position[0]);
    this.maxx = Math.max(this.maxx, piece.position[0] + piece.size[0]);

    this.miny = Math.min(this.miny, piece.position[1]);
    this.maxy = Math.max(this.maxy, piece.position[1] + piece.size[1]);
  }

  trim() {
    this.size = [this.maxx - this.minx, this.maxy - this.miny];
    this.children.forEach((child) => {
      child.position = [
        child.position[0] - this.minx,
        child.position[1] - this.miny,
      ];
    });

    this.start_pos = [
      this.start_pos[0] - this.minx,
      this.start_pos[1] - this.miny,
    ];
    this.walls = this.walls.get_square([this.minx, this.miny], this.size);

    this.minx = 0;
    this.maxx = this.size[0];

    this.miny = 0;
    this.maxy = this.size[1];
  }

  generate() {
    throw new Error('not implemented');
  }

  fits(piece: Piece, position: Vector) {
    for (let x = 0; x < piece.size[0]; x++) {
      for (let y = 0; y < piece.size[1]; y++) {
        const p = this.walls.get([position[0] + x, position[1] + y]);

        if (p === false || p === null || p === undefined) {
          return false;
        }
      }
    }
    return true;
  }

  join_exits(
    piece1: Piece,
    piece1_exit: Exit,
    piece2: Piece,
    piece2_exit: Exit,
  ) {
    /*
        register an exit with each piece, remove intersecting perimeter tiles
        */

    piece1.add_exit(piece1_exit, piece2);
    piece2.add_exit(piece2_exit, piece1);

    const ic = piece1.rect.intersection(piece2.rect);

    if (ic) {
      const [x1, y1] = piece1.local_pos([ic[0], ic[1]]);
      const [x2, y2] = piece2.local_pos([ic[0], ic[1]]);

      piece1.remove_perimeter(new Rectangle(x1, y1, ic.width, ic.height));
      piece2.remove_perimeter(new Rectangle(x2, y2, ic.width, ic.height));
    }
  }

  join(piece1: Piece, piece2_exit: Exit, piece2: Piece, piece1_exit?: Exit) {
    /*
        join piece 1 to piece2 provided at least one exit.
        piece1 should already be placed
        */
    if (!piece1_exit) {
      piece1_exit = this.random.choose(
        piece1.get_perimeter_by_facing(FACING_INVERSE[piece2_exit[1]]),
      );
    }

    // global piece2 exit pos
    const piece2_exit_pos = piece1.parent_pos(piece1_exit[0]);

    // figure out piece2 position
    const piece2_pos: Vector = [
      piece2_exit_pos[0] - piece2_exit[0][0],
      piece2_exit_pos[1] - piece2_exit[0][1],
    ];

    if (!this.fits(piece2, piece2_pos)) {
      return false;
    }

    this.join_exits(piece1, piece1_exit, piece2, piece2_exit);
    this.add_piece(piece2, piece2_pos);

    return true;
  }

  get_open_pieces(pieces: Piece[]) {
    // filter out pieces
    return pieces.filter((piece) => {
      return piece.exits.length < piece.max_exits && piece.perimeter.length;
    });
  }
}
