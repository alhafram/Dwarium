import { BrowserWindow, BrowserView, ipcMain, app } from 'electron'
import configService from './services/ConfigService'
import { TabsController } from './services/TabsController'
import { autoUpdater } from "electron-updater"

ipcMain.on('load_url', (evt, server) => {
    configService.writeData('server', server)
    TabsController.currentTab().webContents.loadURL(`${configService.baseUrl()}/main.php`)
    TabsController.mainWindow?.webContents.send('url', `${configService.baseUrl()}`, TabsController.current_tab_id)
    TabsController.mainWindow?.webContents.setZoomFactor(0.9)
})

ipcMain.on('reload', () => {
    TabsController.currentTab().webContents.reload()
})

ipcMain.on('back', () => {
    if(TabsController.currentTab().webContents.canGoBack()) {
        TabsController.currentTab().webContents.goBack()
    }
})

ipcMain.on('forward', () => {
    if(TabsController.currentTab().webContents.canGoForward()) {
        TabsController.currentTab().webContents.goForward()
    }
})

let dressingWindow: BrowserWindow | null
ipcMain.on('openDressingRoom', () => {
    if(dressingWindow) {
        dressingWindow.show()
        return
    }
    const path = require('path')
    dressingWindow = new BrowserWindow({
        width: 900,
        height: 700,
        minWidth: 900,
        minHeight: 700,
        useContentSize: true,
        show: true,
        parent: configService.windowsAboveApp() ? TabsController.mainWindow! : undefined,
        webPreferences: {
            preload: path.join(__dirname, './components/Dressing/preload.js')
        }
    })
    require("@electron/remote/main").enable(dressingWindow.webContents)
    dressingWindow.on('closed', () => {
        dressingWindow = null
        if(!TabsController.mainWindow?.isDestroyed()) {
            TabsController.mainWindow?.webContents.send('openWindow', 'dressingRoom', false)
        }
    })
    dressingWindow.loadFile(`${path.join(__dirname, './components/Dressing/index.html')}`)
    TabsController.mainWindow?.webContents.send('openWindow', 'dressingRoom', true)
})

let beltWindow: BrowserWindow | null
ipcMain.on('openBeltPotionRoom', () => {
    if(beltWindow) {
        beltWindow.show()
        return
    }
    const path = require('path')
    beltWindow = new BrowserWindow({
        width: 900,
        height: 700,
        minWidth: 900,
        minHeight: 700,
        useContentSize: true,
        show: true,
        parent: configService.windowsAboveApp() ? TabsController.mainWindow! : undefined,
        webPreferences: {
            preload: path.join(__dirname, './components/Belt/preload.js')
        }
    })
    require("@electron/remote/main").enable(beltWindow.webContents)
    beltWindow.on('closed', () => {
        beltWindow = null
        if(!TabsController.mainWindow?.isDestroyed()) {
            TabsController.mainWindow?.webContents.send('openWindow', 'beltPotionRoom', false)
        }
    })
    beltWindow.loadFile(`${path.join(__dirname, './components/Belt/index.html')}`)
    TabsController.mainWindow?.webContents.send('openWindow', 'beltPotionRoom', true)
})

let chatLogWindow: BrowserWindow | null
ipcMain.on('openChatLog', () => {
    if(chatLogWindow) {
        chatLogWindow.show()
        return
    }
    const path = require('path')
    chatLogWindow = new BrowserWindow({
        width: 900,
        height: 700,
        minWidth: 900,
        minHeight: 700,
        useContentSize: true,
        show: true,
        parent: configService.windowsAboveApp() ? TabsController.mainWindow! : undefined,
        webPreferences: {
            preload: path.join(__dirname, './components/Chat/preload.js'),
            contextIsolation: false
        }
    })
    chatLogWindow.on('closed', () => {
        chatLogWindow = null
        if(!TabsController.mainWindow?.isDestroyed()) {
            TabsController.mainWindow?.webContents.send('openWindow', 'chatLog', false)
        }
    })
    chatLogWindow.loadFile(`${path.join(__dirname, './components/Chat/index.html')}`)
    require("@electron/remote/main").enable(chatLogWindow.webContents)
    TabsController.mainWindow?.webContents.send('openWindow', 'chatLog', true)
})

let chatSettingsWindow: BrowserWindow | null
ipcMain.on('openChatSettings', () => {
    if(chatSettingsWindow) {
        chatSettingsWindow.show()
        return
    }
    const path = require('path')
    chatSettingsWindow = new BrowserWindow({
        width: 900,
        height: 700,
        minWidth: 900,
        minHeight: 700,
        useContentSize: true,
        show: true,
        parent: configService.windowsAboveApp() ? TabsController.mainWindow! : undefined,
        webPreferences: {
            contextIsolation: false
        }
    })
    chatSettingsWindow.on('closed', () => {
        chatSettingsWindow = null
        if(!TabsController.mainWindow?.isDestroyed()) {
            TabsController.mainWindow?.webContents.send('openWindow', 'chatSettings', false)
        }
    })
    chatSettingsWindow.loadFile(`${path.join(__dirname, './components/ChatSettings/index.html')}`)
    TabsController.mainWindow?.webContents.send('openWindow', 'chatSettings', true)
})

