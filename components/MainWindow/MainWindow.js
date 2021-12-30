const {
    BrowserView,
    BrowserWindow,
    globalShortcut,
    session
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
        let win = this
        this.on('closed', function() {
            win = null
        })
        this.webContents.on('did-finish-load', () => {
            let current_server = configService.server
            this.webContents.send('server', current_server)
        })
        this.on('focus', () => {
            globalShortcut.register('CommandOrControl+W', () => {
                if(TabsController.currentTab() != TabsController.getMain()) {
                    win.webContents.send('close_tab', TabsController.current_tab_id)
                }
            })
            globalShortcut.register('CommandOrControl+O', () => {
                TabsController.currentTab().webContents.openDevTools()
            })
            globalShortcut.register('CommandOrControl+Shift+K', () => {
                session.defaultSession.clearStorageData([], (data) => {})
                TabsController.currentTab().webContents.reload()
            })
        })
        this.on('blur', () => {
            globalShortcut.unregister('CommandOrControl+W')
            globalShortcut.unregister('CommandOrControl+O')
            globalShortcut.unregister('CommandOrControl+Shift+K')
        })
    }

    setup() {
        this.browserView = this.createMainBrowserView()
        this.setBrowserView(this.browserView)
        let win = this
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
                    action: 'allow'
                }
            }
        })

        this.browserView.webContents.on('did-create-window', (window, details) => {
            if(details.url.includes('https://account.my.games/oauth2')) {
                window.on('closed', function() {
                    win.browserView.webContents.send('AuthComplete')
                })
            }
        })
    }

    getControlBounds() {
        const contentBounds = this.getContentBounds();
        return {
            x: 0,
            y: 0,
            width: contentBounds.width,
            height: 100
        }
    }

    setContentBounds(tab) {
        const [contentWidth, contentHeight] = this.getContentSize();
        const controlBounds = this.getControlBounds();
        if(tab) {
            tab.setBounds({
                x: 0,
                y: controlBounds.y + controlBounds.height,
                width: contentWidth,
                height: contentHeight - controlBounds.height + 2 // Fix white line
            });
        }
    }

    start() {
        this.show();
        // mainWindow.maximize();
        this.loadFile(`${path.join(__dirname, 'index.html')}`);
        const self = this
        setInterval(async function() {
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
                nativeWindowOpen: false
            }
        })
        browserView.webContents.setZoomFactor(0.9)
        browserView.setBounds(this.getControlBounds())
        browserView.setAutoResize({
            width: true,
            height: true
        })
        browserView.webContents.openDevTools()
        return browserView
    }
}

module.exports.MainWindow = MainWindow
