export class Rectangle {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
  ) {}

  // Extends the rectangle's bounds to include the described point or rectangle.
  extend(x: number, y: number, width: number, height: number) {
    width = width || 0;
    height = height || 0;
    if (x + width > this.x + this.width) {
      this.width = x + width - this.x;
    }
    if (y + height > this.y + this.height) {
      this.height = y + height - this.y;
    }
    if (x < this.x) {
      this.width += this.x - x;
      this.x = x;
    }
    if (y < this.y) {
      this.height += this.y - y;
      this.y = y;
    }
    return this;
  }

  // Adds the specified padding to the rectangle's bounds.
  pad(top: number, left: number, bottom: number, right: number) {
    this.x -= left;
    this.y -= top;
    this.width += left + right;
    this.height += top + bottom;
    return this;
  }

  copy(rectangle: Rectangle) {
    this.x = rectangle.x;
    this.y = rectangle.y;
    this.width = rectangle.width;
    this.height = rectangle.height;
  }

  // Returns true if this rectangle fully encloses the described point or rectangle.
  contains(x: number, y: number, width: number, height: number) {
    width = width || 0;
    height = height || 0;
    return (
      x >= this.x &&
      x + width <= this.x + this.width &&
      y >= this.y &&
      y + height <= this.y + this.height
    );
  }

  // Returns a new rectangle which contains this rectangle and the specified rectangle.
  union(rect: Rectangle) {
    return this.clone().extend(rect.x, rect.y, rect.width, rect.height);
  }

  // Returns a new rectangle which describes the intersection (overlap) of this rectangle and the specified rectangle,
  // or null if they do not intersect.
  intersection(rect: Rectangle) {
    let x1 = rect.x;
    let y1 = rect.y;
    let x2 = x1 + rect.width;
    let y2 = y1 + rect.height;

    if (this.x > x1) {
      x1 = this.x;
    }
    if (this.y > y1) {
      y1 = this.y;
    }
    if (this.x + this.width < x2) {
      x2 = this.x + this.width;
    }
    if (this.y + this.height < y2) {
      y2 = this.y + this.height;
    }
    return x2 <= x1 || y2 <= y1
      ? null
      : new Rectangle(x1, y1, x2 - x1, y2 - y1);
  }

  // Returns true if the specified rectangle intersects (has any overlap) with this rectangle.
  intersects(rect: Rectangle) {
    return (
      rect.x <= this.x + this.width &&
      this.x <= rect.x + rect.width &&
      rect.y <= this.y + this.height &&
      this.y <= rect.y + rect.height
    );
  }

  isEmpty() {
    return this.width <= 0 || this.height <= 0;
  }

  clone() {
    return new Rectangle(this.x, this.y, this.width, this.height);
  }

  toString() {
    return (
      '[Rectangle (x=' +
      this.x +
      ' y=' +
      this.y +
      ' width=' +
      this.width +
      ' height=' +
      this.height +
      ')]'
    );
  }
}
