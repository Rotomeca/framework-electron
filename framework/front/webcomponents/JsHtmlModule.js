import { HTMLRotomecaButton } from './HTMLRotomecaButton.js';
import { HTMLRotomeaTextInput } from './HTMLRotomecaTextInput.js';

export { JsHtmlModuleWebComponents, ShadowJsHtmlModuleWebComponents };

class JsHtmlModuleWebComponents {
  /**
   * @type {import("../JsHtml")._JsHtml}
   */
  #_jshtml;
  constructor(jshtml) {
    this.#_jshtml = jshtml;
  }

  button({ form = 'primary', attribs = {} } = {}) {
    return this.#_jshtml.customElement(HTMLRotomecaButton, attribs).attrs({
      'data-state': form,
      'data-shadow': false,
    });
  }

  primary_button(attribs = {}) {
    return this.button({ attribs });
  }

  secondary_button(attribs = {}) {
    return this.button({ form: 'secondary', attribs });
  }

  danger_button(attribs = {}) {
    return this.button({ form: 'error', attribs });
  }

  input_text({ form = 'primary', attribs = {} } = {}) {
    attribs['data-form'] = form;
    return this.#_jshtml.customElement(HTMLRotomeaTextInput, attribs);
  }
}

class ShadowJsHtmlModuleWebComponents extends JsHtmlModuleWebComponents {
  constructor(jshtml) {
    super(jshtml);
  }

  button({ form = 'primary', attribs = {} } = {}) {
    return super.button({ form, attribs }).attr('data-shadow', true);
  }
}
