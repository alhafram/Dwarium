import ConfigService from './ConfigService'
import path from 'path'
import { TabsController } from './TabsController'
import { BrowserWindow } from 'electron'
import { Channel } from '../Models/Channel'
import setupContextMenu from './ContextMenu'
import { WindowType, HTMLPath } from '../Models/WindowModels'
import { getClientWindowPosition, saveClientWindowPosition } from './WindowSizeManager'
import ShortcutService from './ShortcutService'

export function createWindowAndLoad(windowType: WindowType, htmlPath?: HTMLPath, preloadPath?: string, enableRemote = false, contextIsolation = true): BrowserWindow {
    const windowPosition = getClientWindowPosition(windowType)
    let minWidth = 1100
    let minHeight = 300
    if(windowType == WindowType.USER_INFO || windowType == WindowType.USER_EFFECTS) {
        minWidth = 100
        minHeight = 100
    }
    const window: BrowserWindow | null = new BrowserWindow({
        x: windowPosition?.x ?? 0,
        y: windowPosition?.y ?? 0,
        width: windowPosition?.width ?? 1100,
        height: windowPosition?.height ?? 700,
        minWidth: minWidth,
        minHeight: minHeight,
        parent: ConfigService.getSettings().windowsAboveApp ? TabsController.mainWindow ?? undefined : undefined,
        webPreferences: {
            preload: preloadPath ? path.join(__dirname, preloadPath) : undefined,
            contextIsolation: contextIsolation,
            webSecurity: false
        },
        fullscreen: false
    })
    setupContextMenu(window)
    if(htmlPath) {
        window.loadFile(path.join(__dirname, htmlPath))
    }
    if(enableRemote) {
        require('@electron/remote/main').enable(window.webContents)
    }
    TabsController.mainWindow?.webContents.send(Channel.OPEN_WINDOW, windowType, true)
    window.on('focus', () => {
        ShortcutService.registerShortcuts()
    })
    window.on('blur', () => {
        ShortcutService.unregisterShortcuts()
    })
    return window
}

export function setupCloseLogic(window: BrowserWindow, windowType: WindowType, onClose: () => void) {
    window.on('close', () => {
        saveClientWindowPosition(windowType, window.getBounds())
    })
    window.on('closed', () => {
        onClose()
        if(!TabsController.mainWindow?.webContents.isDestroyed()) {
            TabsController.mainWindow?.webContents.send(Channel.OPEN_WINDOW, windowType, false)
        }
    })
}
