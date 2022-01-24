import { BrowserWindow, BrowserView, ipcMain, app } from 'electron'
import configService from './services/ConfigService'
import { TabsController } from './services/TabsController'
import { autoUpdater } from "electron-updater"
import fs from 'fs'
import path from 'path'
import { Channel } from './Channel'

ipcMain.on(Channel.LOAD_URL, (evt, server) => {
    configService.writeData('server', server)
    TabsController.currentTab().webContents.loadURL(`${configService.baseUrl()}/main.php`)
    TabsController.mainWindow?.webContents.setZoomFactor(0.9)
})

ipcMain.on(Channel.RELOAD, () => {
    TabsController.currentTab().webContents.reload()
})

ipcMain.on(Channel.BACK, () => {
    if(TabsController.currentTab().webContents.canGoBack()) {
        TabsController.currentTab().webContents.goBack()
    }
})

ipcMain.on(Channel.FORWARD, () => {
    if(TabsController.currentTab().webContents.canGoForward()) {
        TabsController.currentTab().webContents.goForward()
    }
})

let dressingWindow: BrowserWindow | null
ipcMain.on(Channel.OPEN_DRESSING_ROOM, () => {
    if(dressingWindow) {
        dressingWindow.show()
        return
    }
    dressingWindow = createWindowAndLoad(HTMLPath.DRESSING, Preload.DRESSING, true)
    dressingWindow.on('closed', () => {
        dressingWindow = null
        if(!TabsController.mainWindow?.webContents.isDestroyed()) {
            TabsController.mainWindow?.webContents.send(Channel.OPEN_WINDOW, 'dressingRoom', false)
        }
    })
    TabsController.mainWindow?.webContents.send(Channel.OPEN_WINDOW, 'dressingRoom', true)
})

let beltWindow: BrowserWindow | null
ipcMain.on(Channel.OPEN_BELT_POTION_ROOM, () => {
    if(beltWindow) {
        beltWindow.show()
        return
    }
    beltWindow = createWindowAndLoad(HTMLPath.BELT, Preload.BELT, true)
    beltWindow.on('closed', () => {
        beltWindow = null
        if(!TabsController.mainWindow?.webContents.isDestroyed()) {
            TabsController.mainWindow?.webContents.send(Channel.OPEN_WINDOW, 'beltPotionRoom', false)
        }
    })
    TabsController.mainWindow?.webContents.send(Channel.OPEN_WINDOW, 'beltPotionRoom', true)
})

let chatLogWindow: BrowserWindow | null
ipcMain.on(Channel.OPEN_CHAT_LOG, () => {
    if(chatLogWindow) {
        chatLogWindow.show()
        return
    }
    chatLogWindow = createWindowAndLoad(HTMLPath.CHAT_LOG, Preload.CHAT_LOG, true)
    chatLogWindow.on('closed', () => {
        chatLogWindow = null
        if(!TabsController.mainWindow?.webContents.isDestroyed()) {
            TabsController.mainWindow?.webContents.send(Channel.OPEN_WINDOW, 'chatLog', false)
        }
    })
    TabsController.mainWindow?.webContents.send(Channel.OPEN_WINDOW, 'chatLog', true)
})

let chatSettingsWindow: BrowserWindow | null
ipcMain.on(Channel.OPEN_CHAT_SETTINGS, () => {
    if(chatSettingsWindow) {
        chatSettingsWindow.show()
        return
    }
    chatSettingsWindow = createWindowAndLoad(HTMLPath.CHAT_SETTINGS)
    chatSettingsWindow.on('closed', () => {
        chatSettingsWindow = null
        if(!TabsController.mainWindow?.webContents.isDestroyed()) {
            TabsController.mainWindow?.webContents.send(Channel.OPEN_WINDOW, 'chatSettings', false)
        }
    })
    TabsController.mainWindow?.webContents.send(Channel.OPEN_WINDOW, 'chatSettings', true)
})

