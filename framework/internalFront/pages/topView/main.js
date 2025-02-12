import { AFrontObject } from '../../../front/abstract/AFrontObject.js';

export class Main extends AFrontObject {
  constructor(...args) {
    super(...args);
  }

  /**
   * @type {HTMLDivElement}
   * @readonly
   */
  get layout() {
    return document.querySelector('#layout');
  }

  _p_initListeners() {
    super._p_initListeners();
    this._p_addListener('init', async (data) => {
      const { left, right } = data;
      let layout = this.layout;

      let leftDiv = document.createElement('div');
      let rightDiv = document.createElement('div');

      const promises = await Promise.allSettled([
        this.#_assign(leftDiv, left),
        this.#_assign(rightDiv, right),
      ]);

      leftDiv = promises[0].value;
      rightDiv = promises[1].value;

      leftDiv.classList.add('left');
      rightDiv.classList.add('right');

      layout.append(leftDiv, rightDiv);
    });
  }

  /**
   *
   * @param {HTMLDivElement} div
   * @param {string[]} array
   */
  async #_assign(div, array) {
    div.classList.add('wrapper');

    let button;
    for (const element of array) {
      /**
       * @type {{name:string, icon:string, action:string}}
       */
      const parsedElement = JSON.parse(element);
      button = document.createElement('button');
      button.appendChild(document.createTextNode(parsedElement.icon));
      button.setAttribute('title', parsedElement.name);
      button.onclick = this._p_invoke.bind(this, parsedElement.action, this.id);
      div.prepend(button);
      button = null;
    }

    return div;
  }
}
