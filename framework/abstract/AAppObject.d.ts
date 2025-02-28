import { BaseWindow, BrowserWindow } from 'electron';
import AFrameworkObject from './AFrameworkObject';
import Geometry from '../classes/Geometry';
import { RotomecaBrowserWindow } from '../classes/RotomecaBrowserWindow';
import { RotomecaFrameBrowserWindow } from '../classes/RotomecaFrameBrowserWindow';

export = AApObject;

declare type CreateBrowserWindowOptions = {
  page: string | undefined;
  noJavascript: boolean | undefined;
  rect: Geometry.Rectangle | undefined;
  disableMenu: boolean | undefined;
  windowConfig: Electron.BaseWindowConstructorOptions | undefined;
  webConfig: Electron.BrowserViewConstructorOptions | undefined;
};

declare type CreateBasicBrowserWindowOptions = {
  rect: Geometry.Rectangle | undefined;
  alwaysOnTop: boolean | undefined;
  frame: boolean | undefined;
  useContentSize: boolean | undefined;
  transparent: boolean | undefined;
  skipTaskbar: boolean | undefined;
  icon: string | undefined;
  show: boolean | undefined;
  disableMenu: boolean | undefined;
};

declare class AApObject extends AFrameworkObject {
  constructor();
  #_createWindow(index: string, window: BaseWindow): this;
  createBrowserWindow(
    index: string,
    {
      page = 'default',
      noJavascript = false,
      rect = new Geometry.Rectangle(Geometry.Point.DefaultPos, 800, 600),
      disableMenu = false,
      windowConfig = {},
      webConfig = {},
    }?: CreateBrowserWindowOptions,
  ): RotomecaBrowserWindow;

  createBasicBrowserWindow(
    index: string,
    page: string,
    {
      rect = new Geometry.Rectangle(Geometry.Point.DefaultPos, 800, 600),
      alwaysOnTop = false,
      frame = false,
      useContentSize = true,
      transparent = false,
      skipTaskbar = false,
      icon = '',
      show = true,
      disableMenu = false,
    }?: CreateBasicBrowserWindowOptions,
  ): RotomecaBrowserWindow;

  addWindow(key: string, win: BaseWindow): this;
  getWindow(
    key: string,
  ):
    | RotomecaBrowserWindow
    | BaseWindow
    | BrowserWindow
    | RotomecaFrameBrowserWindow;
  removeWindow(key: string): this;
  listen(
    channel: string,
    callback: (event: Electron.IpcMainEvent, ...args: any[]) => void,
  ): this;
  main(): void;
  quit(): void;
  static Run(): void;
}
