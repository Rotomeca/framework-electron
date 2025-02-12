import { JsEvent } from '../JsEvent.js';
import { HTMLCustomFormElement } from './HTMLCustomInput.js';
import { EMPTY_STRING } from '../constants.js';
export { AHTMLRotomecaInput, AHTMLRotomecaInputCanInput };

const sheet = `:host{position:relative}:host label{position:absolute;top:0;left:5px;transition:all .1s ease-in}:host input{padding:5px}:host input:focus+label{font-style:italic}:host input:required+label::after{content:'*';color:var(--input-required, red)}:host(:state(value)) label,:host input:focus+label{top:-25px;left:0}:host(:state(primary)) input{background-color:var(--rotomeca-input-primary-background-color);color:var(--rotomeca-input-primary-color);border:var(--rotomeca-input-primary-border);border-radius:var(--rotomeca-input-primary-border-radius)}:host(:state(secondary)) input{background-color:var(--rotomeca-input-secondary-background-color);color:var(--rotomeca-input-secondary-color);border:var(--rotomeca-input-secondary-border);border-radius:var(--rotomeca-input-secondary-border-radius)}:host(:state(success)) input{background-color:var(--rotomeca-input-success-background-color);color:var(--rotomeca-input-success-color);border:var(--rotomeca-input-success-border);border-radius:var(--rotomeca-input-success-border-radius)}:host(:state(error)) input{background-color:var(--rotomeca-input-error-background-color);color:var(--rotomeca-input-error-color);border:var(--rotomeca-input-error-border);border-radius:var(--rotomeca-input-error-border-radius)}/*# sourceMappingURL=./input.css.map */`;

class AHTMLRotomecaInput extends HTMLCustomFormElement {
  #_innerText;
  constructor() {
    super();
  }

  /**
   * @type {string}
   * @readonly
   */
  get inputType() {
    return this.getAttribute('type') || 'text';
  }

  /**
   * @type {boolean}
   * @readonly
   */
  get isDisabled() {
    return !!this.getAttribute('disabled');
  }

  /**
   * @type {?string}
   * @readonly
   */
  get form() {
    return this.getAttribute('form');
  }

  /**
   * @type {?string}
   * @readonly
   */
  get name() {
    return this.getAttribute('name');
  }

  /**
   * @type {?string}
   * @readonly
   */
  get descriptor() {
    return this.input ? this.#_innerText : this.root.textContent;
  }

  /**
   * @type {HTMLInputElement}
   * @readonly
   */
  get input() {
    return this.root.querySelector('input');
  }

  /**
   * @type {('primary' | 'secondary' | 'success' | 'error' | string)}
   * @readonly
   */
  get form() {
    return this._p_get_data('form') || 'primary';
  }

  _p_main() {
    super._p_main();

    if (!this.hasAttribute('id'))
      this.setAttribute('id', this._p_generate_id({ namespace: 'input' }));

    //Create
    let desc = document.createElement('label');
    let input = document.createElement('input');
    let style = document.createElement('style');

    //Input
    input.setAttribute(
      'id',
      this._p_generate_id({ namespace: this.getAttribute('id') }),
    );
    input.setAttribute('type', this.inputType);
    input.addEventListener('change', () => {
      this.onvaluechanged.call(this.input.value, this);
    });
    //Desc
    desc.setAttribute('for', input.getAttribute('id'));
    desc.appendChild(this.createText(this.descriptor));
    //style
    style.appendChild(this.createText(sheet));

    if (!this.#_innerText) this.#_innerText = this.descriptor;

    this.root.innerHTML = EMPTY_STRING;

    this.root.append(style, input, desc);

    this.setState(this.form);

    desc = null;
    input = null;
    style = null;
  }

  _p_getValue() {
    return super._p_getValue() ?? this.input.value;
  }

  _p_setValue(value) {
    super._p_setValue(value);
    this.input.value = value;
  }

  shadowEnabled() {
    return true;
  }
}

class AHTMLRotomecaInputCanInput extends AHTMLRotomecaInput {
  constructor() {
    super();

    this.onvalueinput = new JsEvent();
    this.onvalueinput.add('default', (value, caller) => {
      this.internals.setFormValue(value);
      this.dispatchEvent(
        new CustomEvent('event:custom:input', { detail: { value, caller } }),
      );
    });
  }

  _p_main() {
    super._p_main();

    this.input.addEventListener('input', () => {
      this.onvalueinput.call(this.input.value, this);
    });
  }
}
