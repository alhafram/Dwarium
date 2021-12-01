const electron = require('electron')

const app = electron.app
const BrowserWindow = electron.BrowserWindow
const BrowserView = electron.BrowserView
const path = require('path')
const url = require('url')
const ipcMain = electron.ipcMain

let mainWindow
let browserView

function getControlBounds() {
    const contentBounds = mainWindow.getContentBounds();
    return {
        x: 0,
        y: 0,
        width: contentBounds.width,
        height: 50
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

function createWindow() {

    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        title: 'Dwarium',
        icon: __dirname + '/icon.icns',
        webPreferences: {
            sandbox: true,
            preload: path.join(__dirname, "preload.js")
        },
        useContentSize: true,
        show: false
    })

    browserView = new BrowserView({
        enablePreferredSizeMode: true
    })
    mainWindow.addBrowserView(browserView)

    browserView.setBounds(getControlBounds())
    browserView.setAutoResize({
        width: true
    });
    browserView.webContents.loadURL('http://w2.dwar.ru')
    setContentBounds()

    // mainWindow.maximize();
    mainWindow.show();

    mainWindow.loadFile(`${path.join(app.getAppPath(), 'index.html')}`);

    // Open the DevTools.
    // browserView.webContents.openDevTools()

    browserView.webContents.on('did-start-navigation', (evt) => {
        mainWindow.webContents.send('start_navigation_with_url', evt.sender.getURL())
        // console.log("Start navigation", evt.sender.getURL())
    })

    browserView.webContents.on('did-navigate', (evt) => {
        // mainWindow.webContents.send('start_navigation_with_url', evt.sender.getURL())
        // console.log("Finish navigation", evt.sender.getURL())
    })

    browserView.webContents.on('did-frame-navigate', (evt) => {
        // mainWindow.webContents.send('start_navigation_with_url', evt.sender.getURL())
        // console.log("Finish frame navigation", evt.sender.getURL())
    })

    mainWindow.on('closed', function() {
        mainWindow = null
    })

    mainWindow.on('page-title-updated', (evt) => {
        evt.preventDefault();
    });

    mainWindow.on('resized', (evt) => {
        setContentBounds()
    })

    ipcMain.on("load_url", (evt, args) => {
        browserView.webContents.loadURL('http://' + args + '.dwar.ru')
    });

    ipcMain.on('reload', (evt) => {
        browserView.webContents.reload()
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
