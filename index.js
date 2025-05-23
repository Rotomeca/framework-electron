/**
 * @class
 * @classdesc
 * @abstract
 * @hideconstructor
 */
class FrameWorkAbstractExporter {
  /**
   * @type {typeof import('./framework/abstract/AAppObject')}
   * @readonly
   * @static
   */
  static get AAppObject() {
    return require('./framework/abstract/AAppObject');
  }

  /**
   * @type {typeof import('./framework/abstract/AFrameworkObject')}
   * @readonly
   * @static
   */
  static get AFrameworkObject() {
    return require('./framework/abstract/AFrameworkObject');
  }

  /**
   * @type {import('./framework/interfaces/ISerialize').ISerialize}
   * @readonly
   * @static
   */
  static get ISerialize() {
    return require('./framework/interfaces/ISerialize').ISerialize;
  }
}

/**
 * @class
 * @classdesc
 * @abstract
 * @hideconstructor
 */
class RotomecaFrameworkElectron {
  /**
   * @type {typeof FrameWorkAbstractExporter}
   * @readonly
   * @static
   */
  static get Abstract() {
    return FrameWorkAbstractExporter;
  }

  /**
   * @type {import('./framework/classes/ModuleLoader').InternalModuleLoader}
   * @readonly
   * @static
   */
  static get ModuleLoader() {
    return require('./framework/classes/ModuleLoader').RotomecaModuleLoader;
  }

  /**
   * @type {typeof import('./framework/classes/RotomecaBrowserWindow').RotomecaBrowserWindow}
   * @readonly
   * @static
   */
  static get BrowserWindow() {
    return this.ModuleLoader.Instance.browserwindow;
  }

  /**
   * @type {typeof import('./framework/classes/RotomecaEnv').REnv}
   * @readonly
   * @static
   */
  static get Env() {
    return this.ModuleLoader.Instance.env;
  }

  /**
   * @type {typeof import('./framework/classes/RotomecaPath').RotomecaPath}
   * @readonly
   * @static
   */
  static get Path() {
    return this.ModuleLoader.Instance.path;
  }

  /**
   * @type {typeof import('@rotomeca/promise')}
   * @readonly
   * @static
   */
  static get Promise() {
    return this.ModuleLoader.Instance.promise;
  }

  /**
   * @type {typeof import('./framework/classes/Geometry').Geometry}
   * @readonly
   * @static
   */
  static get Geometry() {
    return this.ModuleLoader.Instance.geometry;
  }

  /**
   * @type {typeof import('./framework/classes/SaveData').FileData}
   * @readonly
   * @static
   */
  static get Save() {
    return require('./framework/classes/SaveData').FileData;
  }

  /**
   * @type {string}
   * @readonly
   * @static
   */
  static get EMPTY_STRING() {
    return require('./framework/constants').EMPTY_STRING;
  }

  /**
   * @type {string}
   * @readonly
   * @static
   */
  static get FILE_SEPARATOR() {
    return require('./framework/constants').FILE_SEPARATOR;
  }
}

module.exports = RotomecaFrameworkElectron;
