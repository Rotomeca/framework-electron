import JsEvent from './JsEvent';

declare enum EPromiseState {
  pending,
  rejected,
  resolved,
  cancelled,
}
declare type ValidatorCallback<TResult> = (data: TResult) => void;
declare type NonValidatorCallback = (data: any) => void;
declare class ResolvingState<TResult> {
  constructor(
    ok: ValidatorCallback<TResult>,
    nok: NonValidatorCallback,
    timeout: number,
  );

  readonly resolving: boolean;

  start(): ResolvingState<TResult>;
  resolve([data = null]: ?TResult): void;
  reject([why = null]: ?any): void;
}
declare type PromiseManager<TResult> = {
  resolver: ?ResolvingState<TResult>;
  state: () => EPromiseState;
};
declare type PromiseManagerAsync = {
  state: () => EPromiseState;
};
declare type PromiseCallback<TResult> = (
  manager: PromiseManager<TResult>,
  ...args: any[]
) => TResult;
declare type PromiseCallbackAsync<TResult> = (
  manager: PromiseManagerAsync,
  ...args: any[]
) => Promise<TResult>;
declare class RotomecaPromise<TResult> {
  constructor(
    callback: PromiseCallback<TResult> | PromiseCallbackAsync<TResult>,
    ...args: any[]
  );

  onabort: JsEvent<() => void>;
  readonly state: EPromiseState;
  readonly isStarted: boolean;
  isPending(): boolean;
  isResolved(): boolean;
  isRejected(): boolean;
  isCancelled(): boolean;
  abort(): RotomecaPromise<boolean>;
  start(): RotomecaPromise<TResult>;
  executor(): Promise<TResult>;
  then<TValidResult, TErrorResult>(
    onfullfiled: (data: TResult) => TValidResult,
    onerror: (error: any) => TErrorResult,
  ): RotomecaPromise<TValidResult | TErrorResult>;
  catch<TErrorResult>(
    onfullfiled: (onrejected: TResult) => TErrorResult,
  ): RotomecaPromise<TErrorResult>;
}
