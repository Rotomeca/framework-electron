import { Exporter } from '../exporter.js';
import { JsHtml } from '../JsHtml.js';

/**
 * @callback FrontCallback
 * @param {Exporter} exporter
 * @param {string | number} id
 * @return {void}
 */

export class AFrontObject {
  #_id;
  #_data;
  constructor(id) {
    this.#_id = id;
  }

  async #_setGenerated(callback, envs) {
    let observed = null;
    let exporter = new Exporter();
    await callback(exporter, JsHtml, this.id, envs, AFrontObject.Empty);

    let parentDiv;
    let it = 0;
    let item;
    let wrapper;

    for (const element of exporter) {
      wrapper = false;
      item = element;
      switch (it++) {
        //Head
        case 0:
          if (!element.length) continue;

          parentDiv = document.querySelector('head');
          break;

        //main
        case 1:
          if (!element) continue;

          parentDiv = document.querySelector('#layout');
          item = element.exported;
          wrapper = element.generateWrapper;
          //debugger;

          if (element.title)
            document.querySelector('title').innerText = element.title;
          break;

        //footer
        case 2:
          if (!element.length) continue;

          parentDiv = document.querySelector('footer');
          break;

        default:
          break;
      }

      observed = this.#_appendAndGetObservators(
        parentDiv,
        item,
        wrapper,
        observed,
      );
      parentDiv = null;
    }

    return observed ?? {};
  }

  /**
   *
   * @param {HTMLDivElement | HTMLHeadElement | HTMLElement} parent
   * @param {import('../JsHtml.js')._JsHtml | import('../JsHtml.js')._JsHtml[]} element
   * @param {boolean} generateWrapper
   * @param {?Object<string, (HTMLElement[] | HTMLDivElement)>} [defaultObserver=null]
   */
  #_appendAndGetObservators(
    parent,
    element,
    generateWrapper,
    defaultObserver = null,
  ) {
    let obervers = defaultObserver;
    if (!Array.isArray(element)) {
      const generated = element.generate({ generateWrapper });

      if (!obervers) obervers = generated.observed ?? {};
      else {
        for (const key in generated.observed) {
          if (Object.prototype.hasOwnProperty.call(generated.observed, key)) {
            const item = generated.observed[key];
            obervers[key] = item;
          }
        }
      }

      parent.append(
        ...(Array.isArray(generated.generated)
          ? generated.generated
          : [generated.generated]),
      );
    } else {
      for (const item of element) {
        obervers = this.#_appendAndGetObservators(
          parent,
          item,
          generateWrapper,
          obervers,
        );
      }
    }

    return obervers;
  }

  /**
   * @type {string}
   * @readonly
   */
  get id() {
    return this.#_id;
  }

  /**
   * @type {Object<string, HTMLElement>, generated:(HTMLElement[] | HTMLDivElement)}
   * @readonly
   */
  get front() {
    return this.#_data;
  }

  /**
   * @type {HTMLBodyElement}
   * @readonly
   */
  get body() {
    return document.querySelector('body');
  }

  async start(callback, envs) {
    this.#_data = await this.#_setGenerated(callback, envs);
    this._p_initListeners();
    this._p_main();
    this._p_exports();
    return this;
  }

  /**
   * @protected
   * @abstract
   */
  _p_initListeners() {}
  /**
   * @protected
   * @abstract
   */
  _p_main() {}
  /**
   * @protected
   * @abstract
   */
  _p_exports() {}

  /**
   *
   * @param {*} channel
   * @param {*} callback
   * @returns {this}
   * @protected
   */
  _p_addListener(channel, callback) {
    window.api.on(channel, (_, data) => callback(data));
    return this;
  }

  /**
   *
   * @param {*} channel
   * @param {*} data
   * @returns {Promise<void>}
   * @protected
   */
  _p_invoke(channel, data) {
    return window.api.invoke(channel, data);
  }

  /**
   *
   * @param {*} item
   * @returns {boolean}
   * @protected
   */
  _p_isNullOrUndefined(item) {
    return item === null || item === undefined;
  }

  /**
   *
   * @param {*} func
   * @returns {boolean}
   * @protected
   */
  _p_isAsync(func) {
    return func.constructor.name === 'AsyncFunction';
  }

  /**
   *
   * @param {*} number
   * @returns {boolean}
   * @protected
   */
  _p_isDecimal(number) {
    return ~~number !== number;
  }

  /**
   * Vérifie si une varible est un tableau ou quelque chose qui y ressemble
   * @param {*} item
   * @returns {bool}
   * @protected
   */
  _p_isArrayLike(item) {
    return (
      !!item &&
      typeof item === 'object' &&
      // eslint-disable-next-line no-prototype-builtins
      item.hasOwnProperty('length') &&
      typeof item.length === 'number' &&
      item.length > 0 &&
      item.length - 1 in item
    );
  }

  /**
   * Change un nombre en base 10 en hexadécimal
   * @param {number} number
   * @returns {string} Hexadecimal number
   * @protected
   */
  _p_toHex(number) {
    return number.toString(16);
  }

  /**
   *
   * @param {*} s
   * @returns {string}
   * @protected
   */
  _p_capitalize(s) {
    if (typeof s !== 'string') return '';

    s = s.toLowerCase();
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  /**
   *
   * @param {*} elm
   * @returns {Object}
   * @protected
   */
  _p_getRelativePos(elm) {
    let pPos = elm.parentNode.getBoundingClientRect(), // parent pos
      cPos = elm.getBoundingClientRect(), // target pos
      pos = {};

    (pos.top = cPos.top - pPos.top + elm.parentNode.scrollTop),
      (pos.right = cPos.right - pPos.right),
      (pos.bottom = cPos.bottom - pPos.bottom),
      (pos.left = cPos.left - pPos.left);

    return pos;
  }

  static Run(id, callback, envs) {
    return new this.prototype.constructor(id).start(callback, envs);
  }

  /**
   * @type {Readonly<EmptyFrontObject>}
   * @readonly
   * @static
   */
  static get Empty() {
    if (!this._empty) this._empty = Object.freeze(new EmptyFrontObject());

    return this._empty;
  }
}

