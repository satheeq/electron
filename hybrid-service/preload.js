// in preload scripts, we have access to node.js and electron APIs
// the remote web app will not, so this is safe
const { ipcRenderer: ipc, remote } = require('electron');
const electron = require('electron');
const path = require('path');
const elecWindow = require('./elecWindow');
const BrowserWindow = electron.remote.BrowserWindow;

init();


function init() {
  attachIPCListeners();
  // Expose a bridging API to remote app's window.
  // We'll add methods to it here first, and when the remote web app loads,
  // it'll add some additional methods as well.
  //
  // !CAREFUL! do not expose any functionality or APIs that could compromise the
  // user's computer. E.g. don't directly expose core Electron (even IPC) or node.js modules.
  window.Bridge = {
    setDockBadge,
    test,
    sendValue
  };


}

function attachIPCListeners() {
  // we get this message from the main process, and then tell the todo app to make it so
  // the todo app defines this function
  ipc.on('markAllComplete', () => {
    window.Bridge.markAllComplete();
  });
  ipc.on('testSend', () => {
    window.Bridge.testSend('hey there');
  });
  ipc.on('ping', function (event, obj) {
    console.log('ping recived');
    console.log(obj);
  });
}

// the todo app calls this when the todo count changes
function setDockBadge(count) {
  if (process.platform === 'darwin') {
    remote.app.dock.setBadge('' + (count || ''));
  }
}

function sendValue(obj) {
  elecWindow.sendValue(obj);
}

function test(testObj) {
  elecWindow.createChildWindow(testObj);
}

