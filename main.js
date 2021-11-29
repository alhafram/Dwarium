const electron = require('electron')
    // Module to control application life.
const app = electron.app
    // Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        title: 'Dwarium',
        width: 800,
        height: 600,
        icon: __dirname + '/icon.icns',
        webPreferences: {
            sandbox: true
        }
    })

    // const filter = { urls: ['*://*.dwar.ru/*'] };
    //   electron.session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
    //       console.log(filter, details)
    //     // details.requestHeaders['User-Agent'] = 'MyAgent'
    //     callback({ requestHeaders: details.requestHeaders })
    //   })
    console.log("!@#!@")
        // and load brave.com
    mainWindow.loadURL('http://w2.dwar.ru')

    // alternatively, uncomment the following line to load index.html via
    // 'chrome://brave' to expose additional APIs such as 'chrome.ipcRenderer'
    //mainWindow.loadURL('chrome://brave/' + __dirname + '/index.html');

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })

    mainWindow.on('page-title-updated', (evt) => {
        evt.preventDefault();
    });


}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if(process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if(mainWindow === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
