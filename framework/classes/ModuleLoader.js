const { WrapperObject } = require('./WrapperObject');

/**
 * @typedef {WrapperObject<_RotomecaModuleLoader>} InternalModuleLoader
 */

class _RotomecaModuleLoader {
  constructor() {}

  /**
   * @template T
   * @param {string} module
   * @returns {T}
   */
  get(module) {
    return require(module);
  }

  /**
   * @type {typeof Electron.CrossProcessExports}
   * @readonly
   */
  get electron() {
    return this.get('electron');
  }

  /**
   * @type {typeof import('fs')}
   * @readonly
   */
  get fs() {
    return require('fs');
  }

  /**
   * @type {typeof import('./RotomecaPath').RotomecaPath}
   * @readonly
   */
  get path() {
    return require('./RotomecaPath').RotomecaPath;
  }

  /**
   * @type {typeof import('./RotomecaEnv').REnv}
   * @readonly
   */
  get env() {
    return require('./RotomecaEnv').REnv;
  }

  /**
   * @readonly
   */
  get promise() {
    return require('@rotomeca/promise');
  }

  /**
   * @type {typeof import('./RotomecaBrowserWindow').RotomecaBrowserWindow}
   * @readonly
   */
  get browserwindow() {
    return require('./RotomecaBrowserWindow').RotomecaBrowserWindow;
  }

  /**
   * @type {typeof import('./RotomecaFrameBrowserWindow').RotomecaFrameBrowserWindow}
   * @readonly
   */
  get customTopBrowserWindow() {
    return require('./RotomecaFrameBrowserWindow').RotomecaFrameBrowserWindow;
  }

  /**
   * @type {typeof import('./RotomecaFrameBrowserWindow').MenuButton}
   * @readonly
   */
  get rbwMenuButton() {
    return require('./RotomecaFrameBrowserWindow').MenuButton;
  }

  /**
   * @type {typeof import('./Geometry')}
   * @readonly
   */
  get geometry() {
    return require('./Geometry');
  }

  /**
   * @type {typeof import('os')}
   * @readonly
   */
  get os() {
    return require('os');
  }

  /**
   * @type {typeof import('./SaveData').FileData}
   * @readonly
   */
  get fileManipulator() {
    return require('./SaveData').FileData;
  }

  /**
   * @type {typeof import('./RJSParser').RJSParser}
   * @readonly
   */
  get RJSParser() {
    return require('./RJSParser').RJSParser;
  }
}

/**
 * @type {InternalModuleLoader}
 */
const RotomecaModuleLoader = new WrapperObject(_RotomecaModuleLoader);

module.exports = { RotomecaModuleLoader };
