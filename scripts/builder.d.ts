declare namespace RotomecaBuilder {
  namespace Helper {
    type EmptyPromise = Promise<void>;
    type Start = (workingFolder: string, command: string) => void;
  }
}

export declare class RotomecaLuncher {
  constructor(baseFolder: string);
  findFile(
    dir: string,
    { ext, nameIncludes }?: { ext: string; nameIncludes?: boolean },
  ): Generator<string, string, string>;
  buildFront({
    minify,
  }?: {
    minify?: boolean;
  }): RotomecaBuilder.Helper.EmptyPromise;
  unbuildFront(): void;
  parseJsHtmlFile(element: string): void;
  parseJsHtmlString(readingFile: string): string;
  parseRjsFile(element: string): RotomecaBuilder.Helper.EmptyPromise;
  findAndParseJsHtmlFile(): RotomecaBuilder.Helper.EmptyPromise;
  findAndParseRJsFile(): Promise<PromiseSettledResult<void>[]>;
  findAndRemoveParsedJsHtml(): RotomecaBuilder.Helper.EmptyPromise;
  findAndRemove_JsHtml(): RotomecaBuilder.Helper.EmptyPromise;
  start(): RotomecaBuilder.Helper.EmptyPromise;
  end(): RotomecaBuilder.Helper.EmptyPromise;
  static Start(
    workingFolder: string,
    command: string,
  ): RotomecaBuilder.Helper.EmptyPromise;
}

export declare const Start: RotomecaBuilder.Helper.Start;
