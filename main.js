const electron = require('electron')
const configService = require('./services/ConfigService')
const TabsController = require('./services/TabsController')
const {
    MainWindow
} = require('./components/MainWindow')

let mainWindow
let current_server = null

function createWindow() {
    mainWindow = new MainWindow()
    mainWindow.setup()
    TabsController.setupMain(mainWindow.browserView)
    mainWindow.setContentBounds(TabsController.currentTab())
    mainWindow.start()

    mainWindow.browserView.webContents.setWindowOpenHandler(({
        url
    }) => {
        if(TabsController.currentTab() == TabsController.getMain()) {
            mainWindow.send('new_tab', url)
            return {
                action: 'deny'
            }
        } else {
            return {
                action: 'allow'
            }
        }
    })

    electron.ipcMain.on("load_url", (evt, server) => {
        current_server = server
        TabsController.currentTab().webContents.loadURL(`http://${current_server}.dwar.ru/`)
        mainWindow.webContents.send('url', `http://${current_server}.dwar.ru`, TabsController.current_tab_id)
        configService.writeData('server', server)
        mainWindow.webContents.setZoomFactor(0.9)
    })

    electron.ipcMain.on('reload', (evt) => {
        TabsController.currentTab().webContents.reload()
    })

    let dressingWindow = null
    electron.ipcMain.on('open_dressing_room', (evt) => {
        const path = require('path')
        dressingWindow = new electron.BrowserWindow({
            parent: mainWindow,
            width: 900,
            height: 700,
            minWidth: 900,
            minHeight: 700,
            useContentSize: true,
            show: true,
            webPreferences: {
                preload: path.join(__dirname, "Dressing/preload.js")
            }
        })
        dressingWindow.loadFile(`${path.join(electron.app.getAppPath(), './Dressing/index.html')}`)
    })

    electron.ipcMain.on('new_tab', (evt, id, url) => {
        createNewTab(url, id)
    })

    function createNewTab(url, id) {
        url = url ?? "https://google.com"
        let browserView = new electron.BrowserView({
            enablePreferredSizeMode: true
        })
        browserView.webContents.on('will-navigate', (evt, url) => {
            mainWindow.webContents.send('url', url, TabsController.current_tab_id)
        })
        TabsController.addTab(id, browserView)
        TabsController.setupCurrent(id)
        mainWindow.setBrowserView(browserView)

        browserView.setBounds(mainWindow.getControlBounds())
        browserView.setAutoResize({
            width: true
        })
        mainWindow.setContentBounds(TabsController.currentTab())
        browserView.webContents.loadURL(url)
        mainWindow.webContents.send('url', url, id)
    }

    electron.ipcMain.on('make_active', (evt, id) => {
        TabsController.setupCurrent(id)
        mainWindow.setBrowserView(TabsController.currentTab())
        mainWindow.webContents.send('url', TabsController.currentTab().webContents.getURL(), id)
    })

    electron.ipcMain.on('remove_view', (evt, id) => {
        TabsController.deleteTab(id)
    })

    electron.ipcMain.handle('MakeWebRequest', async (evt, req) => {
        let result = await mainWindow.browserView.webContents.executeJavaScript(req.req)
        return {
            result: result,
            req: req
        }
    })

    electron.ipcMain.on('goUrl', (evt, url) => {
        TabsController.currentTab().webContents.loadURL(url)
    })

    electron.ipcMain.handle('LoadSetItems', async (evt) => {
        const SetRequests = {
            allItems: {
                url: `http://${current_server}.dwar.ru/user_iframe.php?group=2`,
                script: 'art_alt'
            },
            wearedItems: {
                url: `http://${current_server}.dwar.ru/user.php`,
                script: 'art_alt'
            }
        }
        let [allItems, wearedItems] = await Promise.all([fetch(SetRequests.allItems), fetch(SetRequests.wearedItems)])
        dressingWindow.show()
        return {
            allItems: allItems,
            wearedItems: wearedItems
        }
    })

    async function fetch(request) {
        const bw = new electron.BrowserView()
        await bw.webContents.loadURL(request.url)
        return await bw.webContents.executeJavaScript(request.script)
    }

    electron.globalShortcut.register('CommandOrControl+W', () => {
        if(TabsController.currentTab() != TabsController.getMain()) {
            mainWindow.webContents.send('close_tab', TabsController.current_tab_id)
        }
    })
}

electron.app.on('ready', createWindow)

electron.app.on('window-all-closed', function() {
    if(process.platform !== 'darwin') {
        app.quit()
    }
})

electron.app.on('activate', function() {
    if(mainWindow === null) {
        createWindow()
    }
})
