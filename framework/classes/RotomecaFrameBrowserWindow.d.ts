import { BaseWindow } from 'electron';
import { ISerialize } from '../interfaces/ISerialize';
import { RotomecaBrowserWindow } from './RotomecaBrowserWindow';

export declare class MenuButton implements ISerialize {
  constructor(name: string, icon: string, action: string);
  readonly name: string;
  readonly action: string;
  readonly icon: string;
  readonly isSeparator: boolean;
  serialize(): string;
  toString(): string;
  static readonly Separator: Symbol;
  static readonly Default: Array<{
    [x: string]: { name: string; icon: string; action: string };
  }>;
  static Create(name: string, icon: string, action: string): MenuButton;
  static CreateSeparator(): MenuButton;
  static Creates(
    object: Array<{
      [x: string]: { name: string; icon: string; action: string };
    }>,
  ): MenuButton[];
}

declare type RotomecaFrameBrowserWindowConstructorOption = {
  page: string;
  noJavascript: boolean;
  buttons: MenuButton[];
  windowConfig: Electron.BaseWindowConstructorOptions;
  webConfig: Electron.BrowserViewConstructorOptions;
  envs: { [key: string]: any };
};
declare type ExecuteStartScriptOptions = {
  isInternal: boolean;
  target: Electron.WebContents;
  envs: { [key: string]: any };
  customPage: string;
};
export declare class RotomecaFrameBrowserWindow extends BaseWindow {
  constructor({
    page = 'default',
    noJavascript = false,
    button = MenuButton.Creates(MenuButton.Default),
    windowConfig = {},
    webConfig = {},
    envs = {},
  }?: RotomecaFrameBrowserWindowConstructorOption);
  readonly webView: Electron.WebContentsView;
  readonly webContents: Electron.WebContents;
  #_init(): RotomecaFrameBrowserWindow;
  #_setup(): RotomecaFrameBrowserWindow;
  #_setupEvent(event: string, memberEvent: string): RotomecaFrameBrowserWindow;
  #_InitTopView(): RotomecaFrameBrowserWindow;
  #_loadEnvs(): string;
  #_transformStaticImportsToDynamic(code: string, file: string): string;
  #_getImportPath(modulePath: string, filePath: string): string;
  #_executeStartScript({
    isInternal = false,
    target = this.webContents,
    envs = null,
    customPage = null,
  }?: ExecuteStartScriptOptions): void;
  show(): RotomecaFrameBrowserWindow;
  addEnv(key: string, value: any, { delete_after_sending = false } = {}): void;
  getEnv(key: string): ?any;
  loadUrl(url: string): void;
  loadFile(path: string): void;
  changePage(page: string): RotomecaFrameBrowserWindow;
  reload(): void;
  executeJavaScript(
    script: string,
    { isFile = false } = {},
  ): RotomecaPromise<void>;
  postMessage(channel: string, message: string): RotomecaFrameBrowserWindow;
  static readonly RotomecaBrowserWindow: typeof RotomecaBrowserWindow;
}
