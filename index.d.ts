import RotomecaPromise from '@rotomeca/promise';
import AApObject from './framework/abstract/AAppObject';
import AFrameworkObject from './framework/abstract/AFrameworkObject';
import { InternalModuleLoader } from './framework/classes/ModuleLoader';
import { RotomecaBrowserWindow } from './framework/classes/RotomecaBrowserWindow';
import { REnv } from './framework/classes/RotomecaEnv';
import { RotomecaPath } from './framework/classes/RotomecaPath';
import { ISerialize } from './framework/interfaces/ISerialize';
import Geometry from './framework/classes/Geometry';
import { FileData } from './framework/classes/SaveData';

export = RotomecaFrameworkElectron;

declare module '@rotomeca/framework-electron';
declare abstract class FrameWorkAbstractExporter {
  static readonly AAppObject: typeof AApObject;
  static readonly AFrameworkObject: typeof AFrameworkObject;
  static readonly ISerialize: ISerialize;
}
declare abstract class RotomecaFrameworkElectron {
  static readonly Abstract: typeof FrameWorkAbstractExporter;
  static readonly ModuleLoader: InternalModuleLoader;
  static readonly BrowserWindow: typeof RotomecaBrowserWindow;
  static readonly Env: typeof REnv;
  static readonly Path: typeof RotomecaPath;
  static readonly Promise: typeof RotomecaPromise;
  static readonly Geometry: typeof Geometry;
  static readonly Save: typeof FileData;
  static readonly EMPTY_STRING: string;
}
