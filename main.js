const electron = require('electron')

const app = electron.app
const BrowserWindow = electron.BrowserWindow
const BrowserView = electron.BrowserView
const path = require('path')
const ipcMain = electron.ipcMain

const configService = require('./services/ConfigService')
const TabsController = require('./services/TabsController')
const {
    MainWindow
} = require('./components/MainWindow')

const {
    parse
} = require('./Dressing/backpack_parser')

let mainWindow
let current_server = null

function createMainBrowserView() {
    let browserView = new BrowserView({
        enablePreferredSizeMode: true,
    })
    browserView.setBounds(mainWindow.getControlBounds())
    browserView.setAutoResize({
        width: true
    });
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

    ipcMain.on("load_url", (evt, server) => {
        current_server = server
        TabsController.currentTab().webContents.loadURL(`http://${current_server}.dwar.ru/`)
        mainWindow.webContents.send('url', `http://${current_server}.dwar.ru`, TabsController.current_tab_id)
        configService.writeData('server', server)
    });

    ipcMain.on('reload', (evt) => {
        TabsController.currentTab().webContents.reload()
    })

    ipcMain.on('open_dressing_room', (evt) => {
        let child = new BrowserWindow({
            parent: mainWindow,
            width: 900,
            height: 700,
            minWidth: 900,
            minHeight: 700,
            useContentSize: true,
            show: false,
            webPreferences: {
                preload: path.join(__dirname, "preloadDressroom.js")
            },
        });
        // child.loadURL('app://Dressing/index.html');
        child.loadFile(`${path.join(app.getAppPath(), './Dressing/index.html')}`);

        let dressingItemsBrowserView = new BrowserView({
            enablePreferredSizeMode: true,
        })
        dressingItemsBrowserView.webContents.loadURL(`http://${current_server}.dwar.ru/user_iframe.php?group=2`)
            // dressingItemsBrowserView.webContents.openDevTools()
        child.addBrowserView(dressingItemsBrowserView)
        let wearedItemsBrowserView = new BrowserView({
            enablePreferredSizeMode: true,
        })
        wearedItemsBrowserView.webContents.loadURL(`http://${current_server}.dwar.ru/user.php`)
            // wearedItemsBrowserView.webContents.openDevTools()
        child.addBrowserView(wearedItemsBrowserView)

        child.webContents.on('did-finish-load', async() => {
            let allItems = await dressingItemsBrowserView.webContents.executeJavaScript('art_alt')
            let allItemsSummary = parse(allItems)
            let wearedItems = await wearedItemsBrowserView.webContents.executeJavaScript('art_alt')
            let wearedItemsSummary = parse(wearedItems)

            child.webContents.send('getAllItems', allItemsSummary)
            child.webContents.send('getWearedItems', wearedItemsSummary)
            child.show();
        })
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
        });
        mainWindow.setContentBounds(TabsController.currentTab())
        browserView.webContents.loadURL('https://google.com')
        mainWindow.webContents.send('url', 'https://google.com', id)
    })

    ipcMain.on('make_active', (evt, id) => {
        console.log("MAKE ACTIVE")
        TabsController.setupCurrent(id)
        mainWindow.setBrowserView(TabsController.currentTab())
        mainWindow.webContents.send('url', TabsController.currentTab().webContents.getURL(), id)
    })

    ipcMain.on('remove_view', (evt, id) => {
        TabsController.deleteTab(id)
    })

    ipcMain.on('MakeRequest', async (evt, req) => {
        await browserView.webContents.executeJavaScript(req)
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
