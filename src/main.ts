import { app, session } from 'electron'
import { TabsController } from './services/TabsController'
import MainWindowContainer from './components/MainWindow/MainWindow'
import { autoUpdater } from "electron-updater"
import configService from './services/ConfigService'
require('@electron/remote/main').initialize()
require('v8-compile-cache')
import electronReload from "electron-reload"
import { Channel } from './Channel'
electronReload(__dirname, {})

autoUpdater.checkForUpdatesAndNotify()
setInterval(() => {
    autoUpdater.checkForUpdatesAndNotify()
}, 1000 * 60 * 60)

autoUpdater.signals.updateDownloaded((info: any) => {
    console.log("DOWNLOADED", info)
    mainWindowContainer?.mainWindow.webContents.send(Channel.UPDATE_APPLICATION_AVAILABLE)
})

let mainWindowContainer: MainWindowContainer | null

function createWindow() {
    mainWindowContainer = new MainWindowContainer()
    mainWindowContainer.mainWindow.on('closed', () => {
        mainWindowContainer = null
        TabsController.mainWindow = null
        TabsController.mainWindowContainer = null
    })
    mainWindowContainer.setup()
    TabsController.setupMain(mainWindowContainer.browserView!)
    mainWindowContainer.setViewContentBounds(TabsController.currentTab())
    mainWindowContainer.start()
    require("@electron/remote/main").enable(mainWindowContainer.browserView!.webContents)

    session.defaultSession.webRequest.onBeforeSendHeaders((details: { requestHeaders: { [x: string]: any } }, callback: (arg0: { cancel: boolean; requestHeaders: any }) => void) => {
        details.requestHeaders['User-Agent'] = configService.userAgent()
        callback({
            cancel: false,
            requestHeaders: details.requestHeaders
        })
    })
    TabsController.mainWindow = mainWindowContainer.mainWindow
    TabsController.mainWindowContainer = mainWindowContainer
    require('./ipcMainHandler')
}

app.on('ready', createWindow)

app.on('window-all-closed', function() {
    if(process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function() {
    if(mainWindowContainer === null) {
        createWindow()
    }
})
