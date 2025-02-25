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
