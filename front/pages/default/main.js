import { AFrontObject } from '../../../framework/front/abstract/AFrontObject.js';

export class Main extends AFrontObject {
  constructor(...args) {
    super(...args);
  }

  _p_main() {
    super._p_main();

    this.body.style.backgroundColor = 'red';
    this.front.p.style.background = 'blue';
    this.front.p.append(document.createTextNode(' YOLOOOOOOOOOO'));
  }
}
