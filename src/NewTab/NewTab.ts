import { BrowserView } from 'electron'
import { Channel } from '../Models/Channel'
import ConfigService from '../Services/ConfigService'
import setupContextMenu from '../Services/ContextMenu'
import { TabsController } from '../Services/TabsController'
import path from 'path'

// eslint-disable-next-line @typescript-eslint/ban-types
export default function createNewTab(url: string, id: string, closeFavouriteListBrowserView: Function) {
    url = url ?? 'https://google.com'
    const browserView = new BrowserView({
        webPreferences: {
            enablePreferredSizeMode: true,
            webSecurity: false,
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
        }
    })
    setupContextMenu(browserView)
    const tabId = id
    browserView.webContents.on('did-finish-load', () => {
        const originalTitle = browserView.webContents.getTitle()
        let title = originalTitle.slice(0, 8)
        if(originalTitle.length > 10) {
            title = title.concat('..')
        }
        browserView.webContents.executeJavaScript('dwariumId = {}')
        TabsController.mainWindow?.webContents.send(Channel.FINISH_LOAD_URL, tabId, title)
        TabsController.mainWindow?.webContents.send(Channel.URL, browserView.webContents.getURL(), tabId)
    })
    browserView.webContents.on('did-create-window', (window) => {
        setupContextMenu(window)
        TabsController.mainWindowContainer?.setupOpenHandler(window)
    })
    if(ConfigService.getSettings().windowOpenNewTab) {
        browserView.webContents.setWindowOpenHandler(({ url }) => {
            TabsController.mainWindow?.webContents.send(Channel.NEW_TAB, url)
            return {
                action: 'deny'
            }
        })
    } else {
        browserView.webContents.setWindowOpenHandler(() => {
            return {
                action: 'allow',
                overrideBrowserWindowOptions: {
                    webPreferences: {
                        webSecurity: false
                    },
                    autoHideMenuBar: true
                }
            }
        })
    }
    TabsController.addTab(tabId, browserView)
    closeFavouriteListBrowserView()
    TabsController.setupCurrent(tabId)
    TabsController.mainWindow?.setBrowserView(browserView)

    browserView.setAutoResize({
        width: true
    })
    TabsController.mainWindowContainer?.setViewContentBounds(TabsController.currentTab())
    browserView.webContents.loadURL(url)
    TabsController.mainWindow?.webContents.send(Channel.URL, url, tabId)
}