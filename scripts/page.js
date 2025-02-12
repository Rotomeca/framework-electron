const { RotomecaPromise } = require('../framework/classes/RotomecaPromise');

async function page(workingDir, askedPage = null) {
  const fs = require('fs');
  const path = require('path');

  const page =
    askedPage ??
    (await new RotomecaPromise((manager) => {
      manager.resolver.start();
      const readline = require('node:readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      rl.question('?[page]Page name ?\r\n', (name) => {
        rl.close();
        manager.resolver.resolve(name);
      });
    }));

  const constantsJsPath = path
    .relative(
      path.join(workingDir, `/front/pages/${page}`),
      path.join(__dirname, '../framework/front/constants.js'),
    )
    .replaceAll('\\', '/');

  const randomJsPath = path
    .relative(
      path.join(workingDir, `/front/pages/${page}`),
      path.join(__dirname, '../framework/front/libs/random.js'),
    )
    .replaceAll('\\', '/');

  const jshtml = `
import { EMPTY_STRING } from "${constantsJsPath}";
import { Random } from "${randomJsPath}";

const ID_INPUT = 'urname';
const ID_BUTTON = Random.random_string(5);
const ID_SPAN = 'saysomething'; 
exporter.setTitle('Default page'); //Set title page

//Add to head balise
exporter.addToHeader(
  //prettier-ignore
  JsHtml.start.style()
    .style_css_selector('.block')
      .style_css_prop('display', 'block')
    .style_css_selector_end()
  .end()
);

function okClick() {
  let input = document.getElementById(ID_INPUT);

  if (!!input.value && input.value !== EMPTY_STRING) {
    let button = document.getElementById(ID_BUTTON);
    let span = document.getElementById(ID_SPAN);

    input.disable(); //Custom webcomponents function
    button.disable(); //Custom webcomponents function

    span.textContent = span.textContent.replace('%0', input.value);
    span.style.display = null;

    button = null;
    span = null;
  } 

  input = null;
}  

//prettier-ignore
const html = JsHtml.start
.h1()
  .text('Welcome to the default page !').observe({key:'h'})
.end()
.div()
  .framework().input_text({attribs:{id:ID_INPUT}})
    .text("What's you're name ?")
  .end()
.end()
.div()
  .shadowframework().primary_button({id:ID_BUTTON, onclick:okClick})
    .text('Ok')
  .end()
.end()
.customElement({tag: 'wrapper'}, {class:'block'})
  .span({id:ID_SPAN}).css('display', 'none')
    .text("Oh, you're name is %0")
  .end()
.end();

exporter.export(html); //Export

  `;

  const fontobjectPath = path
    .relative(
      path.join(workingDir, `/front/pages/${page}`),
      path.join(__dirname, '../framework/front/abstract/AFrontObject.js'),
    )
    .replaceAll('\\', '/');

  const main = `
  import { AFrontObject } from '${fontobjectPath}';
  
  export class Main extends AFrontObject {
    constructor(...args) {
      super(...args);
    }
  
    _p_main() {
      super._p_main();
  
     //Do things here
    }
  }
  
  `;

  console.log('[page]Creating ', page, '....');
  //Creating folder
  await fs.promises.mkdir(path.join(workingDir, `front/pages/${page}`));
  //creatings files
  console.log(`[page]Creating front/pages/${page}/index.jshtml`);
  fs.writeFileSync(
    path.join(workingDir, `front/pages/${page}/index.jshtml`),
    jshtml,
  );
  console.log(`[page]Creating front/pages/${page}/main.js`);
  fs.writeFileSync(path.join(workingDir, `front/pages/${page}/main.js`), main);
  console.log('[page]end');
}

module.exports = { page };