ipcMain.on(Channel.NEW_TAB, (evt, id, url) => {
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
        TabsController.mainWindow?.webContents.send(Channel.FINISH_LOAD_URL, tabId, title)
        TabsController.mainWindow?.webContents.send(Channel.URL, browserView.webContents.getURL(), tabId)
    })
    if(configService.windowOpenNewTab()) {
        browserView.webContents.setWindowOpenHandler(({
            url,
            features
        }) => {
            TabsController.mainWindow?.webContents.send(Channel.NEW_TAB, url)
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
    TabsController.mainWindow?.webContents.send(Channel.URL, url, tabId)
}

ipcMain.on(Channel.MAKE_ACTIVE, (evt, id) => {
    TabsController.setupCurrent(id)
    TabsController.mainWindow?.setBrowserView(TabsController.currentTab())
    TabsController.mainWindowContainer?.setViewContentBounds(TabsController.currentTab(), TabsController.mainWindow?.getBounds())
    TabsController.mainWindow?.webContents.send(Channel.URL, TabsController.currentTab().webContents.getURL(), id)
})

ipcMain.on(Channel.REMOVE_VIEW, (evt, id) => {
    TabsController.deleteTab(id)
})

ipcMain.on(Channel.CLOSE_TAB, (evt, id) => {
    TabsController.mainWindow?.webContents.send(Channel.CLOSE_TAB, id)
})

ipcMain.handle('MakeWebRequest', async (evt, req) => {
    let result = await TabsController.mainWindowContainer?.browserView?.webContents.executeJavaScript(req)
    return result
})

ipcMain.on(Channel.GO_URL, (evt, url) => {
    if(!url.includes('http')) {
        url = 'http://' + url
    }
    TabsController.currentTab().webContents.loadURL(url)
})

ipcMain.on(Channel.UPDATE_APPLICATION, () => {
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

ipcMain.on(Channel.FIND_CHARACTER, (event, nick) => {
    const userInfoBrowserWindow = createWindowAndLoad()
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
ipcMain.on(Channel.OPEN_SETTINGS, () => {
    if(settingsWindow) {
        settingsWindow.show()
        return
    }
    settingsWindow = createWindowAndLoad(HTMLPath.SETTINGS, Preload.SETTINGS, true)
    settingsWindow.on('closed', () => {
        settingsWindow = null
        if(!TabsController.mainWindow?.webContents.isDestroyed()) {
            TabsController.mainWindow?.webContents?.send(Channel.OPEN_WINDOW, 'settings', false)
        }
    })
    TabsController.mainWindow?.webContents.send(Channel.OPEN_WINDOW, 'settings', true)
})

ipcMain.on(Channel.USER_PRV, (event, nick) => {
    TabsController.mainWindowContainer?.browserView?.webContents.send(Channel.USER_PRV, nick)
})

let screenIsMaking = false
ipcMain.on(Channel.TAKE_SCREENSHOT, async () => {
    if(screenIsMaking) {
        return
    }
    screenIsMaking = true
    TabsController.mainWindow?.webContents.send(Channel.OPEN_WINDOW, 'screenshot', true)
    const basePath =  app.getPath('userData') + '/screens'
    if(!fs.existsSync(basePath)) {
        fs.mkdirSync(basePath)
    }
    let page = await TabsController.mainWindowContainer?.browserView?.webContents.capturePage()
    if(!page) {
        TabsController.mainWindow?.webContents.send(Channel.OPEN_WINDOW, 'screenshot', false)
        screenIsMaking = false
        return
    }
    let resized = page.resize({ width: 1280, height: 1280 / page.getAspectRatio() })
    let png = resized.toPNG()
    let path = `${basePath}/${new Date().toLocaleString().replaceAll(' ', '').replaceAll('/', '.').replaceAll(':', '_')}.png`
    fs.writeFile(path, png, (err: any) => {
        TabsController.mainWindow?.webContents.send(Channel.OPEN_WINDOW, 'screenshot', false)
        screenIsMaking = false
    })
})

ipcMain.on(Channel.FIND_EFFECTS, (event, nick) => {
    const effetsInfoBrowserWindow = createWindowAndLoad()
    effetsInfoBrowserWindow.webContents.loadURL(`${configService.baseUrl()}/effect_info.php?nick=${nick}`)
})

let notesWindow: BrowserWindow | null
ipcMain.on(Channel.OPEN_NOTES, () => {
    if(notesWindow) {
        notesWindow.show()
        return
    }
    notesWindow = createWindowAndLoad(HTMLPath.NOTES, Preload.NOTES, true)
    notesWindow.on('closed', () => {
        notesWindow = null
        if(!TabsController.mainWindow?.webContents.isDestroyed()) {
            TabsController.mainWindow?.webContents.send(Channel.OPEN_WINDOW, 'notes', false)
        }
    })
    TabsController.mainWindow?.webContents.send(Channel.OPEN_WINDOW, 'notes', true)
})

let foodWindow: BrowserWindow | null
ipcMain.on(Channel.OPEN_FOOD, () => {
    if(foodWindow) {
        foodWindow.show()
        return
    }
    foodWindow = createWindowAndLoad(HTMLPath.FOOD, Preload.FOOD, true)
    foodWindow.on('closed', () => {
        foodWindow = null
        if(!TabsController.mainWindow?.webContents.isDestroyed()) {
            TabsController.mainWindow?.webContents?.send(Channel.OPEN_WINDOW, 'food', false)
        }
    })
    TabsController.mainWindow?.webContents.send(Channel.OPEN_WINDOW, 'food', true)
})

function createWindowAndLoad(htmlPath?: HTMLPath, preloadPath?: string, enableRemote: boolean = false, contextIsolation: boolean = true): BrowserWindow {
    const window = new BrowserWindow({
        width: 900,
        height: 700,
        minWidth: 900,
        minHeight: 700,
        parent: configService.windowsAboveApp() ? TabsController.mainWindow! : undefined,
        webPreferences: {
            preload: preloadPath ? path.join(__dirname, preloadPath) : undefined,
            contextIsolation: contextIsolation
        }
    })
    if(htmlPath) {
        window.loadFile(path.join(__dirname, htmlPath))
    }
    if(enableRemote) {
        require("@electron/remote/main").enable(window.webContents)
    }
    return window
}

enum Preload {
    DRESSING = './components/Dressing/preload.js',
    BELT = './components/Belt/preload.js',
    CHAT_LOG = './components/ChatLog/preload.js',
    SETTINGS = './components/Settings/preload.js',
    NOTES = './components/Notes/preload.js',
    FOOD = './components/Food/preload.js'
}

enum HTMLPath {
    DRESSING = '../gui/Dressing/index.html',
    BELT = '../gui/Belt/index.html',
    CHAT_LOG = '../gui/ChatLog/index.html',
    SETTINGS = '../gui/Settings/index.html',
    NOTES = '../gui/Notes/index.html',
    FOOD = '../gui/Food/index.html',
    CHAT_SETTINGS = '../gui/ChatSettings/index.html'
}