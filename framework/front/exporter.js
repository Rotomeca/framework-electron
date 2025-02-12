export { Exporter };

class Exporter {
  #_headers = [];
  #_footers = [];
  #_export;
  #_generateWrapper = false;
  #_title = 'Unknown Page';
  constructor() {}

  setTitle(title) {
    this.#_title = title;
    return this;
  }

  generateWrapper() {
    this.#_generateWrapper = true;
    return this;
  }

  addToHeader(jshtml) {
    this.#_headers.push(jshtml);
    return this;
  }

  addToFooter(jshtml) {
    this.#_footers.push(jshtml);
    return this;
  }

  export(jshtml) {
    this.#_export = jshtml;
  }

  /**
   * @private
   */
  *[Symbol.iterator]() {
    yield this.#_headers;
    yield {
      title: this.#_title,
      generateWrapper: this.#_generateWrapper,
      exported: this.#_export,
    };
    yield this.#_footers;
  }
}
