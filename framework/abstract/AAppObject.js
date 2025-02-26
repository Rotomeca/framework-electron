const { app, ipcMain, BaseWindow } = require('electron');
const { EMPTY_STRING } = require('../constants');
const JsEvent = require('../classes/JsEvent');
const AFrameworkObject = require('./AFrameworkObject');

/**
 * @todo FrameBrowserWindow
 * @todo Front
 */
class AAppObject extends AFrameworkObject {
  /**
   * @type {Object<string, BaseWindow>}
   */
  #_windows = {};
  constructor() {
    super();
    this.onwindowallclosed = new JsEvent();
    ipcMain.handle('RotomecaBrowserClose', (_, id) => {
      if (id.includes('topview_')) id = id.replace('topview_', EMPTY_STRING);

      let key = Object.keys(this.#_windows).filter(
        (x) => this.#_windows[x].id == id,
      )?.[0];

      if (key) {
        this.#_windows[key].destroy();
        delete this.#_windows[key];
      }
    });

    ipcMain.handle('RotomecaBrowserRefresh', (_, id) => {
      if (id.includes('topview_')) id = id.replace('topview_', EMPTY_STRING);

      let key = Object.keys(this.#_windows).filter(
        (x) => this.#_windows[x].id == id,
      )?.[0];

      if (key && !!this.#_windows[key].reload) {
        this.#_windows[key].reload();
      }
    });

    ipcMain.handle('RotomecaBrowserMinimise', (_, id) => {
      if (id.includes('topview_')) id = id.replace('topview_', EMPTY_STRING);

      let key = Object.keys(this.#_windows).filter(
        (x) => this.#_windows[x].id == id,
      )?.[0];

      if (key) {
        this.#_windows[key].minimize();
      }
    });

    ipcMain.handle('RotomecaBrowserMaximise', (_, id) => {
      if (id.includes('topview_')) id = id.replace('topview_', EMPTY_STRING);

      let key = Object.keys(this.#_windows).filter(
        (x) => this.#_windows[x].id == id,
      )?.[0];

      if (key) {
        if (this.#_windows[key].isMaximized()) this.#_windows[key].unmaximize();
        else this.#_windows[key].maximize();
      }
    });
  }

  #_createWindow(index, window) {
    if (this.#_windows[index]) throw new Error();
    else this.#_windows[index] = window;

    return this;
  }

  /**
   *
   * @param {string} index
   * @param {Object} [options={}]
   * @param {Rectangle} [options.rect=new Rectangle(Point.DefaultPos, 800, 600)]
   * @param {Electron.BaseWindowConstructorOptions} [options.windowConfig={}]
   * @param {Electron.BrowserViewConstructorOptions} [options.webConfig={}]
   * @returns {RotomecaBrowserWindow}
   */
  createBrowserWindow(
    index,
    {
      page = 'default',
      noJavascript = false,
      rect = new AFrameworkObject.RotomecaModuleLoader.Instance.geometry.Rectangle(
        AFrameworkObject.RotomecaModuleLoader.Instance.geometry.Point.DefaultPos,
        800,
        600,
      ),
      disableMenu = false,
      windowConfig = {},
      webConfig = {},
    } = {},
  ) {
    const show = windowConfig.show ?? true;
    let config = { page, noJavascript, windowConfig, webConfig };

    config.windowConfig.width = rect.width;
    config.windowConfig.height = rect.height;
    config.windowConfig.show = false;

    if (
      rect.pos ===
      AFrameworkObject.RotomecaModuleLoader.Instance.geometry.Point.DefaultPos
    ) {
      config.windowConfig.x = rect.x;
      config.windowConfig.y = rect.y;
    }

    let win = new AFrameworkObject.RotomecaModuleLoader.Instance.browserwindow(
      config,
    );

    if (disableMenu) win.setMenuBarVisibility(false);

    this.#_createWindow(index, win);

    if (show) win.show();

    return win;
  }

  createBasicBrowserWindow(
    index,
    page,
    {
      rect = new AFrameworkObject.RotomecaModuleLoader.Instance.geometry.Rectangle(
        AFrameworkObject.RotomecaModuleLoader.Instance.geometry.Point.DefaultPos,
        800,
        600,
      ),
      alwaysOnTop = false,
      frame = false,
      useContentSize = true,
      transparent = false,
      skipTaskbar = false,
      icon = EMPTY_STRING,
      show = true,
      disableMenu = false,
    } = {},
  ) {
    if (icon === EMPTY_STRING || !icon) icon = undefined;

    return this.createBrowserWindow(index, {
      page,
      noJavascript: false,
      rect,
      disableMenu,
      windowConfig: {
        alwaysOnTop,
        frame,
        useContentSize,
        transparent,
        skipTaskbar,
        icon,
        show,
      },
    });
  }

  createCustomBrowserWindow(
    index,
    {
      buttons = AFrameworkObject.RotomecaModuleLoader.Instance.rbwMenuButton.Creates(
        AFrameworkObject.RotomecaModuleLoader.Instance.rbwMenuButton.Default,
      ),
      page = 'default',
      noJavascript = false,
      rect = new AFrameworkObject.RotomecaModuleLoader.Instance.geometry.Rectangle(
        AFrameworkObject.RotomecaModuleLoader.Instance.geometry.Point.DefaultPos,
        800,
        600,
      ),
      windowConfig = {},
      webConfig = {},
    } = {},
  ) {
    let config = { page, noJavascript, windowConfig, webConfig };

    config.windowConfig.width = rect.width;
    config.windowConfig.height = rect.height;
    config.windowConfig.show = false;

    if (
      rect.pos ===
      AFrameworkObject.RotomecaModuleLoader.Instance.geometry.Point.DefaultPos
    ) {
      config.windowConfig.x = rect.x;
      config.windowConfig.y = rect.y;
    }

    let win =
      new AFrameworkObject.RotomecaModuleLoader.Instance.customTopBrowserWindow(
        { page, noJavascript, buttons, windowConfig, webConfig },
      );

    win.setMenuBarVisibility(false);

    this.#_createWindow(index, win);

    return win;
  }

  createBasicCustomBrowserWindow(
    index,
    page,
    {
      buttons = AFrameworkObject.RotomecaModuleLoader.Instance.rbwMenuButton.Creates(
        AFrameworkObject.RotomecaModuleLoader.Instance.rbwMenuButton.Default,
      ),
      rect = new AFrameworkObject.RotomecaModuleLoader.Instance.geometry.Rectangle(
        AFrameworkObject.RotomecaModuleLoader.Instance.geometry.Point.DefaultPos,
        800,
        600,
      ),
      alwaysOnTop = false,
      useContentSize = true,
      transparent = false,
      skipTaskbar = false,
      icon = EMPTY_STRING,
    } = {},
  ) {
    if (icon === EMPTY_STRING || !icon) icon = undefined;

    return this.createCustomBrowserWindow(index, {
      page,
      buttons,
      rect,
      windowConfig: {
        alwaysOnTop,
        useContentSize,
        transparent,
        skipTaskbar,
        icon,
      },
    });
  }

  addWindow(key, win) {
    return this.#_createWindow(key, win);
  }

  getWindow(key) {
    return this.#_windows[key];
  }

  removeWindow(key) {
    try {
      this.#_windows[key].close();
    } catch (error) {
      console.log(key, 'already closed !');
      console.info(error);
    }
    delete this.#_windows[key];
    return this;
  }

  listen(channel, callback) {
    ipcMain.addListener(channel, callback);
    return this;
  }

  main() {}

  quit() {
    app.quit();
  }

  static Run() {
    let mainApp = new this.prototype.constructor();
    app.on('ready', () => {
      mainApp.main();
    });

    app.on(
      'window-all-closed',
      function () {
        this.onwindowallclosed.call();
      }.bind(mainApp),
    );
  }
}

module.exports = { AAppObject };
