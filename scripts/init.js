const { exec } = require('child_process');
const { RotomecaPromise } = require('../framework/classes/RotomecaPromise');

async function init(workingDir) {
  const fs = require('fs');
  const path = require('path');

  const packagePath = path.join(workingDir, 'package.json');

  if (!fs.existsSync(packagePath)) {
    console.error('###[init]Initialisez votre projet avec npm init !');
    return;
  }

  console.log('[init]Updating json package', packagePath);
  let jsonPackage = JSON.parse(fs.readFileSync(packagePath).toString());
  jsonPackage.scripts ??= {};
  jsonPackage.scripts._start = 'electron .';
  jsonPackage.scripts._make = 'electron-forge make';
  jsonPackage.scripts.rotomeca = 'rotomeca';
  jsonPackage.scripts.start = 'npm run debug';
  jsonPackage.scripts.debug = 'rotomeca test';
  jsonPackage.scripts.make = 'rotomeca build';
  jsonPackage.scripts.page = 'rotomeca page';

  jsonPackage = JSON.stringify(jsonPackage);

  fs.writeFileSync(packagePath, jsonPackage);

  const forgeConfig = `
  const { FusesPlugin } = require('@electron-forge/plugin-fuses');
  const { FuseV1Options, FuseVersion } = require('@electron/fuses');
  
  module.exports = {
    packagerConfig: {
      asar: true,
      icon: './icon',
    },
    rebuildConfig: {},
    makers: [
      {
        name: '@electron-forge/maker-squirrel',
        config: {},
      },
      {
        name: '@electron-forge/maker-zip',
        platforms: ['darwin'],
      },
      {
        name: '@electron-forge/maker-deb',
        config: {
          options: {
            icon: './icon.png',
          },
        },
      },
      {
        name: '@electron-forge/maker-rpm',
        config: {},
      },
    ],
    plugins: [
      {
        name: '@electron-forge/plugin-auto-unpack-natives',
        config: {},
      },
      // Fuses are used to enable/disable various Electron functionality
      // at package time, before code signing the application
      new FusesPlugin({
        version: FuseVersion.V1,
        [FuseV1Options.RunAsNode]: false,
        [FuseV1Options.EnableCookieEncryption]: true,
        [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
        [FuseV1Options.EnableNodeCliInspectArguments]: false,
        [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
        [FuseV1Options.OnlyLoadAppFromAsar]: true,
      }),
    ],
  };
  `;

  console.log('[init]Creating forge.config.js');
  fs.writeFileSync(path.join(workingDir, 'forge.config.js'), forgeConfig);
  {
    const baseFolders = ['abstract', 'interfaces', 'classes', 'front', 'lib'];

    let promises = [];
    for (const folder of baseFolders) {
      console.log('[init]Creating folder', folder);
      promises.push(fs.promises.mkdir(path.join(workingDir, folder)));
    }

    await Promise.allSettled(promises);
  }

  {
    const baseFolders = ['abstract', 'interfaces', 'classes', 'pages', 'lib'];

    let promises = [];
    for (const folder of baseFolders) {
      console.log('[init]Creating folder', `front/${folder}`);
      promises.push(
        fs.promises.mkdir(path.join(workingDir, `front/${folder}`)),
      );
    }

    await Promise.allSettled(promises);
  }

  console.log('[init]Creating folder', 'front/classes/webcomponents');
  fs.mkdirSync(path.join(workingDir, 'front/classes/webcomponents'));

  const index = `
const AAppObject = require('@rotomeca/framework-electron').rotomeca.Abstract.AAppObject;

class Index extends AAppObject {
  main() {
    this.onwindowallclosed.push(this.quit.bind(this));

    this.createBrowserWindow('default');
    //Do things here
  }
}

Index.Run();
  
  `;

  console.log('[init]Creating index.js');
  fs.writeFileSync(path.join(workingDir, 'index.js'), index);
  console.log('[init]Creating .prettierignore');
  fs.writeFileSync(
    path.join(workingDir, '.prettierignore'),
    '**/pages/**/index.js',
  );
  console.log('[init]Creating default page.....');
  await require('./page').page(workingDir, 'default');

  console.log('[init]Install electron localy');
  await new RotomecaPromise((manager) => {
    manager.resolver.start();

    exec('npm install --save-dev electron', () => {
      manager.resolver.resolve(true);
    });
  });

  console.log('[init]Install framework');
  await new RotomecaPromise((manager) => {
    manager.resolver.start();

    exec('npm install --save-dev @rotomeca/framework-electron@latest', () => {
      manager.resolver.resolve(true);
    });
  });
  console.log('[init]end');
}

module.exports = { init };
