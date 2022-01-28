import ConfigService from './ConfigService'
import path from 'path'
import { TabsController } from './TabsController'
import { BrowserWindow } from 'electron'
import { Channel } from '../Models/Channel'
import setupContextMenu from './ContextMenu'

import { getClientWindowPosition, saveClientWindowPosition } from './WindowSizeManager'

export function createWindowAndLoad(windowType: WindowType, htmlPath?: HTMLPath, preloadPath?: string, enableRemote: boolean = false, contextIsolation: boolean = true): BrowserWindow {
    const windowPosition = getClientWindowPosition(windowType)
    let window: BrowserWindow | null = new BrowserWindow({
        x: windowPosition?.x ?? 0,
        y: windowPosition?.y ?? 0,
        width: windowPosition?.width ?? 900,
        height: windowPosition?.height ?? 700,
        minWidth: 900,
        minHeight: 700,
        parent: ConfigService.windowsAboveApp() ? TabsController.mainWindow! : undefined,
        webPreferences: {
            preload: preloadPath ? path.join(__dirname, preloadPath) : undefined,
            contextIsolation: contextIsolation
        }
    })
    setupContextMenu(window)
    if(htmlPath) {
        window.loadFile(path.join(__dirname, htmlPath))
    }
    if(enableRemote) {
        require("@electron/remote/main").enable(window.webContents)
    }
    TabsController.mainWindow?.webContents.send(Channel.OPEN_WINDOW, windowType, true)
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

export enum Preload {
    DRESSING = '../Components/Dressing/preload.js',
    BELT = '../Components/Belt/preload.js',
    CHAT_LOG = '../Components/ChatLog/preload.js',
    SETTINGS = '../Components/Settings/preload.js',
    NOTES = '../Components/Notes/preload.js',
    FOOD = '../Components/Food/preload.js'
}

export enum HTMLPath {
    DRESSING = '../../gui/Dressing/index.html',
    BELT = '../../gui/Belt/index.html',
    CHAT_LOG = '../../gui/ChatLog/index.html',
    SETTINGS = '../../gui/Settings/index.html',
    NOTES = '../../gui/Notes/index.html',
    FOOD = '../../gui/Food/index.html',
    CHAT_SETTINGS = '../../gui/ChatSettings/index.html'
}

export enum WindowType {
    MAIN = 'main',
    DRESSING_ROOM = 'dressingRoom',
    BELT_POTION_ROOM = 'beltPotionRoom',
    CHAT_LOG = 'chatLog',
    CHAT_SETTINGS = 'chatSettings',
    SETTINGS = 'settings',
    NOTES = 'notes',
    FOOD = 'food',
    SCREENSHOT = 'screenshot',
    USER_INFO = 'userInfo',
    USER_EFFECTS = 'userEffects',
}