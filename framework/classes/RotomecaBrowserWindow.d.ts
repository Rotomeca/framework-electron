import { BrowserWindow } from 'electron';
import { RotomecaPromise } from './RotomecaPromise';
import { RotomecaPath } from './RotomecaPath';

declare type RotomecaBrowserWindowConstructorOptions = {
  page: string;
  noJavascript: boolean;
  windowConfig: Electron.BaseWindowConstructorOptions;
  webConfig: Electron.BrowserViewConstructorOptions;
  envs: { [key: string]: any };
};

export declare class RotomecaBrowserWindow extends BrowserWindow {
  constructor({
    page = 'default',
    noJavascript = false,
    windowConfig = {},
    webConfig = {},
    envs = {},
  }?: RotomecaBrowserWindowConstructorOptions);

  #_init(): RotomecaBrowserWindow;
  #_setup(): RotomecaBrowserWindow;
  #_setupEvent(event: string, memberEvent: string): RotomecaBrowserWindow;
  #_loadEnvs(): string;
  #_transformStaticImportsToDynamic(code: string, file: string): string;
  #_getImportPath(modulePath: string, filePath: string): string;
  #_executeStartScript(): void;

  addEnv(key: string, value: any, { delete_after_sending = false } = {}): void;
  getEnv(key: string): ?any;
  show(): void;
  changePage(page: string): RotomecaBrowserWindow;
  reload(): void;
  postMessage(channel: string, message: string): RotomecaBrowserWindow;
  executeJavaScript(
    script: string,
    { isFile = false } = {},
  ): RotomecaPromise<void>;

  static readonly BrowserDefaultIcon: string | false;
  static readonly RotomecaPath: RotomecaPath;
  static readonly PreloadPath: string;

  static ExecuteScript(
    webContents: Electron.WebContents,
    script: string,
    { isFile = false } = {},
  ): RotomecaPromise<void>;
}
