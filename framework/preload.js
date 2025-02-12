const { contextBridge, ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});

contextBridge.exposeInMainWorld('api', {
  invoke: (channel, ...data) => {
    return ipcRenderer.invoke(channel, ...data);
  },
  on: (channel, callback) => {
    return ipcRenderer.on(channel, callback);
  },
});
