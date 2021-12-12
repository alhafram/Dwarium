const electron = require('electron')

const app = electron.app
const BrowserWindow = electron.BrowserWindow
const BrowserView = electron.BrowserView
const path = require('path')
const ipcMain = electron.ipcMain

const requestManager = require('./services/RequestManager')
const configService = require('./services/ConfigService')
const TabsController = require('./services/TabsController')
const {
    MainWindow
} = require('./components/MainWindow')

let mainWindow
let current_server = null

function createMainBrowserView() {
    let browserView = new BrowserView({
        enablePreferredSizeMode: true,
    })
    browserView.setBounds(mainWindow.getControlBounds())
    browserView.setAutoResize({
            width: true,
            height: true
        })
        // browserView.webContents.openDevTools()
    return browserView
}

function createWindow() {
    mainWindow = new MainWindow()
    let browserView = createMainBrowserView()
    mainWindow.setup(browserView)
    TabsController.setupMain(browserView)
    mainWindow.setContentBounds(TabsController.currentTab())
    mainWindow.start()

    ipcMain.on("load_url", (evt, server) => {
        current_server = server
        TabsController.currentTab().webContents.loadURL(`http://${current_server}.dwar.ru/`)
        mainWindow.webContents.send('url', `http://${current_server}.dwar.ru`, TabsController.current_tab_id)
        configService.writeData('server', server)
    })

    ipcMain.on('reload', (evt) => {
        TabsController.currentTab().webContents.reload()
    })

    let dressingWindow = null
    ipcMain.on('open_dressing_room', (evt) => {
        dressingWindow = new BrowserWindow({
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
        dressingWindow.loadFile(`${path.join(app.getAppPath(), './Dressing/index.html')}`)
    })

    ipcMain.on('new_tab', (evt, id) => {
        let browserView = new BrowserView({
            enablePreferredSizeMode: true
        })
        TabsController.addTab(id, browserView)
        TabsController.setupCurrent(id)
        mainWindow.setBrowserView(browserView)

        browserView.setBounds(mainWindow.getControlBounds())
        browserView.setAutoResize({
            width: true
        })
        mainWindow.setContentBounds(TabsController.currentTab())
        browserView.webContents.loadURL('https://google.com')
        mainWindow.webContents.send('url', 'https://google.com', id)
    })

    ipcMain.on('make_active', (evt, id) => {
        TabsController.setupCurrent(id)
        mainWindow.setBrowserView(TabsController.currentTab())
        mainWindow.webContents.send('url', TabsController.currentTab().webContents.getURL(), id)
    })

    ipcMain.on('remove_view', (evt, id) => {
        TabsController.deleteTab(id)
    })

    ipcMain.handle('MakeWebRequest', async(evt, req) => {
        let result = await browserView.webContents.executeJavaScript(req.req)
        return {
            result: result,
            req: req
        }
    })

    ipcMain.handle('Fetch', async (evt, type, params) => {
        let resp = await requestManager.makeRequest(type, params)
        return resp
    })

    ipcMain.handle('LoadSetItems', async(evt) => {
        let dressingBrowserView = new BrowserView()
        await dressingBrowserView.webContents.loadURL(`http://${current_server}.dwar.ru/user_iframe.php?group=2`)
        let allItems = await dressingBrowserView.webContents.executeJavaScript('art_alt')
        await dressingBrowserView.webContents.loadURL(`http://${current_server}.dwar.ru/user.php`)
        let wearedItems = await dressingBrowserView.webContents.executeJavaScript('art_alt')
        dressingWindow.show()
        return {
            allItems: allItems,
            wearedItems: wearedItems
        }
    })
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
