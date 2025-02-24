const { RotomecaPromise } = require('../classes/RotomecaPromise');
const { EMPTY_STRING } = require('../constants');

/**
 * @callback NotificationEventCallback
 * @param {Electron.Event} event
 * @return {void}
 */

/**
 * @callback NotificationEventReplyCallback
 * @param {Electron.Event} event
 * @param {string} reply
 * @return {void}
 */

/**
 * @callback NotificationEventErrorCallback
 * @param {Electron.Event} event
 * @param {string} error
 * @return {void}
 */

/**
 * @callback NotificationEventActionCallback
 * @param {Electron.Event} event
 * @param {number} index
 * @return {void}
 */

/**
 * @callback IsAbortedCallback
 * @returns {boolean}
 */

/**
 * @typedef DialogResponse
 * @property {number} response
 * @property {IsAbortedCallback} isAborted
 */

/**
 * @typedef DialogAfterData
 * @property {AFrameworkObject} caller
 * @property {IsAbortedCallback} isAborted
 */

/**
 * @callback DialogActionCallback
 * @param {DialogResponse} data
 * @param {AFrameworkObject} caller
 * @returns {void}
 */

/**
 * @callback DialogAfterCallback
 * @param {DialogAfterData} data
 * @returns {void}
 */

/**
 * @callback DialogActionCallbackAsync
 * @param {number} response
 * @param {AFrameworkObject} caller
 * @returns {Promise<void> | RotomecaPromise<void>}
 * @async
 */

/**
 * @callback DialogAfterCallbackAsync
 * @param {AFrameworkObject} caller
 * @returns {Promise<void> | RotomecaPromise<void>}
 * @async
 */

class NotificationWrapper {
  /**
   * @type {boolean}
   * @readonly
   * @static
   */
  static get IsSupported() {
    return this.#_Notification.isSupported();
  }

  /**
   * Créer une notification et l'affiche
   * @param {string} title
   * @param {string} body
   * @param {Object} [options={}]
   * @param {string | undefined} [options.subtitle=undefined]
   * @param {string | undefined} [options.icon=undefined]
   * @param {('normal' | 'critical' | 'low')} [options.urgency='normal']
   * @param {boolean} [options.hasReply='false']
   * @param {('default' | 'never')} [options.timeoutType='default']
   * @param {string | undefined} [options.replyPlaceholder=undefined]
   * @param {string | undefined} [options.sound=undefined]
   * @param {Electron.NotificationAction[] | undefined} [options.actions=undefined]
   * @param {string | undefined} [options.closeButtonText=undefined]
   * @param {string | undefined} [options.toastXml=undefined]
   * @param {?NotificationEventCallback} [options.onShow=null]
   * @param {?NotificationEventCallback} [options.onClick=null]
   * @param {?NotificationEventCallback} [options.onClose=null]
   * @param {?NotificationEventReplyCallback} [options.onReply=null]
   * @param {?NotificationEventErrorCallback} [options.onFailed=null]
   * @param {?NotificationEventActionCallback} [options.onAction=null]
   * @returns {Electron.CrossProcessExports.Notification}
   * @static
   */
  static Create(
    title,
    body,
    {
      subtitle = undefined,
      icon = undefined,
      urgency = 'normal',
      hasReply = false,
      timeoutType = 'default',
      replyPlaceholder = undefined,
      sound = undefined,
      actions = undefined,
      closeButtonText = undefined,
      toastXml = undefined,
      onShow = null,
      onClick = null,
      onClose = null,
      onFailed = null,
      onReply = null,
      onAction = null,
    } = {},
  ) {
    let notification = new this.#_Notification({
      title,
      body,
      subtitle,
      icon,
      urgency,
      hasReply,
      timeoutType,
      replyPlaceholder,
      sound,
      actions,
      closeButtonText,
      toastXml,
    });

    if (onShow) notification.on('show', onShow);

    if (onClick) notification.on('click', onClick);

    if (onClose) notification.on('close', onClose);

    if (onFailed) notification.on('failed', onFailed);

    if (onReply) notification.on('reply', onReply);

    if (onAction) notification.on('action');

    notification.show();

    return notification;
  }

  static get #_Notification() {
    return AFrameworkObject.RotomecaModuleLoader.Instance.electron.Notification;
  }
}

