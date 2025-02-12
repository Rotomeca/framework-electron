import { JsEvent } from '../JsEvent.js';
import { HTMLCustomInternalsElement } from './HTMLCustomInternalsElement.js';

export { HTMLCustomFormElement };

/**
 * @class
 * @classdesc
 * @abstract
 * @extends HTMLCustomInternalsElement
 */
class HTMLCustomFormElement extends HTMLCustomInternalsElement {
  // make element form-associated
  static formAssociated = true;
  constructor() {
    super();
    this.onvaluechanged = new JsEvent();
    this.onvaluechanged.add('default', (value, caller) => {
      this.internals.setFormValue(value);
      this.dispatchEvent(
        new CustomEvent('event:custom:change', { detail: { value, caller } }),
      );
    });
  }

  get value() {
    return this._p_getValue();
  }

  set value(value) {
    this._p_setValue(value);
  }

  _p_setValue(value) {
    this.onvaluechanged.call(value, this);
  }

  _p_getValue() {}
}
