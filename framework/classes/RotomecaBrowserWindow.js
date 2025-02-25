const { BrowserWindow, app, dialog } = require('electron');
const JsEvent = require('./JsEvent');
const { AFrameworkObject } = require('../abstract/AFrameworkObject.js');
const { RotomecaPromise } = require('./RotomecaPromise.js');
const { EMPTY_STRING } = require('../constants.js');
const { RotomecaModuleLoader } = require('./ModuleLoader.js');

class RotomecaBrowserWindow extends BrowserWindow {
  #_nojs;
  #_page;
  #_envs;
  #__init = false;
  /**
   *
   * @param {Object} [options={}]
   * @param {Electron.BaseWindowConstructorOptions} [options.windowConfig={}]
   * @param {Electron.BrowserViewConstructorOptions} [options.webConfig={}]
   */
  constructor({
    page = 'default',
    noJavascript = false,
    windowConfig = {},
    webConfig = {},
    envs = {},
  } = {}) {
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
        preload: RotomecaBrowserWindow.PreloadPath,
        javascript: !noJavascript,
      },
    };

    for (const key of Object.keys(windowConfig)) {
      config[key] = windowConfig[key];
    }

    for (const key of Object.keys(webConfig)) {
      if (key === 'webPreferences') {
        for (const webKey of webConfig[key]) {
          if (!WEB_IGNORE.includes(webKey)) {
            config.webPreferences[webKey] = webConfig[key][webKey];
          }
        }
      } else config[key] = webConfig[key];
    }

    if (!!config.icon) {
      config.icon = RotomecaBrowserWindow.RotomecaPath.RelativeToAppPath(
        config.icon,
      );
    } else if (RotomecaBrowserWindow.BrowserDefaultIcon) {
      config.icon = RotomecaBrowserWindow.BrowserDefaultIcon;
    }

    super(config);
    this.#_page = page;
    this.#_nojs = noJavascript;
    this.#_envs ??= envs ?? {};

    const show = config.show ?? true;
    if (show) {
      this.#__init = true;
      this.changePage(page);
    }

    this.#_init().#_setup();
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

  addEnv(key, value, { delete_after_sending = false } = {}) {
    this.#_envs[key] = { value, delete_after_sending };
  }

  getEnv(key) {
    return this.#_envs[key]?.value;
  }

  show() {
    super.show();

    if (!this.#__init) {
      this.#__init = true;
      this.changePage(this.#_page);
    }
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

  changePage(page) {
    if (page.includes('http')) this.loadURL(page);
    else {
      this.loadFile(
        RotomecaBrowserWindow.RotomecaPath.Path.join(
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
    const path = RotomecaBrowserWindow.RotomecaPath.Path;
    const splited = filePath.replaceAll('\\', '/').split('/');
    const trueImportPath = splited.slice(0, splited.length - 1).join('/');
    const trueModulePath = path.resolve(`${trueImportPath}/${modulePath}`);

    return path.relative(__dirname, trueModulePath).replaceAll('\\', '/');
  }

  #_executeStartScript() {
    const fs = require('fs');
    //Récupérer le jshtml
    const page = this.#_page;
    const rawFilePath = RotomecaBrowserWindow.RotomecaPath.Path.relative(
      __dirname,
      app.getAppPath() + `/front/pages/${page}/index.jshtml`,
    );

    const filePath = RotomecaBrowserWindow.RotomecaPath.Path.join(
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
      file = fs.readFileSync(filePath.replace('.jshtml', '.js')).toString();
    }

    // Changer les imports par des imports dynamiques
    file = this.#_transformStaticImportsToDynamic(file, filePath);
    // Ajouter la fonction
    file = `async function (exporter, JsHtml, id, env, helper) { ${file} }`;

    if (!this.#_nojs) {
      const jsPath = RotomecaBrowserWindow.RotomecaPath.Path.relative(
        RotomecaBrowserWindow.RotomecaPath.Path.join(
          __dirname,
          '../internalFront',
        ),
        app.getAppPath() + `/front/pages/${page}/main.js`,
      ); //'./main.js';
      this.executeJavaScript(
        `
        (async () => {
          debugger;
          const {Main} = await import('${jsPath.replaceAll('\\', '/')}');
          try {
            const tmp = await Main.Run('${
              this.id
            }', ${file}, ${this.#_loadEnvs()});
          }catch(e) {
            console.error('###[MAIN]', e);
          }
        })();
      `,
      ).fail((e) => {
        dialog
          .showMessageBox({
            type: 'error',
            buttons: ['Ok'],
            title: 'Page Error',
            message: e.message,
          })
          .then(() => app.quit());
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
    return RotomecaBrowserWindow.ExecuteScript(this.webContents, script, {
      isFile,
    });
  }

  /**
   * @async
   * @param {Electron.WebContents} webContents
   * @param {string} script code ou chemin
   * @param {Object} [options={}]
   * @param {boolean} [options.isFile=false]
   * @returns {RotomecaPromise<void>}
   */
  static ExecuteScript(webContents, script, { isFile = false } = {}) {
    return new RotomecaPromise((manager) => {
      manager.resolver.start();
      try {
        if (isFile) {
          const fs = require('fs');
          script = fs.readFileSync(script).toString();
        }

        if (manager.state() !== RotomecaPromise.PromiseStates.cancelled) {
          webContents.executeJavaScript(script).then(
            (data) => manager.resolver.resolve(data),
            (why) => manager.resolver.reject(why),
          );
        }
      } catch (error) {
        manager.resolver.reject(error);
      }
    });
  }

  static #_BrowserDefaultIcon;

  /**
   * @type {string | false}
   * @readonly
   * @static
   */
  static get BrowserDefaultIcon() {
    if (AFrameworkObject.Empty.isNullOrUndefined(this.#_BrowserDefaultIcon)) {
      const fs = require('fs');
      if (
        fs.existsSync(this.RotomecaPath.AppBasePath + '/browserDefaultIcon.png')
      ) {
        this.#_BrowserDefaultIcon = this.RotomecaPath.RelativeToAppPath(
          'browserDefaultIcon.png',
        );
      } else this.#_BrowserDefaultIcon = false;
    }

    return this.#_BrowserDefaultIcon;
  }

  /**
   * @type {typeof import('../classes/RotomecaPath.js').RotomecaPath}
   * @readonly
   */
  static get RotomecaPath() {
    return require('../classes/RotomecaPath.js').RotomecaPath;
  }

  /**
   * @type {string}
   * @readonly
   * @static
   */
  static get PreloadPath() {
    return RotomecaBrowserWindow.RotomecaPath.Path.join(
      __dirname,
      '../preload.js',
    );
  }
}

module.exports = { RotomecaBrowserWindow };
