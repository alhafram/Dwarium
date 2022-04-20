import { BrowserView, BrowserWindow, globalShortcut, session, clipboard, Rectangle, app } from 'electron'
import path from 'path'
import ConfigService from '../../services/ConfigService'
import { TabsController } from '../../services/TabsController'
import { Channel } from '../../Models/Channel'
import { WindowType } from '../../Models/WindowModels'
import setupContextMenu from '../../services/ContextMenu'
import { getBrowserWindowPosition, getClientWindowPosition, saveBrowserWindowPosition, saveClientWindowPosition } from '../../services/WindowSizeManager'

export default class MainWindowContainer {
    browserView: BrowserView | null | undefined
    mainWindow: BrowserWindow
    isFullscreen = false
    restoreUrls: string[] = []

    constructor() {
        const mainWindowPosition = getClientWindowPosition(WindowType.MAIN)
        this.mainWindow = new BrowserWindow({
            x: mainWindowPosition?.x ?? 0,
            y: mainWindowPosition?.y ?? 0,
            width: mainWindowPosition?.width ?? 1400,
            height: mainWindowPosition?.height ?? 900,
            minWidth: 1200,
            minHeight: 500,
            title: 'Dwarium',
            icon: __dirname + '/icon.icns',
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
                backgroundThrottling: false
            },
            useContentSize: true,
            show: false,
            paintWhenInitiallyHidden: true
        })
        const settings = ConfigService.getSettings()
        this.restoreUrls = settings.needToRestoreUrls ? settings.restoreUrls : []
        this.mainWindow.webContents.incrementCapturerCount()
        this.mainWindow.on('close', () => {
            saveClientWindowPosition(WindowType.MAIN, this.mainWindow.getBounds())
        })
        require('@electron/remote/main').enable(this.mainWindow.webContents)
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
            const currentServer = ConfigService.getSettings().server
            this.mainWindow.webContents.send(Channel.SERVER, currentServer)
        })

        this.mainWindow.on('focus', () => {
            this.browserView?.webContents.focus()
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
            globalShortcut.register('CommandOrControl+Shift+K', async() => {
                await session.defaultSession.clearStorageData({ storages: ['appcache', 'filesystem', 'indexdb', 'shadercache', 'cachestorage'] })
                TabsController.currentTab().webContents.reload()
            })
            globalShortcut.register('CommandOrControl+Shift+C', () => {
                const url = BrowserWindow.getFocusedWindow()?.webContents.getURL()
                if(url) {
                    clipboard.writeText(url)
                }
            })
            globalShortcut.register('CommandOrControl+T', () => {
                this.mainWindow.webContents.send(Channel.NEW_TAB)
            })
            globalShortcut.register('Control+Tab', () => {
                this.mainWindow.webContents.send(Channel.SWITCH_NEXT_TAB)
            })
            globalShortcut.register('Control+Shift+Tab', () => {
                this.mainWindow.webContents.send(Channel.SWITCH_PREV_TAB)
            })
            if(process.platform == 'win32' || process.platform == 'linux') {
                globalShortcut.register('F11', () => {
                    this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen())
                })
                globalShortcut.register('F9', () => {
                    this.mainWindow.webContents.send(Channel.TAKE_SCREENSHOT)
                })
                globalShortcut.register('F5', () => {
                    this.mainWindow.webContents.send(Channel.RELOAD)
                })
            } else {
                globalShortcut.register('CommandOrControl+F', () => {
                    this.mainWindow.webContents.send(Channel.TAKE_SCREENSHOT)
                })
                globalShortcut.register('CommandOrControl+R', () => {
                    this.mainWindow.webContents.send(Channel.RELOAD)
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
        globalShortcut.unregister('Control+Tab')
        globalShortcut.unregister('Control+Shift+Tab')
        if(process.platform == 'win32' || process.platform == 'linux') {
            globalShortcut.unregister('F11')
            globalShortcut.unregister('F9')
            globalShortcut.unregister('F5')
        } else {
            globalShortcut.unregister('CommandOrControl+F')
            globalShortcut.unregister('CommandOrControl+R')
        }
    }

    getPositionFor(url: string): Rectangle | undefined {
        const convertedURL = new URL(url)
        const path = convertedURL.pathname
        return getBrowserWindowPosition(path)
    }

    parseFeatures(features: string): Rectangle {
        const splittedFeatures = features.split(',')
        const x = parseInt(
            splittedFeatures
                .find((str) => str.startsWith('left'))
                ?.split('=')
                .pop() ?? ''
        )
        const y = parseInt(
            splittedFeatures
                .find((str) => str.startsWith('top'))
                ?.split('=')
                .pop() ?? ''
        )
        const width = parseInt(
            splittedFeatures
                .find((str) => str.startsWith('width'))
                ?.split('=')
                .pop() ?? ''
        )
        const height = parseInt(
            splittedFeatures
                .find((str) => str.startsWith('height'))
                ?.split('=')
                .pop() ?? ''
        )
        return {
            x: x,
            y: y,
            width: width,
            height: height
        }
    }

    setup() {
        this.browserView = this.createMainBrowserView()
        this.mainWindow.setBrowserView(this.browserView)

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore - TS - FIX
        this.browserView.webContents.setWindowOpenHandler(({ url, features }) => {
            const excludedUrls = [
                `${ConfigService.getSettings().baseUrl}/action_form.php`,
                `${ConfigService.getSettings().baseUrl}/area_cube_recipes.php`,
                `${ConfigService.getSettings().baseUrl}/friend_list.php`
            ]
            const windowPosition = this.getPositionFor(url)
            const defaultPosition = this.parseFeatures(features)
            for(const excludeUrl of excludedUrls) {
                if(url.includes(excludeUrl)) {
                    return {
                        action: 'allow',
                        overrideBrowserWindowOptions: {
                            parent: ConfigService.getSettings().windowsAboveApp ? TabsController.mainWindow : null,
                            x: windowPosition?.x ?? (defaultPosition.x > 0 ? defaultPosition.x : 0),
                            y: windowPosition?.y ?? (defaultPosition.y > 0 ? defaultPosition.y : 0),
                            width: windowPosition?.width ?? defaultPosition.width,
                            height: windowPosition?.height ?? defaultPosition.height,
                            resizable: true,
                            movable: true,
                            fullscreen: false
                        }
                    }
                }
            }
            if((ConfigService.getSettings().windowOpenNewTab && !features.includes('location=no')) || (TabsController.currentTab() == TabsController.getMain() && !features)) {
                this.mainWindow.webContents.send(Channel.NEW_TAB, url)
                return {
                    action: 'deny'
                }
            } else {
                return {
                    action: 'allow',
                    overrideBrowserWindowOptions: {
                        parent: ConfigService.getSettings().windowsAboveApp ? TabsController.mainWindow : null,
                        x: windowPosition?.x ?? (defaultPosition.x > 0 ? defaultPosition.x : 0),
                        y: windowPosition?.y ?? (defaultPosition.y > 0 ? defaultPosition.y : 0),
                        width: windowPosition?.width ?? defaultPosition.width,
                        height: windowPosition?.height ?? defaultPosition.height,
                        resizable: true,
                        movable: true,
                        fullscreen: false,
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
            setupContextMenu(window)
        })
    }

    setupCreatedWindow(window: BrowserWindow) {
        window.setMenu(null)
        window.setFullScreen(false)
        this.setupOpenHandler(window)
    }

    setupOpenHandler(window: BrowserWindow) {
        window.webContents.setWindowOpenHandler(({ url, features }) => {
            const windowPosition = this.getPositionFor(url)
            const defaultPosition = this.parseFeatures(features)

            const newWindow = new BrowserWindow({
                x: windowPosition?.x ?? (defaultPosition.x > 0 ? defaultPosition.x : 0),
                y: windowPosition?.y ?? (defaultPosition.y > 0 ? defaultPosition.y : 0),
                width: windowPosition?.width ?? defaultPosition.width,
                height: windowPosition?.height ?? defaultPosition.height,
                parent: ConfigService.getSettings().windowsAboveApp ? this.mainWindow : undefined,
                fullscreen: false
            })
            setupContextMenu(newWindow)
            this.setupOpenHandler(newWindow)
            newWindow.loadURL(url)
            return {
                action: 'deny'
            }
        })
        window.on('moved', () => {
            const url = window.webContents?.getURL()
            if(!url) {
                return
            }
            const convertedURL = new URL(url)
            saveBrowserWindowPosition(convertedURL.pathname, window.getBounds())
            if(ConfigService.getSettings().windowsAboveApp) {
                this.mainWindow.focus()
            }
        })
        window.on('close', () => {
            const url = window.webContents?.getURL()
            if(!url) {
                return
            }
            const convertedURL = new URL(url)
            saveBrowserWindowPosition(convertedURL.pathname, window.getBounds())
            if(ConfigService.getSettings().windowsAboveApp) {
                this.mainWindow.focus()
            }
        })
    }

    getControlBounds() {
        const contentBounds = this.mainWindow.getContentBounds()
        return {
            x: 0,
            y: 0,
            width: contentBounds.width,
            height: 72
        }
    }

    setViewContentBounds(tab: BrowserView, size?: Rectangle) {
        const [contentWidth, contentHeight] = this.mainWindow.getContentSize()
        const controlBounds = this.getControlBounds()
        let y = controlBounds.y + controlBounds.height
        if(ConfigService.getSettings().hideTopPanelInFullScreen && TabsController.getMain() == TabsController.currentTab()) {
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
        this.mainWindow.show()
        if(ConfigService.getSettings().maximizeOnStart) {
            this.mainWindow.maximize()
        }
        this.mainWindow.loadFile(`${path.join(app.getAppPath(), 'gui', 'MainWindow', 'index.html')}`)
    }

    createMainBrowserView() {
        const browserView = new BrowserView({
            webPreferences: {
                enablePreferredSizeMode: true,
                preload: path.join(__dirname, 'MainBrowserViewPreload.js'),
                contextIsolation: false,
                nativeWindowOpen: true,
                webSecurity: false
            }
        })
        setupContextMenu(browserView)

        browserView.webContents.on('did-finish-load', () => {
            this.mainWindow.webContents.send(Channel.URL, browserView.webContents.getURL(), 'main')
            this.restoreUrls.forEach(url => {
                TabsController.mainWindow?.webContents.send(Channel.NEW_TAB_WITH_URL, url)
            })
            this.restoreUrls = []
        })
        browserView.webContents.setZoomFactor(0.9)
        browserView.setAutoResize({
            width: true,
            height: true
        })
        return browserView
    }
}
