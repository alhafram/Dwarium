const {
    app,
    session
} = require('electron')
const TabsController = require('./services/TabsController')
const {
    MainWindow
} = require('./components//MainWindow/MainWindow')
require('@electron/remote/main').initialize()
require('v8-compile-cache')
const { autoUpdater } = require("electron-updater")

autoUpdater.checkForUpdatesAndNotify()

autoUpdater.signals.updateDownloaded(info => {
    console.log("DOWNLOADED", info)
    mainWindow.webContents.send('updateApplicationAvailable')
})

let mainWindow

function createWindow() {
    mainWindow = new MainWindow()
    mainWindow.on('closed', () => {
        mainWindow = null
    })
    mainWindow.setup()
    TabsController.setupMain(mainWindow.browserView)
    mainWindow.setContentBounds(TabsController.currentTab())
    mainWindow.start()
    require("@electron/remote/main").enable(mainWindow.browserView.webContents)

    session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
        details.requestHeaders['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36';
        callback({
            cancel: false,
            requestHeaders: details.requestHeaders
        });
    })
    TabsController.mainWindow = mainWindow
    require('./ipcMainHandler')
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
