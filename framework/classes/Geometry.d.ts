export = Geometry;

declare namespace Geometry {
  declare class Point {
    constructor(x: number, y: number);
    static readonly Zero: Point;
    static readonly DefaultPos: Symbol;
  }

  declare class Rectangle {
    constructor(pos: Point, width: number, height: number);
    readonly pos: Point | Symbol;
    x: number;
    y: number;
    width: number;
    height: number;

    static readonly Zero: Rectangle;
    static Create(
      x: number,
      y: number,
      width: number,
      height: number,
    ): Rectangle;
  }
}
