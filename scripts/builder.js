class RotomecaLuncher {
  #_baseFolder;
  constructor(baseFolder) {
    this.#_baseFolder = baseFolder;
  }

  *findFile(dir, { ext, nameIncludes = false } = {}) {
    const fs = require('fs');
    const path = require('path');
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        yield* this.findFile(filePath, { ext, nameIncludes });
        // // Si c'est un dossier, appeler récursivement la fonction
        // findJshtmlFiles(filePath, fileList);
      } else if (path.extname(file) === ext) {
        if (nameIncludes !== false && filePath.includes(nameIncludes))
          yield filePath;
        else if (nameIncludes === false) yield filePath;
      }
    }
  }

  async buildFront({ minify = false } = {}) {
    console.log('[BUILD]Starting build front');
    const esbuild = require('esbuild');
    const path = require('path');
    let files = this.findFile(path.join(this.#_baseFolder, 'front/pages'), {
      ext: '.js',
    });

    let promises = [];

    for (const file of files) {
      if (file.includes('.out.js')) continue;

      console.log('[BUILD]Starting build ' + file);
      let promise = esbuild
        .build({
          minify,
          entryPoints: [file],
          bundle: true,
          outfile: `${file}.out.js`,
          sourcemap: true,
          target: ['chrome58'],
        })
        .then(
          function (builded) {
            console.log(
              `[BUILD]Finishing build of ${builded} into ${builded}.out.js`,
            );
          }.bind(null, file),
        );

      promises.push(promise);
      promise = null;
    }

    await Promise.allSettled(promises);
    console.log('[BUILD]Finishing build front');
  }

  unbuildFront() {
    const fs = require('fs');
    console.log('[BUILD]Starting unbuild front');
    for (const file of this.findFile(this.#_baseFolder, {
      ext: '.js',
      nameIncludes: '.out.js',
    })) {
      fs.rmSync(file);
      console.log('[UNBUILD]removing', file);
    }

    for (const file of this.findFile(this.#_baseFolder, {
      ext: '.map',
      nameIncludes: '.out.js',
    })) {
      fs.rmSync(file);
      console.log('[UNBUILD]removing', file);
    }

    console.log('[BUILD]Finishing unbuild front');
  }

  parseJsHtmlFile(element) {
    const fs = require('fs');

    let readingFile = fs.readFileSync(element).toString();
    readingFile = this.parseJsHtmlString(readingFile);
    fs.writeFileSync(element.replace('.jshtml', '.rjshtml.js'), readingFile);
    fs.renameSync(element, element.replace('.jshtml', '._jshtml'));
    console.log(
      'element changed',
      element,
      'to',
      element.replace('.jshtml', '.rjshtml.js'),
    );
  }

  parseJsHtmlString(readingFile) {
    const RJSParser = require('../framework/classes/RJSParser').RJSParser;

    return RJSParser.Parse(readingFile);
  }

  async parseRjsFile(element) {
    const fs = require('fs');
    const parser = require('./rjsparser').rjsparser;
    const str = await parser(element);

    fs.writeFileSync(
      element.replace('.rjs', '.js'),
      this.parseJsHtmlString(str),
    );
  }

  async findAndParseJsHtmlFile() {
    for (const file of this.findFile(this.#_baseFolder, {
      ext: '.jshtml',
    })) {
      this.parseJsHtmlFile(file);
    }
  }

  async findAndParseRJsFile() {
    let promises = [];
    for (const file of this.findFile(this.#_baseFolder, {
      ext: '.rjs',
    })) {
      console.log(file, 'founded');
      promises.push(this.parseRjsFile(file));
    }

    return await Promise.allSettled(promises);
  }

  async findAndRemoveParsedJsHtml() {
    const fs = require('fs');
    for (const file of this.findFile(this.#_baseFolder, {
      ext: '.js',
      nameIncludes: '.rjshtml.js',
    })) {
      if (file.includes('.out.')) continue;

      fs.rmSync(file);
      console.log('removing', file);
    }
  }

  async findAndRemove_JsHtml() {
    const fs = require('fs');
    for (const file of this.findFile(this.#_baseFolder, {
      ext: '._jshtml',
    })) {
      fs.renameSync(file, file.replace('._jshtml', '.jshtml'));
      console.log('renaming', file);
    }
  }

  async start() {
    await Promise.allSettled([
      this.findAndParseRJsFile(),
      this.findAndParseJsHtmlFile(),
    ]);
  }

  async end() {
    await Promise.allSettled([
      this.findAndRemoveParsedJsHtml(),
      this.findAndRemove_JsHtml(),
    ]);
  }

  static async Start(workingFolder, command) {
    const minify = command === 'npm run _make';
    const path = require('path');
    console.log('path', workingFolder);
    console.log('[Build]Starting', workingFolder);
    let appLuncher = new RotomecaLuncher(workingFolder);
    let nodeLuncher = new RotomecaLuncher(
      path.join(workingFolder, 'node_modules/@rotomeca/electron-framework'),
    );
    console.log('[Build]Parsing app', workingFolder);
    await appLuncher.start();
    console.log('[Build]Parsing nodes', workingFolder);
    await nodeLuncher.start();
    await appLuncher.buildFront({ minify });
    const { exec } = require('child_process');
    console.log('[Build]Starting', command, 'at', workingFolder);
    exec(command, { cwd: workingFolder }, (error, stdout, stderr) => {
      console.log('after npm');

      if (error) {
        console.error("Erreur lors de l'exécution du script :", error);
      }
      if (stderr) {
        console.error(`Erreur: ${stderr}`);
      }
      console.log(`Résultat de l'exécution du script :\n${stdout}`);

      appLuncher.end().then(() =>
        nodeLuncher.end().then(() => {
          appLuncher.unbuildFront();
          console.log('[Build]End', workingFolder);
        }),
      );
    });
  }
}

const Start = (workingFolder, command) => {
  RotomecaLuncher.Start(workingFolder, command);
};

module.exports = { Start };
