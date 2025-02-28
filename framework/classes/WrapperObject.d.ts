export declare class WrapperObject<T> {
  constructor(TypeOfItem: T, ...args: any[]);

  readonly Instance: T;
  static Create<T>(typeOfItem: new () => T, ...args: any[]): WrapperObject<T>;
}