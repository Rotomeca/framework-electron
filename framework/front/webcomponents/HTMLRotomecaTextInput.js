import { AHTMLRotomecaInputCanInput } from '../abstract/HTMLRotomecaInput.js';
import { EMPTY_STRING } from '../constants.js';

export { HTMLRotomeaTextInput };

class HTMLRotomeaTextInput extends AHTMLRotomecaInputCanInput {
  constructor() {
    super();
    this.onvalueinput.add('validitychange', () => {
      if (this.validity.valid) {
        this.setState('valid');
        this.removeState('invalid');
      } else {
        this.setState('invalid');
        this.removeState('valid');
      }

      if (
        this.value !== null &&
        this.value !== undefined &&
        this.value !== EMPTY_STRING
      ) {
        if (!this.internals.states.has('value')) this.setState('value');
      } else if (this.internals.states.has('value')) this.removeState('value');
    });
  }

  /**
   * @type {?string}
   * @readonly
   */
  get autocapitalize() {
    return this.attr('autocapitalize');
  }

  /**
   * @type {?string}
   * @readonly
   */
  get dirname() {
    return this.attr('dirname');
  }

  /**
   * @type {?string}
   * @readonly
   */
  get list() {
    return this.attr('list');
  }

  /**
   * @type {?string}
   * @readonly
   */
  get maxlength() {
    return this.attr('maxlength');
  }

  /**
   * @type {?string}
   * @readonly
   */
  get minlength() {
    return this.attr('minlength');
  }

  /**
   * @type {?string}
   * @readonly
   */
  get pattern() {
    return this.attr('pattern');
  }

  /**
   * @type {?string}
   * @readonly
   */
  get placeholder() {
    return this.attr('placeholder');
  }

  /**
   * @type {?boolean}
   * @readonly
   */
  get readonly() {
    return this.attr('readonly');
  }

  /**
   * @type {?boolean}
   * @readonly
   */
  get required() {
    return this.attr('required');
  }

  /**
   * @type {?number}
   * @readonly
   */
  get size() {
    return this.attr('size');
  }

  /**
   * @type {ValidityState}
   * @readonly
   */
  get validity() {
    return this.input.validity;
  }

  _p_main() {
    super._p_main();

    const attrs = [
      'autocapitalize',
      'dirname',
      'list',
      'maxlength',
      'minlength',
      'pattern',
      'placeholder',
      'readonly',
      'size',
    ];

    const attrsCopy = ['required'];

    for (const attr of attrs) {
      this._p_moveAttribute(attr);
    }

    for (const attr of attrsCopy) {
      this._p_copyAttribute(attr);
    }
  }

  _p_attr(attr) {
    if (this.input) return this.input.getAttribute(attr);
    else return this.getAttribute(attr);
  }

  _p_moveAttribute(attr) {
    if (this._p_copyAttribute(attr)) {
      this.removeAttr(attr);
      return true;
    }

    return false;
  }

  _p_copyAttribute(attr) {
    if (this.getAttribute(attr)) {
      this.input.setAttribute(attr, this.getAttribute(attr));
      return true;
    }

    return false;
  }

  /**
   * @type {string}
   * @readonly
   * @static
   */
  static get TAG() {
    return 'input-text';
  }
}

HTMLRotomeaTextInput.TryDefine(HTMLRotomeaTextInput.TAG, HTMLRotomeaTextInput);
