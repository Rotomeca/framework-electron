class RotomecaPath {
  constructor() {}

  static RelativeToAppPath(path) {
    return this.Path.relative(this.AppBasePath, `${this.AppBasePath}\\${path}`);
  }

  /**
   * @type {import('path').PlatformPath}
   * @readonly
   */
  static get Path() {
    return require('path');
  }

  /**
   * @type {string}
   * @readonly
   */
  static get AppBasePath() {
    return this.#_App.getAppPath();
  }

  /**
   * @type {Electron.App}
   * @readonly
   * @private
   * @static
   */
  static get #_App() {
    return require('electron/main').app;
  }
}

module.exports = { RotomecaPath };