class EmptyFrontObject extends AFrontObject {
  constructor() {
    super();
  }

  /**
   *
   * @param {*} channel
   * @param {*} callback
   * @returns {this}
   * @public
   */
  addListener(channel, callback) {
    return this._p_addListener(channel, callback);
  }

  /**
   *
   * @param {*} channel
   * @param {*} data
   * @returns {Promise<void>}
   * @public
   */
  invoke(channel, data) {
    return this._p_invoke(channel, data);
  }

  /**
   *
   * @param {*} item
   * @returns {boolean}
   * @public
   */
  isNullOrUndefined(item) {
    return this._p_isNullOrUndefined(item);
  }

  /**
   *
   * @param {*} func
   * @returns {boolean}
   * @public
   */
  isAsync(func) {
    return this._p_isAsync(func);
  }

  /**
   *
   * @param {*} number
   * @returns {boolean}
   * @public
   */
  isDecimal(number) {
    return this._p_isDecimal(number);
  }

  /**
   * Vérifie si une varible est un tableau ou quelque chose qui y ressemble
   * @param {*} item
   * @returns {bool}
   * @public
   */
  isArrayLike(item) {
    return this._p_isArrayLike(item);
  }

  /**
   * Change un nombre en base 10 en hexadécimal
   * @param {number} number
   * @returns {string} Hexadecimal number
   * @public
   */
  toHex(number) {
    return this._p_toHex(number);
  }

  /**
   *
   * @param {*} s
   * @returns {string}
   * @public
   */
  capitalize(s) {
    return this._p_capitalize(s);
  }

  /**
   *
   * @param {*} elm
   * @returns {Object}
   * @public
   */
  getRelativePos(elm) {
    return this._p_getRelativePos(elm);
  }
}
