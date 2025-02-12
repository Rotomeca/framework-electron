import { EMPTY_STRING } from '../constants.js';

export class CSSHelper {
  /**
   * @type {import("../JsHtml")._JsHtml}
   */
  #_jshtml;
  constructor(jshtml) {
    this.#_jshtml = jshtml;
  }

  transition(
    name,
    ms,
    { delay = undefined, easing = undefined, behavior = undefined } = {},
  ) {
    return this.#_jshtml.style_css_prop(
      'transition',
      `${name} ${ms} ${
        this.#_isNullOrUndefined(easing) ? EMPTY_STRING : ` ${easing}`
      }${
        this.#_isNullOrUndefined(delay)
          ? EMPTY_STRING
          : ` ${
              typeof delay === 'string'
                ? delay.includes('ms')
                  ? delay
                  : `${delay}ms`
                : `${delay}ms`
            }`
      }${this.#_isNullOrUndefined(behavior) ? EMPTY_STRING : ` ${behavior}`}`,
    );
  }

  transitionAll({
    ms = '0.1s',
    delay = undefined,
    easing = undefined,
    behavior = undefined,
  } = {}) {
    return this.transition('all', ms, { delay, behavior, easing });
  }

  #_isNullOrUndefined(item) {
    return item === null || item === undefined;
  }
}
