class RotomecaPath {
  constructor() {}

  static RelativeToAppPath(path) {
    return this.Path.relative(this.AppBasePath, `${this.AppBasePath}\\${path}`);
  }

  static Relative(path1, path2) {
    let path = this.Path.relative(path1, path2);

    if (path[0] === '.') path = `./${path}`;

    return path.replaceAll('\\', '/');
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
