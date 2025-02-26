import { InternalModuleLoader } from '../classes/ModuleLoader';
import { RotomecaPath } from '../classes/RotomecaPath';
import { RotomecaPromise } from '../classes/RotomecaPromise';
import { FileData, LoadedData } from '../classes/SaveData';

export = AFrameworkObject;

declare type NotificationEventCallback = (event: Electron.Event) => void;
declare type NotificationEventReplyCallback = (
  event: Electron.Event,
  reply: string,
) => void;
declare type NotificationEventErrorCallback = (
  event: Electron.Event,
  error: string,
) => void;
declare type NotificationEventActionCallback = (
  event: Electron.Event,
  index: number,
) => void;
declare type IsAbortedCallback = () => boolean;
declare type DialogResponse = (
  response: number,
  isAborted: IsAbortedCallback,
) => void;
declare type DialogAfterData = (
  caller: AFrameworkObject,
  isAborted: IsAbortedCallback,
) => void;
declare type DialogActionCallback = (
  data: DialogResponse,
  isAborted: IsAbortedCallback,
) => void;
declare type DialogAfterCallback = (data: DialogAfterData) => void;
declare type DialogActionCallbackAsync = (
  response: number,
  caller: AFrameworkObject,
) => void;
declare type DialogAfterCallbackAsync = (
  caller: AFrameworkObject,
) => Promise<void> | RotomecaPromise<void>;

declare type NotificationWrapperCreateOptions = {
  subtitle: string | undefined;
  icon: string | undefined;
  urgency: 'normal' | 'critical' | 'low';
  hasReply: boolean;
  timeoutType: 'default' | 'never';
  replyPlaceholder: string | undefined;
  sound: string | undefined;
  actions: undefined | Electron.NotificationAction[];
  closeButtonText: string | undefined;
  toastXml: undefined | string;
  onShow: ?NotificationEventCallback;
  onClick: ?NotificationEventCallback;
  onClose: ?NotificationEventCallback;
  onFailed: ?NotificationEventErrorCallback;
  onReply: ?NotificationEventReplyCallback;
  onAction: ?NotificationEventActionCallback;
};

declare abstract class NotificationWrapper {
  static readonly #_Notification: typeof Electron.CrossProcessExports.Notification;
  static readonly IsSupported: boolean;
  static Create(
    title: string,
    body: string,
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
    }?: NotificationWrapperCreateOptions,
  ): Electron.CrossProcessExports.Notification;
}

declare abstract class AFrameworkObject {
  constructor();

  readonly mainDataFileName: string;
  readonly settingsFileName: string;
  readonly fileManipulator: typeof FileData;
  readonly dialog: typeof RotomecaDialog;
  readonly notification: typeof NotificationWrapper;
  readonly electron: typeof import('electron');
  readonly rotomecaPath: typeof RotomecaPath;
  readonly isDev: boolean;

  isNullOrUndefined(item: any): boolean;
  isAsync(fun: Function): boolean;
  isDecimal(number: number): boolean;
  isArrayLike(item: any): boolean;
  toHex(number: number): string;
  getRelativePos(elm: Element): {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  save<T>(name: string, data: T): FileData<T>;
  saveMainData<T>(data: T): FileData<T>;
  saveSettings<T>(settings: T): FileData<T>;
  load<T>(name: string): RotomecaPromise<LoadedData<T>>;
  loadMainData<T>(): RotomecaPromise<LoadedData<T>>;
  loadSettingsData<T>(): RotomecaPromise<LoadedData<T>>;

  static readonly RotomecaPath: typeof RotomecaPath;
  static readonly RotomecaModuleLoader: InternalModuleLoader;
  static readonly Empty: Readonly<EmptyFrameworkObject>;
}

declare class EmptyFrameworkObject extends AFrameworkObject {
  constructor();
}

declare type RotomecaDialogShowDefaultOption = {
  type: 'none' | 'info' | 'error' | 'question ' | 'warning';
  buttons: string[];
  detail: string;
  onButtonClick: DialogActionCallback | DialogActionCallbackAsync;
  onAfter: DialogAfterCallback | DialogAfterCallbackAsync;
};

declare type RotomecaDialogShowTypedDefaultOption = {
  buttons: string[];
  detail: string;
  onButtonClick: DialogActionCallback | DialogActionCallbackAsync;
  onAfter: DialogAfterCallback | DialogAfterCallbackAsync;
};

declare type RotomecaDialogShowAskDefaultOption = {
  detail: string;
  onButtonClick: DialogActionCallback | DialogActionCallbackAsync;
  onAfter: DialogAfterCallback | DialogAfterCallbackAsync;
};

declare abstract class RotomecaDialog {
  static ShowDialog(
    title: string,
    message: string,
    {
      type = 'info',
      buttons = ['Ok'],
      detail = '',
      onButtonClick = null,
      onAfter = null,
    }?: RotomecaDialogShowDefaultOption,
  ): RotomecaPromise<Electron.MessageBoxReturnValue>;

  static ShowInfoDialog(
    title: string,
    message: string,
    {
      buttons = ['Ok'],
      detail = EMPTY_STRING,
      onButtonClick = null,
      onAfter = null,
    }?: RotomecaDialogShowTypedDefaultOption,
  ): RotomecaPromise<Electron.MessageBoxReturnValue>;

  static ShowErrorDialog(
    title: string,
    message: string,
    {
      buttons = ['Ok'],
      detail = EMPTY_STRING,
      onButtonClick = null,
      onAfter = null,
    }?: RotomecaDialogShowTypedDefaultOption,
  ): RotomecaPromise<Electron.MessageBoxReturnValue>;

  static ShowWarningDialog(
    title: string,
    message: string,
    {
      buttons = ['Ok'],
      detail = EMPTY_STRING,
      onButtonClick = null,
      onAfter = null,
    }?: RotomecaDialogShowTypedDefaultOption,
  ): RotomecaPromise<Electron.MessageBoxReturnValue>;

  static Ask(
    title: string,
    message: string,
    buttons: string[],
    {
      detail = EMPTY_STRING,
      onButtonClick = null,
      onAfter = null,
    }?: RotomecaDialogShowAskDefaultOption,
  ): RotomecaPromise<Electron.MessageBoxReturnValue>;
}
