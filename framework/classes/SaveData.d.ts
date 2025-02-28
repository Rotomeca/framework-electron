import JsEvent from '@rotomeca/event';
import { InternalModuleLoader } from './ModuleLoader';
import RotomecaPromise from '@rotomeca/promise';

declare type OnItemSavedCallback<T> = (data: T) => void;
declare type OnItemLoadedCallback<T> = (data: T | false) => void;

declare type LoadedData<T> = {
  fileManipulator: FileData<T>;
  data: T | false;
  loadSuccess: boolean;
};

export declare class FileData<T> {
  constructor(name: string);
  onsave: JsEvent<OnItemSavedCallback<T>>;
  onload: JsEvent<OnItemLoadedCallback<T>>;
  readonly path: string;
  #_tryCreateBaseFolder(): FileData<T>;
  save(data: T): FileData<T>;
  load(): T | false;
  loadAsync(): RotomecaPromise<T | false>;
  static readonly #_ModuleLoader: InternalModuleLoader;
  static readonly os: typeof import('os');
  static readonly fs: typeof import('fs');
  static readonly BasePath: string;

  static Save<T>(filename: string, data: T): FileData<T>;
  static Load<T>(filename: string): RotomecaPromise<LoadedData<T>>;
}
