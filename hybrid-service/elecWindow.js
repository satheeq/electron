const { app, BrowserWindow, Menu, webContents } = require('electron');
const path = require('path');
module.exports = function () {
    let mainWindow;
    let secondWindow;

    let createMainWindow = function () {
        mainWindow = new BrowserWindow({
            titleBarStyle: 'hidden-inset',
            webPreferences: {
                nativeWindowOpen: true
            }
        });

        // mainWindow.webContents.on('new-window', (event, url, frameName, disposition, options) => {
        //     event.preventDefault()
        //     const win = new BrowserWindow({
        //         webContents: mainWindow.webContents, // use existing webContents if provided
        //         show: false
        //     })
        //     win.once('ready-to-show', () => win.show());
        //     event.newGuest = win
        // });
        mainWindow.loadURL(path.join('file://', __dirname, 'index.html'));

        // createChildWindow();

        mainWindow.openDevTools({ mode: 'bottom' });

        // createMenu();
    }

    // mainWindow.webContents.on('new-window', (event, url, frameName, disposition, options) => {
    //     event.preventDefault()
    //     const win = new BrowserWindow({
    //       webContents: mainWindow.webContents, // use existing webContents if provided
    //       show: false
    //     })
    //     win.once('ready-to-show', () => win.show());
    //     event.newGuest = win
    //   });

    let getParentWindow = () => {
        return mainWindow;
    }

    let createChildWindow = (testObj) => {
        // window.open('https://electronjs.org/docs/api/web-contents#event-new-window');
        // window.open(path.join('file://', __dirname, 'index.html'));

        const electron = require('electron');
        const BrowserWindow = electron.remote.BrowserWindow;
        secondWindow = new BrowserWindow({
            parent: mainWindow,
            width: 800,
            height: 600,
        })  // testObj as post data here ??

        secondWindow.loadURL(path.join('file://', __dirname, 'index.html'));
        secondWindow.openDevTools({ mode: 'bottom' });
        secondWindow.webContents.on('did-finish-load', () => {
            console.log('sent whooooooooooooooooooooh');
            secondWindow.webContents.send('ping', 'whoooooooh!')
        })
    }

    function createMenu() {
        const topLevelItems = [
            {
                label: 'Application',
                submenu: [
                    {
                        label: 'Quit',
                        accelerator: 'CmdOrCtrl+Q',
                        click() {
                            app.quit();
                        }
                    }
                ]
            },
            {
                label: 'Edit',
                submenu: [
                    { label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
                    { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
                    { type: 'separator' },
                    { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
                    { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
                    { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' },
                    { label: 'Select All', accelerator: 'CmdOrCtrl+A', role: 'selectall' }
                ]
            },
            {
                label: 'Actions',
                submenu: [
                    {
                        label: 'Mark All As Complete',
                        click() {
                            // send an IPC message to the webview for handling
                            const wc = getWebviewWebContents();
                            wc.send('markAllComplete');
                        }
                    },
                    {
                        label: 'send',
                        click() {
                            // send an IPC message to the webview for handling
                            const wc = getWebviewWebContents();
                            wc.send('testSend');
                        }
                    }
                ]
            }
        ];

        Menu.setApplicationMenu(Menu.buildFromTemplate(topLevelItems));
    }

    function getWebviewWebContents() {
        return webContents.getAllWebContents()
            // TODO replace `localhost` with whatever the remote web app's URL is
            .filter(wc => wc.getURL().search(/localhost/gi) > -1)
            .pop();
    }

    function sendValue(obj) {
        secondWindow.webContents.send('window-obj', obj);
    }

    return {
        createMainWindow,
        createChildWindow,
        getParentWindow,
        sendValue
    }
}();