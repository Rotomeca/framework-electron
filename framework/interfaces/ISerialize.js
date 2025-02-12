/**
 * @class
 * @classdesc Interface pour la serialisation
 * @interface
 * @hideconstructor
 */
class ISerialize {
  constructor() {
    if (this.constructor.name === 'ISerialize')
      throw new Error('La classe est abstraite ! ');
  }

  /**
   * Serialise la classe
   * @return {string}
   * @abstract
   */
  serialize() {}

  /**
   * Transforme la classe en chaîne de charactère
   * @returns {string}
   */
  toString() {
    return this.serialize();
  }
}

module.exports = { ISerialize };
