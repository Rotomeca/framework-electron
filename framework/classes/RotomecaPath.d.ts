import path from 'path';

export declare type Path = path.PlatformPath;

export declare abstract class RotomecaPath {
  static readonly #_App: Electron.App;
  static readonly Path: Path;
  static readonly AppBasePath: string;
  static RelativeToAppPath(path: string): string;
  static Relative(path1: string, path2: string): string;
}
