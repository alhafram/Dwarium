const electron = require('electron')

const app = electron.app
const BrowserWindow = electron.BrowserWindow
const BrowserView = electron.BrowserView
const path = require('path')
const url = require('url')
const ipcMain = electron.ipcMain

const configService = require('./services/ConfigService')
const TabsController = require('./services/TabsController')

let mainWindow
let browserView

function getControlBounds() {
    const contentBounds = mainWindow.getContentBounds();
    return {
        x: 0,
        y: 0,
        width: contentBounds.width,
        height: 100
    };
}

function setContentBounds() {
    const [contentWidth, contentHeight] = mainWindow.getContentSize();
    const controlBounds = getControlBounds();
    if(browserView) {
        browserView.setBounds({
            x: 0,
            y: controlBounds.y + controlBounds.height,
            width: contentWidth,
            height: contentHeight - controlBounds.height + 2 // Fix white line
        });
    }
}

let current_server = null

function createWindow() {

    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        title: 'Dwarium',
        icon: __dirname + '/icon.icns',
        webPreferences: {
            sandbox: true,
            preload: path.join(__dirname, "preload.js"),
            backgroundThrottling: false
        },
        useContentSize: true,
        show: false
    })

    browserView = new BrowserView({
        enablePreferredSizeMode: true
    })
    TabsController.setupMain(browserView)
    mainWindow.setBrowserView(browserView)
    current_server = configService.server
    mainWindow.webContents.send('server', current_server)

    browserView.setBounds(getControlBounds())
    browserView.setAutoResize({
        width: true
    });
    setContentBounds()

    // mainWindow.maximize();
    mainWindow.show();
    mainWindow.loadFile(`${path.join(app.getAppPath(), 'index.html')}`);

    // Open the DevTools.
    // browserView.webContents.openDevTools()

    mainWindow.on('closed', function() {
        mainWindow = null
    })

    mainWindow.on('page-title-updated', (evt) => {
        evt.preventDefault();
    });

    mainWindow.on('resized', (evt) => {
        setContentBounds()
    })

    ipcMain.on("load_url", (evt, server) => {
        current_server = server
        browserView.webContents.loadURL(`http://${current_server}.dwar.ru`)
        configService.writeData('server', server)
    });

    ipcMain.on('reload', (evt) => {
        browserView.webContents.reload()
    })

    ipcMain.on('open_dressing_room', (evt) => {
        let child = new BrowserWindow({
            parent: mainWindow,
            width: 700,
            height: 700,
            useContentSize: true,
            show: false
        });
        let dressing_browser_view = new BrowserView({
            enablePreferredSizeMode: true
        })
        child.addBrowserView(dressing_browser_view)

        dressing_browser_view.setBounds({ x: 0, y: 0, height: 0, width: 0 })
        dressing_browser_view.setAutoResize({
            width: true, height: true
        });
        child.loadFile(`${path.join(app.getAppPath(), './Dressing/index.html')}`);
        dressing_browser_view.webContents.loadURL(`http://${current_server}.dwar.ru/user_iframe.php?group=2`)
        // dressing_browser_view.webContents.openDevTools()
        child.show();

        dressing_browser_view.webContents.executeJavaScript('art_alt').then(res => {
            console.log(res)
        })
    })

    ipcMain.on('new_tab', (evt, id) => {
        browserView = new BrowserView({
            enablePreferredSizeMode: true
        })
        TabsController.addTab(id, browserView)
        TabsController.setupCurrent(id)
        mainWindow.setBrowserView(browserView)

        browserView.setBounds(getControlBounds())
        browserView.setAutoResize({
            width: true
        });
        setContentBounds()
        browserView.webContents.loadURL('https://google.com')
        mainWindow.webContents.send('url', 'https://google.com', id)
    })

    ipcMain.on('make_active', (evt, id) => {
        TabsController.setupCurrent(id)
        mainWindow.setBrowserView(TabsController.currentTab())
        browserView = TabsController.currentTab()
        mainWindow.webContents.send('url', TabsController.currentTab().webContents.getURL(), id)
    })

    ipcMain.on('remove_view', (evt, id) => {
        TabsController.deleteTab(id)
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
