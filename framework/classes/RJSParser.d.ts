import RotomecaPromise from '@rotomeca/promise';

export declare class RJSParser {
  constructor(file: string);
  destroy(): null;
  get(): string;
  getAsync(): RotomecaPromise<string>;
  static Parse(file: string): string;
  static ParseAsync(file: string): RotomecaPromise<string>;
}
