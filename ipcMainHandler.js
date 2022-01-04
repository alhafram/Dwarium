const {
    BrowserWindow,
    BrowserView,
    ipcMain,
    app
} = require('electron')
const configService = require('./services/ConfigService')
const TabsController = require('./services/TabsController')
const { autoUpdater } = require("electron-updater")

ipcMain.on('load_url', (evt, server) => {
    configService.writeData('server', server)
    TabsController.currentTab().webContents.loadURL(`${configService.baseUrl()}/main.php`)
    TabsController.mainWindow.webContents.send('url', `${configService.baseUrl()}`, TabsController.current_tab_id)
    TabsController.mainWindow.webContents.setZoomFactor(0.9)
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

let dressingWindow = null
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
        webPreferences: {
            preload: path.join(__dirname, './components/Dressing/preload.js')
        }
    })
    require("@electron/remote/main").enable(dressingWindow.webContents)
    dressingWindow.on('closed', () => {
        dressingWindow = null
        TabsController.mainWindow.webContents.send('openWindow', 'dressingRoom', false)
    })
    dressingWindow.loadFile(`${path.join(__dirname, './components/Dressing/index.html')}`)
    TabsController.mainWindow.webContents.send('openWindow', 'dressingRoom', true)
})

let beltWindow = null
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
        webPreferences: {
            preload: path.join(__dirname, './components/Belt/preload.js')
        }
    })
    require("@electron/remote/main").enable(beltWindow.webContents)
    beltWindow.on('closed', () => {
        beltWindow = null
        TabsController.mainWindow.webContents.send('openWindow', 'beltPotionRoom', false)
    })
    beltWindow.loadFile(`${path.join(__dirname, './components/Belt/index.html')}`)
    TabsController.mainWindow.webContents.send('openWindow', 'beltPotionRoom', true)
})

let chatLogWindow = null
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
        webPreferences: {
            preload: path.join(__dirname, './components/Chat/preload.js'),
            contextIsolation: false
        }
    })
    chatLogWindow.on('closed', () => {
        chatLogWindow = null
        TabsController.mainWindow.webContents.send('openWindow', 'chatLog', false)
    })
    chatLogWindow.loadFile(`${path.join(__dirname, './components/Chat/index.html')}`)
    require("@electron/remote/main").enable(chatLogWindow.webContents)
    TabsController.mainWindow.webContents.send('openWindow', 'chatLog', true)
})

let chatSettingsWindow = null
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
        webPreferences: {
            contextIsolation: false
        }
    })
    chatSettingsWindow.on('closed', () => {
        chatSettingsWindow = null
        TabsController.mainWindow.webContents.send('openWindow', 'chatSettings', false)
    })
    chatSettingsWindow.loadFile(`${path.join(__dirname, './components/ChatSettings/index.html')}`)
    TabsController.mainWindow.webContents.send('openWindow', 'chatSettings', true)
})

ipcMain.on('new_tab', (evt, id, url) => {
    createNewTab(url, id)
})

function createNewTab(url, id) {
    url = url ?? 'https://google.com'
    let browserView = new BrowserView({
        enablePreferredSizeMode: true
    })
    const tabId = id
    browserView.webContents.on('did-finish-load', () => {
        let originalTitle = browserView.webContents.getTitle()
        let title = originalTitle.slice(0, 13)
        if(originalTitle.length > 15) {
            title = title.concat(' ...')
        }
        TabsController.mainWindow.webContents.send('finishLoadUrl', tabId, title)
        TabsController.mainWindow.webContents.send('url', browserView.webContents.getURL(), tabId)
    })
    TabsController.addTab(id, browserView)
    TabsController.setupCurrent(id)
    TabsController.mainWindow.setBrowserView(browserView)

    browserView.setAutoResize({
        width: true
    })
    TabsController.mainWindow.setContentBounds(TabsController.currentTab())
    browserView.webContents.loadURL(url)
    TabsController.mainWindow.webContents.send('url', url, id)
}

ipcMain.on('make_active', (evt, id) => {
    TabsController.setupCurrent(id)
    TabsController.mainWindow.setBrowserView(TabsController.currentTab())
    TabsController.mainWindow.setContentBounds(TabsController.currentTab(), TabsController.mainWindow.getBounds())
    TabsController.mainWindow.webContents.send('url', TabsController.currentTab().webContents.getURL(), id)
})

ipcMain.on('remove_view', (evt, id) => {
    TabsController.deleteTab(id)
})

ipcMain.on('close_tab', (evt, id) => {
    TabsController.mainWindow.webContents.send('close_tab', id)
})

ipcMain.handle('MakeWebRequest', async (evt, req) => {
    let result = await TabsController.mainWindow.browserView.webContents.executeJavaScript(req.req)
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

ipcMain.handle('LoadSetItems', async (evt, args) => {
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
    let requests = args.map(arg => fetch(SetRequests[arg]))
    let results = await Promise.all(requests)
    let res = {}
    args.forEach((arg, index) => {
        res[arg] = results[index]
    })
    return res
})

ipcMain.on('findCharacter', (event, nick) => {
    const userInfoBrowserWindow = new BrowserWindow({
        width: 1200,
        height: 900,
        useContentSize: true,
        show: true
    })
    userInfoBrowserWindow.webContents.loadURL(`${configService.baseUrl()}/user_info.php?nick=${nick}`)
})

async function fetch(request) {
    const bw = new BrowserView()
    await bw.webContents.loadURL(request.url)
    let result = await bw.webContents.executeJavaScript(request.script)
    bw.webContents.destroy()
    return result
}
