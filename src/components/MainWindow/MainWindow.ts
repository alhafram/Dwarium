import { BrowserView, BrowserWindow, globalShortcut, session, clipboard, Rectangle, app } from 'electron'
import path from 'path'
import configService from '../../services/ConfigService'
import { TabsController } from '../../services/TabsController'

export default class MainWindowContainer {

    browserView: BrowserView | null | undefined
    mainWindow: BrowserWindow
    isFullscreen = false

    constructor() {
        this.mainWindow = new BrowserWindow({
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
        this.mainWindow.setMenu(null)
        this.mainWindow.on('enter-full-screen', () => {
            const bounds = this.mainWindow.getBounds()
            if(TabsController.currentTab() != TabsController.getMain()) {
                bounds.y = 25
            }
            this.isFullscreen = true
            this.setViewContentBounds(TabsController.currentTab(), bounds)
        })

        this.mainWindow.on('leave-full-screen', () => {
            this.isFullscreen = false
            this.setViewContentBounds(TabsController.currentTab(), this.mainWindow.getBounds())
        })

        this.mainWindow.on('closed', () => {
            (this.browserView?.webContents as any).destroy()
            this.browserView = null
            this.unregisterShortcuts()
            this.sessionCheckInterval
            global.clearInterval(this.sessionCheckInterval as NodeJS.Timeout)
            this.sessionCheckInterval = undefined
        })

        this.mainWindow.webContents.on('did-finish-load', () => {
            let currentServer = configService.server()
            this.mainWindow.webContents.send('server', currentServer)
        })

        this.mainWindow.on('focus', () => {
            globalShortcut.register('CommandOrControl+W', () => {
                if(TabsController.currentTab() != TabsController.getMain()) {
                    this.mainWindow.webContents.send('close_tab', TabsController.current_tab_id)
                }
                if(TabsController.onlyMain()) {
                    this.mainWindow.close()
                }
            })
            globalShortcut.register('CommandOrControl+O', () => {
                TabsController.currentTab().webContents.openDevTools()
            })
            globalShortcut.register('CommandOrControl+Shift+K', async () => {
                await session.defaultSession.clearStorageData({  storages: ['appcache', 'filesystem', 'indexdb', 'shadercache', 'cachestorage'] })
                TabsController.currentTab().webContents.reload()
            })
            globalShortcut.register('CommandOrControl+Shift+C', () => {
                let url = BrowserWindow.getFocusedWindow()?.webContents.getURL()
                if(url) {
                    clipboard.writeText(url)
                }
            })
            globalShortcut.register('CommandOrControl+T', () => {
                this.mainWindow.webContents.send('new_tab')
            })
            if(process.platform == 'win32' || process.platform == 'linux') {
                globalShortcut.register('F11', () => {
                    this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen())
                })
            }
        })

        this.mainWindow.on('blur', () => {
            this.unregisterShortcuts()
        })
    }

    unregisterShortcuts() {
        globalShortcut.unregister('CommandOrControl+W')
        globalShortcut.unregister('CommandOrControl+O')
        globalShortcut.unregister('CommandOrControl+Shift+K')
        globalShortcut.unregister('CommandOrControl+T')
        if(process.platform == 'win32' || process.platform == 'linux') {
            globalShortcut.unregister('F11')
        }
    }

    setup() {
        this.browserView = this.createMainBrowserView()
        this.mainWindow.setBrowserView(this.browserView)

        // @ts-ignore - TS - FIX
        this.browserView.webContents.setWindowOpenHandler(({ url, features }) => {
            const excludedUrls = [
                `https://${configService.server()}.dwar.ru/action_form.php`,
                `https://${configService.server()}.dwar.ru/area_cube_recipes.php`
            ]
            for(const excludeUrl of excludedUrls) {
                if(url.includes(excludeUrl)) {
                    return {
                        action: 'allow',
                        overrideBrowserWindowOptions: {
                            enablePreferredSizeMode: true,
                            parent: configService.windowsAboveApp() ? TabsController.mainWindow : null
                        }
                    }
                }
            }
            if(configService.windowOpenNewTab() && !features.includes('location=no') || TabsController.currentTab() == TabsController.getMain() && !features) {
                this.mainWindow.webContents.send('new_tab', url)
                return {
                    action: 'deny'
                }
            } else {
                return {
                    action: 'allow',
                    overrideBrowserWindowOptions: {
                        enablePreferredSizeMode: true,
                        parent: configService.windowsAboveApp() ? TabsController.mainWindow : null,
                        webPreferences: {
                            contextIsolation: false,
                            nativeWindowOpen: true,
                            nodeIntegrationInSubFrames: true,
                        }
                    }
                }
            }
        })

        this.browserView.webContents.on('did-create-window', (window) => {
            window.setMenu(null)
            window.setFullScreen(false)
        })
    }

    getControlBounds() {
        const contentBounds = this.mainWindow.getContentBounds();
        return {
            x: 0,
            y: 0,
            width: contentBounds.width,
            height: 61
        }
    }

    setViewContentBounds(tab: BrowserView, size?: Rectangle) {
        const [contentWidth, contentHeight] = this.mainWindow.getContentSize()
        const controlBounds = this.getControlBounds()
        let y = controlBounds.y + controlBounds.height
        if(configService.hideTopPanelInFullScreen() && TabsController.getMain() == TabsController.currentTab()) {
            y = this.isFullscreen ? 0 : y
            controlBounds.height = this.isFullscreen ? 0 : controlBounds.height
        }
        if(tab) {
            tab.setBounds({
                x: 0,
                y: y,
                width: size && process.platform == 'win32' ? size.width : contentWidth,
                height: size && process.platform == 'win32' ? size.height : contentHeight - controlBounds.height
            })
        }
    }

    sessionCheckInterval: NodeJS.Timeout | undefined
    start() {
        this.mainWindow.show();
        if(configService.maximizeOnStart()) {
            this.mainWindow.maximize()
        }
        this.mainWindow.loadFile(`${path.join(app.getAppPath(), 'gui', 'MainWindow', 'index.html')}`);
        const self = this
        this.sessionCheckInterval = setInterval(async function() {
            if(TabsController.getMain().webContents.isDestroyed() || self.mainWindow.webContents.isDestroyed()) {
                return
            }
            let resp = await TabsController.getMain().webContents.executeJavaScript('window.myId')
            if(!self.mainWindow.webContents.isDestroyed()) {
                if(resp) {
                    self.mainWindow.webContents.send('auth', true)
                } else {
                    self.mainWindow.webContents.send('auth', false)
                }
            }
        }, 1000)
    }

    createMainBrowserView() {
        let browserView = new BrowserView({
            webPreferences: {
                enablePreferredSizeMode: true,
                preload: path.join(__dirname, 'MainBrowserViewPreload.js'),
                contextIsolation: false,
                nativeWindowOpen: true
            }
        })
        browserView.webContents.on('did-finish-load', () => {
            this.mainWindow.webContents.send('url', browserView.webContents.getURL(), 'main')
        })
        browserView.webContents.setZoomFactor(0.9)
        browserView.setAutoResize({
            width: true,
            height: true
        })
        return browserView
    }
}