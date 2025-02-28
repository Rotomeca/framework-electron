const { RotomecaModuleLoader } = require('./ModuleLoader');

class RJSParser {
  #_file;
  #_parsed;
  constructor(file) {
    this.#_file = file;
  }

  destroy() {
    this.#_file = null;
    this.#_parsed = null;
    return null;
  }

  get() {
    if (!this.#_parsed)
      this.#_parsed = this.#_parseSetInterval().#_parseWhile().#_file;
    return this.#_parsed;
  }

  /**
   * @async
   * @returns {import('@rotomeca/promise')<string>}
   */
  getAsync() {
    return new RotomecaModuleLoader.Instance.promise.Start(() => this.get());
  }

  #_parseSetInterval() {
    // Expression régulière pour détecter setInterval<...>(...)
    const regex =
      /setInterval<(\d+)>\(([\s\S]*?),\s*(\d+)(?:,\s*([\s\S]*?))?\)/g;

    // Remplacement par la version encapsulée
    this.#_file = this.#_file.replaceAll(
      new RegExp(regex),
      (match, max, callback, ms, args) => {
        // Si des arguments supplémentaires sont présents, on les ajoute
        const argsPart = args ? `, ${args}` : '';
        return `((max, callback, ms, ...args) => {
        let it = 0;
        const interval = setInterval(
          (...args) => {
            if (it++ >= max) clearInterval(interval);
            else callback(...args);
          },
          ms,
          ...args,
        );
        return interval;
      })(${max}, ${callback}, ${ms}${argsPart})`;
      },
    );

    return this;
  }

  #_parseWhile() {
    // Expression régulière pour détecter while<X>(...) {...}
    const regex2 = /while<(\d+)>\(([\s\S]*?)\)\s*\{([\s\S]*?)\}/g;

    // Remplacement par la version encapsulée avec un compteur
    this.#_file = this.#_file.replace(regex2, (match, max, condition, body) => {
      return `{
  let generatedIt = 0;
  while (${condition} && generatedIt < ${max}) {
    ${body}
    generatedIt++;
  }
}`;
    });
    return this;
  }

  /**
   *
   * @param {string} file
   * @returns {string}
   */
  static Parse(file) {
    let parser = new RJSParser(file);
    const parsed = parser.get();
    parser = parser.destroy();
    return parsed;
  }

  /**
   * @async
   * @param {string} file
   * @returns {import('@rotomeca/promise')<string>}
   */
  static ParseAsync(file) {
    return new RJSParser(file).getAsync();
  }
}

module.exports = { RJSParser };
