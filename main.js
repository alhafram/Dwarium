const electron = require('electron')

const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const url = require('url')

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        title: 'Dwarium',
        icon: __dirname + '/icon.icns',
        webPreferences: {
            sandbox: true
        },
        show: false
    })
    mainWindow.maximize();
    mainWindow.show();

    // const filter = { urls: ['*://*.dwar.ru/*'] };
    //   electron.session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
    //       console.log(filter, details)
    //     // details.requestHeaders['User-Agent'] = 'MyAgent'
    //     callback({ requestHeaders: details.requestHeaders })
    //   })
    mainWindow.loadURL('http://w2.dwar.ru')

    // alternatively, uncomment the following line to load index.html via
    // 'chrome://brave' to expose additional APIs such as 'chrome.ipcRenderer'
    // mainWindow.loadURL('chrome://brave/' + __dirname + '/index.html');

    // Open the DevTools.
    mainWindow.webContents.openDevTools()

    mainWindow.on('closed', function() {
        mainWindow = null
    })

    mainWindow.on('page-title-updated', (evt) => {
        evt.preventDefault();
    });
}

app.on('ready', createWindow)

app.on('window-all-closed', function() {
    if(process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function() {
    if(mainWindow === null) {
        createWindow()
    }
})
