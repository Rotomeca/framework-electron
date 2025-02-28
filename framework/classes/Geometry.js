class Point {
  static #_defaultPosSymbol;
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * @type {Point}
   * @readonly
   * @static
   */
  static get Zero() {
    return new Point(0, 0);
  }

  /**
   * @type {Symbol}
   * @readonly
   * @static
   */
  static get DefaultPos() {
    if (!Point.#_defaultPosSymbol) Point.#_defaultPosSymbol = Symbol();

    return Point.#_defaultPosSymbol;
  }
}

class Rectangle {
  /**
   * @type {Point}
   * @private
   */
  #_pos;
  constructor(pos, width, height) {
    this.#_pos = pos;
    this.width = width;
    this.height = height;
  }

  /**
   * @type {Point | Symbol}
   * @readonly
   */
  get pos() {
    return this.#_pos;
  }

  get x() {
    return this.pos === Point.DefaultPos ? Point.DefaultPos : this.pos.x;
  }

  set x(value) {
    if (this.pos === Point.DefaultPos) this.#_pos = Point.Zero;

    this.#_pos.x = value;
  }

  get y() {
    return this.pos === Point.DefaultPos ? Point.DefaultPos : this.pos.y;
  }

  set y(value) {
    if (this.pos === Point.DefaultPos) this.#_pos = Point.Zero;

    this.#_pos.y = value;
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {number} w
   * @param {number} h
   * @returns {Rectangle}
   */
  static Create(x, y, w, h) {
    return new Rectangle(new Point(x, y), w, h);
  }

  /**
   * @type {Rectangle}
   * @readonly
   */
  static get Zero() {
    return this.Create(0, 0, 0, 0);
  }
}

class Geometry {
  /**
   * @type {typeof Point}
   * @readonly
   */
  static get Point() {
    return Point;
  }

  /**
   * @type {typeof Rectangle}
   * @readonly
   */
  static get Rectangle() {
    return Rectangle;
  }
}

module.exports = Geometry;