class AFrameworkObject {
  constructor() {}

  isNullOrUndefined(item) {
    return item === null || item === undefined;
  }

  isAsync(func) {
    return func.constructor.name === 'AsyncFunction';
  }

  isDecimal(number) {
    return ~~number !== number;
  }

  /**
   * Vérifie si une varible est un tableau ou quelque chose qui y ressemble
   * @param {*} item
   * @returns {bool}
   */
  isArrayLike(item) {
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
   */
  toHex(number) {
    return number.toString(16);
  }

  capitalize(s) {
    if (typeof s !== 'string') return '';

    s = s.toLowerCase();
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  getRelativePos(elm) {
    let pPos = elm.parentNode.getBoundingClientRect(), // parent pos
      cPos = elm.getBoundingClientRect(), // target pos
      pos = {};

    (pos.top = cPos.top - pPos.top + elm.parentNode.scrollTop),
      (pos.right = cPos.right - pPos.right),
      (pos.bottom = cPos.bottom - pPos.bottom),
      (pos.left = cPos.left - pPos.left);

    return pos;
  }

  /**
   *
   * @param {string} name
   * @param {T} data
   * @returns {typeof import('../classes/SaveData').FileData<T>}
   * @template T
   *
   */
  save(name, data) {
    return this.fileManipulator.Save(name, data);
  }

  /**
   *
   * @param {T} data
   * @returns {typeof import('../classes/SaveData').FileData<T>}
   * @template T
   *
   */
  saveMainData(data) {
    return this.save(this.mainDataFileName, data);
  }

  /**
   *
   * @param {T} settings
   * @returns {typeof import('../classes/SaveData').FileData<T>}
   * @template T
   *
   */
  saveSettings(settings) {
    return this.save(this.settingsFileName, settings);
  }

  /**
   *
   * @param {string} name
   * @returns {RotomecaPromise<{fileManipulator:typeof import('../classes/SaveData').FileData<T>, data:false | T, loadSuccess: boolean}>}
   * @async
   * @template T
   */
  load(name) {
    return RotomecaPromise.Start(
      async () => await this.fileManipulator.Load(name),
    );
  }

  /**
   *
   * @returns {RotomecaPromise<{fileManipulator:typeof import('../classes/SaveData').FileData<T>, data:false | T, loadSuccess: boolean}>}
   * @async
   * @template T
   */
  loadMainData() {
    return this.load(this.mainDataFileName);
  }

  /**
   *
   * @returns {RotomecaPromise<{fileManipulator:typeof import('../classes/SaveData').FileData<T>, data:false | T, loadSuccess: boolean}>}
   * @async
   * @template T
   */
  loadSettingsData() {
    return this.load(this.settingsFileName);
  }

  /**
   * @type {string}
   * @readonly
   */
  get mainDataFileName() {
    return 'data.rfsave';
  }

  /**
   * @type {string}
   * @readonly
   */
  get settingsFileName() {
    return 'settings.rfsave';
  }

  /**
   * @type {typeof import('../classes/SaveData').FileData}
   * @readonly
   */
  get fileManipulator() {
    return AFrameworkObject.RotomecaModuleLoader.Instance.fileManipulator;
  }

  get dialog() {
    return RotomecaDialog;
  }

  /**
   * @type {typeof NotificationWrapper}
   * @readonly
   */
  get notification() {
    return NotificationWrapper;
  }

  /**
   * @type {typeof Electron.CrossProcessExports}
   * @readonly
   */
  get electron() {
    return require('electron');
  }

  /**
   * @type {RotomecaPath}
   * @readonly
   */
  get rotomecaPath() {
    return AFrameworkObject.RotomecaPath;
  }

  /**
   * @type {boolean}
   * @readonly
   */
  get isDev() {
    return AFrameworkObject.RotomecaModuleLoader.Instance.env.Instance.IsDev;
  }

  /**
   * @type {typeof import('../classes/RotomecaPath').RotomecaPath}
   * @readonly
   */
  static get RotomecaPath() {
    return this.RotomecaModuleLoader.Instance.path;
  }

  /**
   * @type {typeof import('../classes/ModuleLoader').RotomecaModuleLoader}
   * @readonly
   */
  static get RotomecaModuleLoader() {
    return require('../classes/ModuleLoader').RotomecaModuleLoader;
  }

  /**
   * @type {Readonly<EmptyFrameworkObject>}
   * @readonly
   * @static
   */
  static get Empty() {
    if (!this._empty) this._empty = Object.freeze(new EmptyFrameworkObject());

    return this._empty;
  }
}

class RotomecaDialog {
  /**
   *
   * @param {string} title
   * @param {string} message
   * @param {Object} [options={}]
   * @param {('none' | 'info' | 'error' | 'question ' | 'warning')} [options.type='info']
   * @param {string[]} [options.buttons=['Ok']]
   * @param {string} [options.detail='']
   * @param {DialogActionCallback | DialogActionCallbackAsync| null} [options.onButtonClick=null]
   * @param {DialogAfterCallback | DialogAfterCallbackAsync | null} [options.onAfter=null]
   * @returns {RotomecaPromise<Electron.MessageBoxReturnValue>}
   * @async
   * @static
   */
  static ShowDialog(
    title,
    message,
    {
      type = 'info',
      buttons = ['Ok'],
      detail = EMPTY_STRING,
      onButtonClick = null,
      onAfter = null,
    } = {},
  ) {
    return RotomecaPromise.Start((manager) => {
      manager.resolver.start();
      this.#_Electron.dialog
        .showMessageBox({
          title,
          message,
          type,
          buttons,
          detail,
        })
        .then(async (returnvalue) => {
          var promise;
          if (onButtonClick) {
            promise = onButtonClick(
              {
                response: returnvalue.response,
                isAborted: () =>
                  manager.state === RotomecaPromise.PromiseStates.cancelled,
              },
              this,
            );

            if (promise && promise.then) await promise;
          }

          if (onAfter) {
            promise = onAfter({
              caller: this,
              isAborted: () =>
                manager.state === RotomecaPromise.PromiseStates.cancelled,
            });

            if (promise && promise.then) await promise;
          }

          manager.resolver.resolve(returnvalue);
        });
    });
  }

  static ShowInfoDialog(
    title,
    message,
    {
      buttons = ['Ok'],
      detail = EMPTY_STRING,
      onButtonClick = null,
      onAfter = null,
    } = {},
  ) {
    return this.ShowDialog(title, message, {
      type: 'info',
      buttons,
      detail,
      onButtonClick,
      onAfter,
    });
  }

  static ShowErrorDialog(
    title,
    message,
    {
      buttons = ['Ok'],
      detail = EMPTY_STRING,
      onButtonClick = null,
      onAfter = null,
    } = {},
  ) {
    return this.ShowDialog(title, message, {
      type: 'error',
      buttons,
      detail,
      onButtonClick,
      onAfter,
    });
  }

  static ShowWarningDialog(
    title,
    message,
    {
      buttons = ['Ok'],
      detail = EMPTY_STRING,
      onButtonClick = null,
      onAfter = null,
    } = {},
  ) {
    return this.ShowDialog(title, message, {
      type: 'warning',
      buttons,
      detail,
      onButtonClick,
      onAfter,
    });
  }

  static Ask(
    title,
    message,
    buttons,
    { detail = EMPTY_STRING, onButtonClick = null, onAfter = null } = {},
  ) {
    return this.ShowDialog(title, message, {
      type: 'question ',
      buttons,
      detail,
      onButtonClick,
      onAfter,
    });
  }

  /**
   * @type {typeof Electron.CrossProcessExports}
   * @readonly
   */
  static get #_Electron() {
    return AFrameworkObject.RotomecaModuleLoader.Instance.electron; //this.#_ModuleLoader.Instance.electron;
  }
}

class EmptyFrameworkObject extends AFrameworkObject {
  constructor() {
    super();
  }
}

module.exports = { AFrameworkObject };
