export declare class WrapperObject<
  T extends {
    [x: string]: any;
  },
> {
  constructor(TypeOfItem: typeof T, ...args: any[]);

  readonly Instance: T;
  static Create<T>(typeOfItem: typeof T, ...args: any[]): WrapperObject<T>;
}