ipcMain.on('new_tab', (evt, id, url) => {
    createNewTab(url, id)
})

function createNewTab(url: string, id: string) {
    url = url ?? 'https://google.com'
    let browserView = new BrowserView({
        webPreferences: {
            enablePreferredSizeMode: true
        }
    })
    const tabId = id
    browserView.webContents.on('did-finish-load', () => {
        let originalTitle = browserView.webContents.getTitle()
        let title = originalTitle.slice(0, 13)
        if(originalTitle.length > 15) {
            title = title.concat(' ...')
        }
        TabsController.mainWindow?.webContents.send('finishLoadUrl', tabId, title)
        TabsController.mainWindow?.webContents.send('url', browserView.webContents.getURL(), tabId)
    })
    if(configService.windowOpenNewTab()) {
        browserView.webContents.setWindowOpenHandler(({
            url,
            features
        }) => {
            TabsController.mainWindow?.webContents.send('new_tab', url)
            return {
                action: 'deny'
            }
        })
    }
    TabsController.addTab(tabId, browserView)
    TabsController.setupCurrent(tabId)
    TabsController.mainWindow?.setBrowserView(browserView)

    browserView.setAutoResize({
        width: true
    })
    TabsController.mainWindowContainer?.setViewContentBounds(TabsController.currentTab())
    browserView.webContents.loadURL(url)
    TabsController.mainWindow?.webContents.send('url', url, tabId)
}

ipcMain.on('make_active', (evt, id) => {
    TabsController.setupCurrent(id)
    TabsController.mainWindow?.setBrowserView(TabsController.currentTab())
    TabsController.mainWindowContainer?.setViewContentBounds(TabsController.currentTab(), TabsController.mainWindow?.getBounds())
    TabsController.mainWindow?.webContents.send('url', TabsController.currentTab().webContents.getURL(), id)
})

ipcMain.on('remove_view', (evt, id) => {
    TabsController.deleteTab(id)
})

ipcMain.on('close_tab', (evt, id) => {
    TabsController.mainWindow?.webContents.send('close_tab', id)
})

ipcMain.handle('MakeWebRequest', async (evt, req) => {
    let result = await TabsController.mainWindowContainer?.browserView?.webContents.executeJavaScript(req.req)
    return {
        result: result,
        req: req
    }
})

ipcMain.on('goUrl', (evt, url) => {
    if(!url.includes('http')) {
        url = 'https://' + url
    }
    TabsController.currentTab().webContents.loadURL(url)
})

ipcMain.on('updateApplication', () => {
    autoUpdater.quitAndInstall(false, true)
})

ipcMain.handle('LoadSetItems', async (evt, args: [string]) => {
    const SetRequests = {
        allItems: {
            url: `${configService.baseUrl()}/user_iframe.php?group=2`,
            script: 'art_alt'
        },
        wearedItems: {
            url: `${configService.baseUrl()}/user.php`,
            script: 'art_alt'
        },
        allPotions: {
            url: `${configService.baseUrl()}/user_iframe.php?group=1`,
            script: 'art_alt'
        }
    }
    // @ts-ignore
    let requests = args.map((arg: string) => fetch(SetRequests[arg]))
    let results = await Promise.all(requests)
    let res = {}
    args.forEach((arg, index) => {
        // @ts-ignore
        res[arg] = results[index]
    })
    return res
})

ipcMain.on('findCharacter', (event, nick) => {
    const userInfoBrowserWindow = new BrowserWindow({
        width: 1200,
        height: 900,
        useContentSize: true,
        show: true,
        parent: configService.windowsAboveApp() ? TabsController.mainWindow! : undefined
    })
    userInfoBrowserWindow.webContents.loadURL(`${configService.baseUrl()}/user_info.php?nick=${nick}`)
})

async function fetch(request: { url: string; script: string }) {
    const bw = new BrowserView()
    await bw.webContents.loadURL(request.url)
    let result = await bw.webContents.executeJavaScript(request.script);
    (bw.webContents as any).destroy()
    return result
}


let settingsWindow: BrowserWindow | null
ipcMain.on('openSettings', () => {
    if(settingsWindow) {
        settingsWindow.show()
        return
    }
    const path = require('path')
    settingsWindow = new BrowserWindow({
        width: 900,
        height: 700,
        minWidth: 900,
        minHeight: 700,
        useContentSize: true,
        show: true,
        parent: configService.windowsAboveApp() ? TabsController.mainWindow! : undefined,
        webPreferences: {
            preload: path.join(__dirname, './components/Settings/preload.js')
        }
    })
    settingsWindow.on('closed', () => {
        settingsWindow = null
        if(!TabsController.mainWindow?.isDestroyed()) {
            TabsController.mainWindow?.webContents.send('openWindow', 'settings', false)
        }
    })
    require("@electron/remote/main").enable(settingsWindow.webContents)
    settingsWindow.loadFile(`${path.join(__dirname, '../gui/Settings/index.html')}`)
    TabsController.mainWindow?.webContents.send('openWindow', 'settings', true)
})