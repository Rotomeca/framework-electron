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

/**
 * Représente un évènement. On lui ajoute ou supprime des callbacks, puis on les appelle les un après les autres.
 */
declare class JsEvent<TCallback extends Function> {
  constructor();
  /**
   * Liste des évènements à appeler
   */
  events: { [Key: string]: JsEventData<TCallback> };
  /**
   * Fire when a callback is added
   * @readonly
   * @event
   */
  readonly onadded: JsEvent<OnCallbackAddedCallback<TCallback>>;
  /**
   * Fire when a callback is removed
   * @event
   * @readonly
   */
  readonly onremoved: JsEvent<OnCallbackRemovedCallback<TCallback>>;

  /**
   * Ajoute un callback
   * @param event Callback qui sera appelé lors de l'appel de l'évènement
   * @param args Liste des arguments qui seront passé aux callback
   * @returns {string} Clé créée
   * @fires JsEvent.onadded
   */
  push(event: TCallback, ...args: any[]): string;
  add(key: string, event: TCallback, ...args: any[]): void;
  remove(key: string): void;
  has(key: string): boolean;
  haveEvents(): boolean;
  count(): number;
  call<TResult>(...params: any): null | TResult | any[];
}
