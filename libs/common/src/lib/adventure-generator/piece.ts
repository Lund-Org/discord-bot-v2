import { Array2d } from './array2d';
import { Facing } from './constants';
import { Rectangle } from './rectangle';
import { Exit, RoomDefinition, Vector } from './type';
import {
  array_test,
  intersects,
  iter_2d,
  iter_adjacent,
  iter_range,
} from './utils';

let next_piece_id = 0;

export type PieceOptions = {
  size?: Vector;
  position?: Vector;
  parent?: Piece | null;
  max_exits?: number;
  tag?: string;
  room_size?: Vector;
  symmetric?: boolean;
  max_iterations?: number;
  rooms?: {
    initial: RoomDefinition;
    any: RoomDefinition;
  };
  max_corridor_length?: number;
  min_corridor_length?: number;
  corridor_density?: number;
  symmetric_rooms?: boolean;
  interconnects?: number;
  max_interconnect_length?: number;
  room_count?: number;
  facing?: Facing;
};

// base dungeon piece class, to be extended
export class Piece {
  options: PieceOptions;
  position: Vector;
  room_size: Vector;
  symmetric = false;
  size: Vector;
  id: number;
  walls: Array2d;
  perimeter: Array<[Vector, Facing]>;
  exits: Array<Exit>;
  children: Piece[];
  parent: Piece | null;
  facing: Facing;

  max_iterations = 0;
  max_exits = 0;
  max_corridor_length = 0;
  min_corridor_length = 0;
  corridor_density = 0;
  symmetric_rooms = false;
  interconnects = 0;
  max_interconnect_length = 0;
  room_count = 0;

  start_pos: Vector = [0, 0];

  constructor(options: PieceOptions) {
    options = Object.assign(
      {
        size: [1, 1],
        position: [0, 0],
        parent: null,
        max_exits: 10,
        tag: '',
        facing: 0,
      },
      options,
    );

    Object.assign(this, options);

    this.options = options;

    this.id = next_piece_id++;
    this.walls = new Array2d(this.size, true);
    this.perimeter = [];
    this.exits = [];
    this.children = [];
  }

  get rect() {
    return new Rectangle(
      this.position[0],
      this.position[1],
      this.size[0],
      this.size[1],
    );
  }

  is_exit([x, y]: Vector) {
    return (
      this.exits.filter(([[exit_x, exit_y]]) => {
        return exit_x === x && exit_y === y;
      }).length !== 0
    );
  }

  get_non_wall_tiles() {
    const retv = [];
    this.walls.iter((pos, is_wall) => {
      if (!is_wall) {
        retv.push(pos);
      }
    });
    return retv;
  }

  get_perimeter_by_facing(facing: Facing) {
    return this.perimeter.filter(([_, f]) => {
      return facing === f;
    });
  }

  get_inner_perimeter() {
    // returns array of tiles in the piece that are adjacent to a wall,
    // but not an exit;

    const retv = [];
    let haswall;
    let exit_adjacent;

    this.walls.iter((pos, is_wall) => {
      if (!is_wall && !this.is_exit(pos)) {
        haswall = false;
        exit_adjacent = false;

        iter_adjacent(pos, (p) => {
          haswall = haswall || this.walls.get(p);
          exit_adjacent = exit_adjacent || this.is_exit(p);
        });

        if (haswall && !exit_adjacent) {
          retv.push(pos);
        }
      }
    });

    return retv;
  }

  // local position to parent position
  parent_pos([x, y]: Vector): Vector {
    return [this.position[0] + x, this.position[1] + y];
  }

  // local position to global position
  global_pos(pos: Vector): Vector {
    pos = this.parent_pos(pos);
    if (this.parent) {
      pos = this.parent.global_pos(pos);
    }
    return pos;
  }

  // parent position to local position
  local_pos(pos: Vector): Vector {
    return [pos[0] - this.position[0], pos[1] - this.position[1]];
  }

  // get (roughly) center tile position for the piece
  // @TODO consider if should use Math.floor instead of Math.round
  get_center_pos(): Vector {
    return [Math.floor(this.size[0] / 2), Math.floor(this.size[1] / 2)];
  }

  add_perimeter(p_from: Vector, p_to: Vector, facing: Facing) {
    iter_range(p_from, p_to, (pos) => {
      this.perimeter.push([pos, facing]);
    });
  }

  remove_perimeter(rect: Rectangle) {
    this.perimeter = this.perimeter.filter(([[x, y]]) => {
      return !rect.contains(x, y, 1, 1);
    });
  }

  intersects(piece: Piece) {
    return intersects(this.position, this.size, piece.position, piece.size);
  }

  add_piece(piece: Piece, position = null) {
    if (array_test(this.children, (c) => c.id === piece.id)) {
      return;
    }
    piece.parent = this;
    if (position) {
      piece.position = position;
    }
    this.children.push(piece);
    this.paste_in(piece);
  }

  paste_in(piece: Piece) {
    iter_2d(piece.size, (pos) => {
      const is_wall = piece.walls.get(pos);
      if (!is_wall) {
        this.walls.set(piece.parent_pos(pos), false);
      }
    });
  }

  add_exit(exit: Exit, piece: Piece) {
    this.walls.set(exit[0], false);
    if (this.parent) {
      this.parent.paste_in(this);
    }
    this.exits.push([exit[0], exit[1], piece]);
  }

  print() {
    for (let y = 0; y < this.size[1]; y++) {
      let row = '';
      for (let x = 0; x < this.size[0]; x++) {
        if (
          this.start_pos &&
          this.start_pos[0] === x &&
          this.start_pos[1] === y
        ) {
          row += 's';
        } else {
          row += this.walls.get([x, y]) ? 'x' : ' ';
        }
      }
      console.log(row);
    }
  }
}
