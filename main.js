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
const configService = require('./services/ConfigService')

autoUpdater.checkForUpdatesAndNotify()
setInterval(() => {
    autoUpdater.checkForUpdatesAndNotify()
}, 1000 * 60 * 60)

autoUpdater.signals.updateDownloaded(info => {
    console.log("DOWNLOADED", info)
    mainWindow.webContents.send('updateApplicationAvailable')
})

let mainWindow

function createWindow() {
    mainWindow = new MainWindow()
    mainWindow.on('closed', () => {
        mainWindow.browserView.webContents.destroy()
        mainWindow = null
        TabsController.mainWindow = null
    })
    mainWindow.setup()
    TabsController.setupMain(mainWindow.browserView)
    mainWindow.setContentBounds(TabsController.currentTab())
    mainWindow.start()
    require("@electron/remote/main").enable(mainWindow.browserView.webContents)

    session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
        details.requestHeaders['User-Agent'] = configService.userAgent()
        callback({
            cancel: false,
            requestHeaders: details.requestHeaders
        })
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
