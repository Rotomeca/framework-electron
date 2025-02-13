#!/usr/bin/env node
const script = process.argv[2];
const currentDirectory = process.cwd();

switch (script) {
  case 'test':
    require('./builder').Start(currentDirectory, 'npm start');
    break;

  case 'build':
    require('./builder').Start(currentDirectory, 'electron-forge make');
    break;

  case 'init':
    require('./init').init(currentDirectory);
    break;

  case 'page':
    require('./page').page(currentDirectory, process.argv[3]);
    break;

  default:
    break;
}
