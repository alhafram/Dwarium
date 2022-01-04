const {
    BrowserView,
    BrowserWindow,
    globalShortcut,
    session,
    clipboard
} = require('electron')
const path = require('path')
const configService = require('../../services/ConfigService')
const TabsController = require('../../services/TabsController')

class MainWindow extends BrowserWindow {

    browserView = null

    constructor() {
        super({
            width: 1400,
            height: 900,
            title: 'Dwarium',
            icon: __dirname + '/icon.icns',
            webPreferences: {
                sandbox: true,
                preload: path.join(__dirname, 'preload.js'),
                backgroundThrottling: false
            },
            useContentSize: true,
            show: false
        })

        this.on('resized', (evt) => {
            this.setContentBounds()
        })

        this.on('closed', function() {
            this.unregisterShortcuts()
            clearInterval(this.sessionCheckInterval)
            this.sessionCheckInterval = null
        })

        this.webContents.on('did-finish-load', () => {
            let currentServer = configService.server()
            this.webContents.send('server', currentServer)
        })

        this.on('focus', () => {
            globalShortcut.register('CommandOrControl+W', () => {
                if(TabsController.currentTab() != TabsController.getMain()) {
                    this.webContents.send('close_tab', TabsController.current_tab_id)
                }
                if(TabsController.onlyMain()) {
                    this.close()
                }
            })
            globalShortcut.register('CommandOrControl+O', () => {
                TabsController.currentTab().webContents.openDevTools()
            })
            globalShortcut.register('CommandOrControl+Shift+K', () => {
                session.defaultSession.clearStorageData([], (data) => {})
                TabsController.currentTab().webContents.reload()
            })
            globalShortcut.register('CommandOrControl+Shift+C', () => {
                let url = BrowserWindow.getFocusedWindow()?.webContents.getURL()
                if(url) {
                    clipboard.writeText(url)
                }
            })
            globalShortcut.register('CommandOrControl+T', () => {
                this.send('new_tab')
            })
        })

        this.on('blur', () => {
            this.unregisterShortcuts()
        })
    }

    unregisterShortcuts() {
        globalShortcut.unregister('CommandOrControl+W')
        globalShortcut.unregister('CommandOrControl+O')
        globalShortcut.unregister('CommandOrControl+Shift+K')
        globalShortcut.unregister('CommandOrControl+T')
    }

    setup() {
        this.browserView = this.createMainBrowserView()
        this.setBrowserView(this.browserView)
        this.browserView.webContents.setWindowOpenHandler(({
            url,
            features
        }) => {
            if(TabsController.currentTab() == TabsController.getMain() && !features) {
                this.send('new_tab', url)
                return {
                    action: 'deny'
                }
            } else {
                return {
                    action: 'allow',
                    overrideBrowserWindowOptions: {
                        enablePreferredSizeMode: true,
                        webPreferences: {
                            contextIsolation: false,
                            nativeWindowOpen: true,
                            nodeIntegrationInSubFrames: true,
                        }
                    }
                }
            }
        })
    }

    getControlBounds() {
        const contentBounds = this.getContentBounds();
        return {
            x: 0,
            y: 0,
            width: contentBounds.width,
            height: 81
        }
    }

    setContentBounds(tab) {
        const [contentWidth, contentHeight] = this.getContentSize();
        const controlBounds = this.getControlBounds();
        if(tab) {
            tab.setBounds({
                x: 0,
                y: controlBounds.y + controlBounds.height,
                width: contentWidth + (process.platform == 'win32' ? 50 : 0),
                height: contentHeight - (process.platform == 'win32' ? 0 : controlBounds.height)
            });
        }
    }

    sessionCheckInterval = null
    start() {
        this.show();
        // mainWindow.maximize();
        this.loadFile(`${path.join(__dirname, 'index.html')}`);
        const self = this
        this.sessionCheckInterval = setInterval(async function() {
            let resp = await self.browserView.webContents.executeJavaScript('window.myId')
            if(resp) {
                self.send('auth', true)
            } else {
                self.send('auth', false)
            }
        }, 1000)
    }

    createMainBrowserView() {
        let browserView = new BrowserView({
            enablePreferredSizeMode: true,
            webPreferences: {
                preload: path.join(__dirname, 'MainBrowserViewPreload.js'),
                contextIsolation: false,
                nativeWindowOpen: true
            }
        })
        browserView.webContents.on('did-finish-load', (e) => {
            this.send('url', browserView.webContents.getURL(), 'main')
        })
        browserView.webContents.setZoomFactor(0.9)
        browserView.setAutoResize({
            width: true,
            height: true
        })
        return browserView
    }
}

module.exports.MainWindow = MainWindow
