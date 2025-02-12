const { WrapperObject } = require('./WrapperObject');

class RotomecaEnv {
  #_isDev;
  constructor() {}

  /**
   * @type {boolean}
   * @readonly
   */
  get IsDev() {
    if ([null, undefined].includes(this.#_isDev)) {
      this.#_isDev = process.argv[2] === '--dev';
    }

    return this.#_isDev;
  }
}

/**
 * @type {WrapperObject<RotomecaEnv>}
 */
const REnv = WrapperObject.Create(RotomecaEnv);

module.exports = { REnv };
