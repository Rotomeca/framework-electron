const {
  BaseWindow,
  WebContentsView,
  app,
  ipcMain,
  dialog,
} = require('electron');
const JsEvent = require('./JsEvent');
const { ISerialize } = require('../interfaces/ISerialize');
const { EMPTY_STRING } = require('../constants');
const { RotomecaPromise } = require('./RotomecaPromise');
const { RotomecaModuleLoader } = require('./ModuleLoader');

const TOP_SIZE = 26;

class MenuButton extends ISerialize {
  #_name;
  #_action;
  #_icon;
  constructor(name, icon, action) {
    super();
    this.#_name = name;
    this.#_action = action;
    this.#_icon = icon;
  }

  get name() {
    return this.#_name;
  }

  get action() {
    return this.#_action;
  }

  get icon() {
    return this.#_icon;
  }

  get isSeparator() {
    return this.#_name === MenuButton.Separator;
  }

  serialize() {
    if (this.isSeparator) return JSON.stringify('separator');
    else
      return JSON.stringify({
        name: this.name,
        action: this.action,
        icon: this.icon,
      });
  }

  static Create(name, icon, action) {
    return new MenuButton(name, icon, action);
  }

  static CreateSeparator() {
    return this.Create(this.Separator, null, null);
  }

  static Creates(object) {
    let array = [];
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        const element = object[key];
        array.push(this.Create(element.name, element?.icon, element?.action));
      }
    }
    return array;
  }

  static #_Separator = Symbol();
  static get Separator() {
    return this.#_Separator;
  }

  /**
   * @readonly
   * @static
   */
  static get Default() {
    return [
      { name: 'Close', icon: 'close', action: 'RotomecaBrowserClose' },
      { name: 'Maximize', icon: 'maximize', action: 'RotomecaBrowserMaximise' },
      { name: 'Minimize', icon: 'minimize', action: 'RotomecaBrowserMinimise' },
      { name: MenuButton.Separator },
      { name: 'Refresh', icon: 'refresh', action: 'RotomecaBrowserRefresh' },
    ];
  }
}

