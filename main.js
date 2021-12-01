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

var tabs = {}
var current_tab_id = null

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
    tabs['main'] = browserView
    current_tab_id = 'main'
    mainWindow.setBrowserView(browserView)

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
        writeData('server', args)
    });

    ipcMain.on('reload', (evt) => {
        browserView.webContents.reload()
    })

    ipcMain.on('new_tab', (evt, id) => {
        browserView = new BrowserView({
            enablePreferredSizeMode: true
        })
        // console.log('ID', id)
        tabs[id] = browserView
        current_tab_id = id
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
        mainWindow.setBrowserView(tabs[id])
        browserView = tabs[id]
        current_tab_id = id
        mainWindow.webContents.send('url', tabs[id].webContents.getURL(), id)
    })

    ipcMain.on('remove_view', (evt, id) => {
        tabs[id] = null
    })

    loadConfig()

    electron.globalShortcut.register('CommandOrControl+W', () => {
        if(browserView == tabs['main']) {
            console.log("CANT CLOSE ITS MAIN WINDOW")
        } else {
            mainWindow.webContents.send('close_tab', current_tab_id)
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

const fs = require('fs')
const filePath = path.join(__dirname, 'config.json')

function loadConfig() {
    mainWindow.webContents.send('server', readData('server'))
}

function writeData(key, value) {
    let contents = parseData()
    contents[key] = value;
    fs.writeFileSync(filePath, JSON.stringify(contents));
}

function readData(key, value) {
    let contents = parseData()
    return contents[key]
}

function parseData() {
    const defaultData = {}
    try {
        return JSON.parse(fs.readFileSync(filePath));
    } catch(error) {
        return defaultData;
    }
}
