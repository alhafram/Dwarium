const electron = require('electron')
const configService = require('./services/ConfigService')
const TabsController = require('./services/TabsController')
const {
    MainWindow
} = require('./components/MainWindow')

let mainWindow
let current_server = null

function createMainBrowserView() {
    let browserView = new electron.BrowserView({
        enablePreferredSizeMode: true
    })
    browserView.setBounds(mainWindow.getControlBounds())
    browserView.setAutoResize({
        width: true,
        height: true
    })
    browserView.webContents.openDevTools()
    return browserView
}

function createWindow() {
    mainWindow = new MainWindow()
    let browserView = createMainBrowserView()
    mainWindow.setup(browserView)
    TabsController.setupMain(browserView)
    mainWindow.setContentBounds(TabsController.currentTab())
    mainWindow.start()

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

    electron.ipcMain.on('new_tab', (evt, id) => {
        let browserView = new electron.BrowserView({
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

    electron.ipcMain.on('make_active', (evt, id) => {
        TabsController.setupCurrent(id)
        mainWindow.setBrowserView(TabsController.currentTab())
        mainWindow.webContents.send('url', TabsController.currentTab().webContents.getURL(), id)
    })

    electron.ipcMain.on('remove_view', (evt, id) => {
        TabsController.deleteTab(id)
    })

    electron.ipcMain.handle('MakeWebRequest', async (evt, req) => {
        let result = await browserView.webContents.executeJavaScript(req.req)
        return {
            result: result,
            req: req
        }
    })

    electron.ipcMain.handle('LoadSetItems', async (evt) => {
        let dressingBrowserView = new electron.BrowserView()
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