class RotomecaFrameBrowserWindow extends BaseWindow {
  #_nojs;
  #_page;
  #_envs;
  /**
   * @type {MenuButton[]}
   */
  #_buttons;
  #_webview;
  /**
   * @type {WebContentsView}
   */
  #_topView;
  /**
   *
   * @param {Object} [options={}]
   *  @param {Electron.BaseWindowConstructorOptions} options.windowConfig
   */
  constructor({
    page = 'default',
    noJavascript = false,
    buttons = MenuButton.Creates(MenuButton.Default),
    windowConfig = {},
    webConfig = {},
    envs = {},
  }) {
    windowConfig.show ??= false;
    windowConfig.frame = false;
    if (!!windowConfig.icon) {
      windowConfig.icon =
        RotomecaFrameBrowserWindow.RotomecaBrowserWindow.RotomecaPath.RelativeToAppPath(
          windowConfig.icon,
        );
    } else if (
      RotomecaFrameBrowserWindow.RotomecaBrowserWindow.BrowserDefaultIcon
    ) {
      windowConfig.icon =
        RotomecaFrameBrowserWindow.RotomecaBrowserWindow.BrowserDefaultIcon;
    }
    super(windowConfig);
    this.#_nojs = noJavascript;
    this.#_page = page;
    this.#_envs ??= envs ?? {};
    this.#_buttons = buttons;
    const WEB_IGNORE = [
      'nodeIntegration',
      'contextIsolation',
      'enableRemoteModule',
      'preload',
      'javascript',
    ];
    let config = {
      webPreferences: {
        nodeIntegration: false, // is default value after Electron v5
        contextIsolation: true, // protect against prototype pollution
        enableRemoteModule: false,
        preload: RotomecaFrameBrowserWindow.RotomecaBrowserWindow.PreloadPath,
        javascript: !noJavascript,
      },
    };

    for (const key of Object.keys(webConfig)) {
      if (key === 'webPreferences') {
        for (const webKey of webConfig[key]) {
          if (!WEB_IGNORE.includes(webKey)) {
            config.webPreferences[webKey] = webConfig[key][webKey];
          }
        }
      } else config[key] = webConfig[key];
    }

    this.#_webview = new WebContentsView(config);

    this.#_webview.setBounds({
      x: 0,
      y: TOP_SIZE,
      width: this.getBounds().width,
      height: this.getBounds().height - TOP_SIZE,
    });

    this.contentView.addChildView(this.#_webview);

    this.changePage(page).#_init().#_setup();
  }

  #_init() {
    this.ondomready = new JsEvent();
    this.onmainmoduleloaded = new JsEvent();
    this.onshow = new JsEvent();
    this.onclose = new JsEvent();
    this.onhide = new JsEvent();
    this.onblur = new JsEvent();
    this.onfocus = new JsEvent();
    this.onfullscreen = new JsEvent();
    this.onfullscreenExit = new JsEvent();
    this.onminimize = new JsEvent();
    this.onmaximize = new JsEvent();
    this.onunmaximize = new JsEvent();
    this.onmove = new JsEvent();
    this.onmoved = new JsEvent();
    this.onreadytoshow = new JsEvent();
    this.onpagechanged = new JsEvent();
    this.onTopViewLoad = new JsEvent();

    return this;
  }

  #_setup() {
    this.on('resize', () => {
      const screen = RotomecaModuleLoader.Instance.electron.screen;
      const { height, width, x, y } = this.getBounds();
      const childs = this.contentView.children;
      const whichScreen = screen.getDisplayNearestPoint({
        x,
        y,
      });

      let it = 0;
      for (const element of childs) {
        element.setBounds({
          x: element.getBounds().x,
          y: element.getBounds().y,
          height: it++ === 0 ? TOP_SIZE : height - TOP_SIZE,
          width:
            width > whichScreen.bounds.width ? whichScreen.bounds.width : width,
        });
      }
    });
    return this.#_setupEvent('dom-ready', 'ondomready')
      .#_setupEvent('show', 'onshow')
      .#_setupEvent('close', 'onclose')
      .#_setupEvent('hide', 'onhide')
      .#_setupEvent('focus', 'onfocus')
      .#_setupEvent('blur', 'onblur')
      .#_setupEvent('enter-full-screen', 'onfullscreen')
      .#_setupEvent('leave-full-screen', 'onfullscreenExit')
      .#_setupEvent('minimize', 'onminimize')
      .#_setupEvent('maximize', 'onmaximize')
      .#_setupEvent('unmaximize', 'onunmaximize')
      .#_setupEvent('move', 'onmove')
      .#_setupEvent('moved', 'onmoved')
      .#_setupEvent('ready-to-show', 'onreadytoshow');
  }

  #_setupEvent(event, memberEvent) {
    if (this[memberEvent].haveEvents()) {
      this.webContents.on(
        event,
        function (memberEvent, ...args) {
          this[memberEvent].call(...args);
        }.bind(this, memberEvent),
      );
    } else {
      this[memberEvent].onadded.push(
        (event, memberEvent) => {
          this.webContents.on(
            event,
            function (memberEvent, ...args) {
              this[memberEvent].call(...args);
            }.bind(this, memberEvent),
          );
        },
        event,
        memberEvent,
      );
    }

    return this;
  }

  #_InitTopView() {
    const config = {
      webPreferences: {
        nodeIntegration: false, // is default value after Electron v5
        contextIsolation: true, // protect against prototype pollution
        enableRemoteModule: false,
        preload: RotomecaFrameBrowserWindow.RotomecaBrowserWindow.PreloadPath,
      },
    };
    this.#_topView = new WebContentsView(config);
    this.#_topView.setBounds({
      x: 0,
      y: 0,
      width: this.getBounds().width,
      height: TOP_SIZE,
    });

    // this.#_topView.webContents.on('dom-ready', async () => {
    //   const jsPath = './main.js';
    //   await this.#_topView.webContents
    //     .executeJavaScript(
    //       `
    //         (async () => {
    //           const {Main} = await import('${jsPath}');
    //           try {
    //             Main.Run('topview_${this.id}');
    //           }catch(e) {
    //             console.error('###[MAIN]', e);
    //           }
    //         })();
    //       `,
    //     )
    //     .catch((e) => {
    //       console.error(e);
    //       dialog.showMessageBox({
    //         type: 'error',
    //         buttons: ['Ok'],
    //         title: 'Page Error',
    //         message: e.message,
    //       });
    //     });

    // });

    this.#_topView.webContents.loadFile(
      RotomecaFrameBrowserWindow.RotomecaBrowserWindow.RotomecaPath.Path.join(
        __dirname,
        '../internalFront/default.html',
      ),
    );

    const envs = {};
    const plugin = this.onTopViewLoad.call({
      buttons: this.#_buttons,
      win: this,
      view: this.#_topView,
      stop: false,
    }) ?? { stop: false };

    if (!plugin?.stop) {
      /**
       * @type {MenuButton[]}
       * @package
       * @constant
       */
      const buttons = plugin?.buttons ?? this.#_buttons;

      let toView = {
        left: [],
        right: [],
      };

      {
        let right = true;
        for (const button of buttons) {
          if (right && button.isSeparator) right = false;
          else if (right) toView.right.push(button.serialize());
          else if (!right) toView.left.push(button.serialize());
        }
      }

      envs.toView = toView;

      // this.#_topView.webContents.postMessage('init', toView);
    }

    this.#_executeStartScript({
      isInternal: true,
      target: this.#_topView.webContents,
      customPage: 'topView',
      envs,
    });

    this.contentView.addChildView(this.#_topView, 0);

    this.#_topView.webContents.openDevTools();

    return this;
  }

  show() {
    super.show();
    if (!this.#_topView) this.#_InitTopView();

    return this;
  }

  addEnv(key, value, { delete_after_sending = false } = {}) {
    this.#_envs[key] = { value, delete_after_sending };
  }

  getEnv(key) {
    return this.#_envs[key]?.value;
  }

  #_loadEnvs() {
    let tmp = {};
    for (const key in this.#_envs) {
      if (Object.prototype.hasOwnProperty.call(this.#_envs, key)) {
        const element = this.#_envs[key];
        tmp[key] = element.value;

        if (element.delete_after_sending) delete this.#_envs[key];
      }
    }

    return JSON.stringify(tmp);
  }

  loadURL(url) {
    this.webContents.loadURL(url);
  }

  loadFile(path) {
    this.webContents.loadFile(path);
  }

  changePage(page) {
    if (page.includes('http')) this.loadURL(page);
    else {
      this.loadFile(
        RotomecaFrameBrowserWindow.RotomecaBrowserWindow.RotomecaPath.Path.join(
          __dirname,
          '../internalFront/default.html',
        ),
      );

      this.#_executeStartScript();
    }

    if (this.onpagechanged) this.onpagechanged.call(page, this);

    return this;
  }

  /**
   *
   * @param {*} code
   * @param {string} filePath
   * @returns
   */
  #_transformStaticImportsToDynamic(code, filePath) {
    // Expression régulière pour détecter les imports statiques
    const staticImportRegex =
      /import\s+(?:\*\s+as\s+)?([\w{} ,\n]+)\s+from\s+['"]([^'"]+)['"]/g;

    // Remplacer les imports statiques par des imports dynamiques
    const transformedCode = code.replace(
      staticImportRegex,
      (_, imports, modulePath) => {
        // Gérer les imports avec des alias ou des destructuring
        const importClause = imports.trim().replace(/\s*,\s*/g, ', ');

        return `const ${importClause} = await import('${this.#_getImportPath(
          modulePath,
          filePath,
        )}');`;
      },
    );

    return transformedCode;
  }

  /**
   *
   * @param {string} modulePath
   * @param {string} filePath
   */
  #_getImportPath(modulePath, filePath) {
    const path =
      RotomecaFrameBrowserWindow.RotomecaBrowserWindow.RotomecaPath.Path;
    const splited = filePath.replaceAll('\\', '/').split('/');
    const trueImportPath = splited.slice(0, splited.length - 1).join('/');
    const trueModulePath = path.resolve(`${trueImportPath}/${modulePath}`);

    return path.relative(__dirname, trueModulePath).replaceAll('\\', '/');
  }

  #_executeStartScript({
    isInternal = false,
    target = this.webContents,
    envs = null,
    customPage = null,
  } = {}) {
    const fs = require('fs');
    //Récupérer le jshtml
    const page = customPage ?? this.#_page;
    const rawFilePath = isInternal
      ? RotomecaFrameBrowserWindow.RotomecaBrowserWindow.RotomecaPath.Path.join(
          __dirname,
          `../internalFront/pages/${page}/index.jshtml`,
        )
      : RotomecaFrameBrowserWindow.RotomecaBrowserWindow.RotomecaPath.Path.relative(
          __dirname,
          app.getAppPath() + `/front/pages/${page}/index.jshtml`,
        );

    const filePath = isInternal
      ? rawFilePath
      : RotomecaFrameBrowserWindow.RotomecaBrowserWindow.RotomecaPath.Path.join(
          __dirname,
          rawFilePath,
        );

    let file;
    try {
      if (fs.existsSync(filePath)) {
        file = fs.readFileSync(filePath).toString();

        if (RotomecaModuleLoader.Instance.env.Instance.IsDev) {
          file = RotomecaModuleLoader.Instance.RJSParser.Parse(file);
        }
      } else
        file = fs
          .readFileSync(filePath.replace('.jshtml', '.rjshtml.js'))
          .toString();
    } catch (error) {
      try {
        file = fs.readFileSync(filePath.replace('.jshtml', '.js')).toString();
      } catch (error) {
        console.error(error);
      }
    }

    // Changer les imports par des imports dynamiques
    file = this.#_transformStaticImportsToDynamic(file, filePath);
    // Ajouter la fonction
    file = `async function (exporter, JsHtml, id, env, helper) { ${file} }`;

    if (!this.#_nojs) {
      const jsPath = isInternal
        ? RotomecaFrameBrowserWindow.RotomecaBrowserWindow.RotomecaPath.Path.join(
            __dirname,
            `../internalFront/pages/${page}/main.js`,
          )
        : RotomecaFrameBrowserWindow.RotomecaBrowserWindow.RotomecaPath.Path.relative(
            RotomecaFrameBrowserWindow.RotomecaBrowserWindow.RotomecaPath.Path.join(
              __dirname,
              '../internalFront',
            ),
            app.getAppPath() + `/front/pages/${page}/main.js`,
          ); //'./main.js';

      let promise = target.executeJavaScript(
        `
        (async () => {                   
          const {Main} = await import('${jsPath.replaceAll('\\', '/')}');
          try {
            const tmp = await Main.Run('${this.id}', ${file}, ${
              envs ? JSON.stringify(envs) : this.#_loadEnvs()
            });
          }catch(e) {
            console.error('###[MAIN]', e);
          }
        })();
      `,
      );

      promise.catch((e) => {
        dialog.showMessageBox({
          type: 'error',
          buttons: ['Ok'],
          title: 'Page Error',
          message: e.message,
        });
      });
    }
  }

  reload() {
    this.webContents.reload();

    this.#_executeStartScript();
  }

  postMessage(channel, message) {
    this.webContents.postMessage(channel, message);
    return this;
  }

  executeJavaScript(script, { isFile = false } = {}) {
    return RotomecaFrameBrowserWindow.RotomecaBrowserWindow.ExecuteScript(
      this.webContents,
      script,
      {
        isFile,
      },
    );
  }

  /**
   * @type {Electron.WebContentsView}
   * @readonly
   */
  get webView() {
    return this.#_webview;
  }

  /**
   * @type {Electron.WebContents}
   * @readonly
   */
  get webContents() {
    return this.webView.webContents;
  }

  static get RotomecaBrowserWindow() {
    return require('./RotomecaBrowserWindow').RotomecaBrowserWindow;
  }
}

module.exports = { RotomecaFrameBrowserWindow, MenuButton };
