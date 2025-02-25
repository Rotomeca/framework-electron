import { WrapperObject } from './WrapperObject';

declare class RotomecaEnv {
  constructor();

  readonly IsDev: boolean;
}

export const REnv: WrapperObject<RotomecaEnv>;
