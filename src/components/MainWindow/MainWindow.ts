import { BrowserView, BrowserWindow, globalShortcut, session, clipboard, Rectangle, app } from 'electron'
import path from 'path'
import configService from '../../services/ConfigService'
import { TabsController } from '../../services/TabsController'
import { Channel } from '../../Models/Channel'

export default class MainWindowContainer {

    browserView: BrowserView | null | undefined
    mainWindow: BrowserWindow
    isFullscreen = false

    constructor() {
        this.mainWindow = new BrowserWindow({
            width: 1400,
            height: 900,
            minWidth: 1100,
            minHeight: 500,
            title: 'Dwarium',
            icon: __dirname + '/icon.icns',
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
                backgroundThrottling: false
            },
            useContentSize: true,
            show: false
        })
        require("@electron/remote/main").enable(this.mainWindow.webContents)
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
        })

        this.mainWindow.webContents.on('did-finish-load', () => {
            let currentServer = configService.server()
            this.mainWindow.webContents.send(Channel.SERVER, currentServer)
        })

        this.mainWindow.on('focus', () => {
            globalShortcut.register('CommandOrControl+W', () => {
                if(TabsController.currentTab() != TabsController.getMain()) {
                    this.mainWindow.webContents.send(Channel.CLOSE_TAB, TabsController.current_tab_id)
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
                this.mainWindow.webContents.send(Channel.NEW_TAB)
            })
            if(process.platform == 'win32' || process.platform == 'linux') {
                globalShortcut.register('F11', () => {
                    this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen())
                })
                globalShortcut.register('F9', () => {
                    this.mainWindow.webContents.send(Channel.TAKE_SCREENSHOT)
                })
            } else {
                globalShortcut.register('CommandOrControl+F', () => {
                    this.mainWindow.webContents.send(Channel.TAKE_SCREENSHOT)
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
            globalShortcut.unregister('F9')
        } else {
            globalShortcut.unregister('CommandOrControl+F')
        }
    }

    setup() {
        this.browserView = this.createMainBrowserView()
        this.mainWindow.setBrowserView(this.browserView)

        // @ts-ignore - TS - FIX
        this.browserView.webContents.setWindowOpenHandler(({ url, features }) => {
            const splittedFeatures = features.split(',')
            const left = parseInt(splittedFeatures.find(str => str.startsWith('left'))?.split('=').pop() ?? '')
            const top = parseInt(splittedFeatures.find(str => str.startsWith('top'))?.split('=').pop() ?? '')
            const excludedUrls = [
                `${configService.baseUrl()}/action_form.php`,
                `${configService.baseUrl()}/area_cube_recipes.php`
            ]
            for(const excludeUrl of excludedUrls) {
                if(url.includes(excludeUrl)) {
                    return {
                        action: 'allow',
                        overrideBrowserWindowOptions: {
                            parent: configService.windowsAboveApp() ? TabsController.mainWindow : null,
                            x: left > 0 ? left : 0,
                            y: top > 0 ? top : 0,
                            webPreferences: {
                                enablePreferredSizeMode: true
                            }
                        }
                    }
                }
            }
            if(configService.windowOpenNewTab() && !features.includes('location=no') || TabsController.currentTab() == TabsController.getMain() && !features) {
                this.mainWindow.webContents.send(Channel.NEW_TAB, url)
                return {
                    action: 'deny'
                }
            } else {
                return {
                    action: 'allow',
                    overrideBrowserWindowOptions: {
                        parent: configService.windowsAboveApp() ? TabsController.mainWindow : null,
                        x: left > 0 ? left : 0,
                        y: top > 0 ? top : 0,
                        webPreferences: {
                            contextIsolation: false,
                            nativeWindowOpen: true,
                            nodeIntegrationInSubFrames: true,
                            enablePreferredSizeMode: true
                        }
                    }
                }
            }
        })

        this.browserView?.webContents.on('did-create-window', (window) => {
            this.setupCreatedWindow(window)
        })
    }

    setupCreatedWindow(window: BrowserWindow) {
        window.setMenu(null)
        window.setFullScreen(false)
        this.setupOpenHandler(window)
    }

    setupOpenHandler(window: BrowserWindow) {
        window.webContents.setWindowOpenHandler(({ url, features }) => {
            const splittedFeatures = features.split(',')
            const x = parseInt(splittedFeatures.find(str => str.startsWith('left'))?.split('=').pop() ?? '')
            const y = parseInt(splittedFeatures.find(str => str.startsWith('top'))?.split('=').pop() ?? '')
            const width = parseInt(splittedFeatures.find(str => str.startsWith('width'))?.split('=').pop() ?? '')
            const height = parseInt(splittedFeatures.find(str => str.startsWith('height'))?.split('=').pop() ?? '')
            const newWindow = new BrowserWindow({
                x: x,
                y:y,
                width: width,
                height: height,
                parent: configService.windowsAboveApp() ? this.mainWindow : undefined
            })
            this.setupOpenHandler(newWindow)
            newWindow.loadURL(url)
            return {
                action: 'deny'
            }
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

    start() {
        this.mainWindow.show();
        if(configService.maximizeOnStart()) {
            this.mainWindow.maximize()
        }
        this.mainWindow.loadFile(`${path.join(app.getAppPath(), 'gui', 'MainWindow', 'index.html')}`)
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
            this.mainWindow.webContents.send(Channel.URL, browserView.webContents.getURL(), 'main')
        })
        browserView.webContents.setZoomFactor(0.9)
        browserView.setAutoResize({
            width: true,
            height: true
        })
        return browserView
    }
}