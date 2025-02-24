export = JsEvent;

declare type OnCallbackAddedCallback<TCallback extends Function> = (
  key: string,
  callbackAdded: TCallback,
) => void;
declare type OnCallbackRemovedCallback<TCallback extends Function> = (
  key: string,
  callbackRemoved: TCallback,
) => void;

declare class JsEventData<TCallback extends Function> {
  constructor(callback: TCallback, args: any[]);
  callback: TCallback;
  args: any[];
}

declare class JsEvent<TCallback extends Function> {
  constructor();
  events: { [Key: string]: JsEventData<TCallback> };
  readonly onadded: JsEvent<OnCallbackAddedCallback<TCallback>>;
  readonly onremoved: JsEvent<OnCallbackRemovedCallback<TCallback>>;

  push(event: TCallback, ...args: any[]): string;
  add(key: string, event: TCallback, ...args: any[]): void;
  remove(key: string): void;
  has(key: string): boolean;
  haveEvents(): boolean;
  count(): number;
  call<TResult>(...params: any): null | TResult | any[];
}
