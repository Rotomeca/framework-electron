import { HTMLCustomButton } from '../abstract/HTMLCustomButton.js';
const sheet = `:host{transition:all .1s ease-in;border-radius:var(--rotomeca-border-radius-2);padding:'var(--ce-html-button-padding, 5px 10px)';cursor:'pointer';display:'var(--ce-html-button-display, inline-block)'}:host(:state(primary)){background-color:var(--rotomeca-button-primary-background-color);color:var(--rotomeca-button-primary-color);border:var(--rotomeca-button-primary-border)}:host(:hover:state(primary)){background-color:var(--rotomeca-button-primary-hover-background-color);color:var(--rotomeca-button-primary-hover-color);border:var(--rotomeca-button-primary-hover-border)}:host(:active:state(primary)){background-color:var(--rotomeca-button-primary-active-background-color);color:var(--rotomeca-button-primary-active-color);border:var(--rotomeca-button-primary-active-border)}:host(:state(secondary)){background-color:var(--rotomeca-button-secondary-background-color);color:var(--rotomeca-button-secondary-color);border:var(--rotomeca-button-secondary-border)}:host(:hover:state(secondary)){background-color:var(--rotomeca-button-secondary-hover-background-color);color:var(--rotomeca-button-secondary-hover-color);border:var(--rotomeca-button-secondary-hover-border)}:host(:active:state(secondary)){background-color:var(--rotomeca-button-secondary-active-background-color);color:var(--rotomeca-button-secondary-active-color);border:var(--rotomeca-button-secondary-active-border)}:host(:state(error)){background-color:var(--rotomeca-button-error-background-color);color:var(--rotomeca-button-error-color);border:var(--rotomeca-button-error-border)}:host(:hover:state(error)){background-color:var(--rotomeca-button-error-hover-background-color);color:var(--rotomeca-button-error-hover-color);border:var(--rotomeca-button-error-hover-border)}:host(:active:state(error)){background-color:var(--rotomeca-button-error-active-background-color);color:var(--rotomeca-button-error-active-color);border:var(--rotomeca-button-error-active-border)}/*# sourceMappingURL=./buttons.css.map */`;
export { HTMLRotomecaButton };

class HTMLRotomecaButton extends HTMLCustomButton {
  constructor() {
    super();
  }

  _p_main() {
    super._p_main();

    if (this.shadowEnabled()) {
      let style = document.createElement('style');
      style.appendChild(this.createText(sheet));
      this.root.append(style);
      style = null;
    }
  }

  /**
   *
   * @param {Object} [options={}]
   * @param {('primary' | 'secondary' | 'error')} [options.form='primary']
   * @returns {HTMLRotomecaButton}
   */
  static CreateNode({
    shadowEnabled = true,
    form = 'primary',
    content = null,
  } = {}) {
    /**
     * @type {HTMLRotomecaButton}
     */
    let node = document.createElement(this.TAG);

    node.attr('data-shadow', { value: shadowEnabled });
    node.attr('data-state', { value: form });

    if (content) {
      if (typeof content === 'string') node.root.innerHTML = content;
      else node.root.appendChild(content);
    }

    return node;
  }

  /**
   * @type {string}
   * @readonly
   * @static
   */
  static get TAG() {
    return 'ref-button';
  }
}

HTMLRotomecaButton.TryDefine(HTMLRotomecaButton.TAG, HTMLRotomecaButton);
