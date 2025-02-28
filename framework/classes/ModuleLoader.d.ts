import RotomecaPromise from '@rotomeca/promise';
import { RJSParser } from './RJSParser';
import { RotomecaBrowserWindow } from './RotomecaBrowserWindow';
import { RotomecaEnv } from './RotomecaEnv';
import {
  MenuButton,
  RotomecaFrameBrowserWindow,
} from './RotomecaFrameBrowserWindow';
import { RotomecaPath } from './RotomecaPath';
import { FileData } from './SaveData';
import { WrapperObject } from './WrapperObject';

declare type InternalModuleLoader = WrapperObject<_RotomecaModuleLoader>;

declare class _RotomecaModuleLoader {
  constructor();
  readonly electron: typeof Electron.CrossProcessExports;
  readonly fs: typeof import('fs');
  readonly path: typeof RotomecaPath;
  readonly env: WrapperObject<RotomecaEnv>;
  readonly promise: typeof RotomecaPromise;
  readonly browserwindow: typeof RotomecaBrowserWindow;
  readonly customTopBrowserWindow: typeof RotomecaFrameBrowserWindow;
  readonly rbwMenuButton: typeof MenuButton;
  readonly geometry: typeof import('./Geometry');
  readonly os: typeof import('os');
  readonly fileManipulator: typeof FileData;
  readonly RJSParser: typeof RJSParser;
  get<TModuleType>(module: string): TModuleType;
}

export const RotomecaModuleLoader: InternalModuleLoader;
