import AApObject from './framework/abstract/AAppObject';
import AFrameworkObject from './framework/abstract/AFrameworkObject';
import { ISerialize } from './framework/interfaces/ISerialize';

export = RotomecaFrameworkElectron;

declare module '@rotomeca/framework-electron';
declare abstract class FrameWorkAbstractExporter {
  static readonly AAppObject: typeof AApObject;
  static readonly AFrameworkObject: typeof AFrameworkObject;
  static readonly ISerialize: ISerialize;
}
declare abstract class RotomecaFrameworkElectron {
  static readonly Abstract: typeof FrameWorkAbstractExporter;
}
