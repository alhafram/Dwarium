const { globalShortcut, session, BrowserWindow, clipboard } = process.type === 'browser' ? require('electron') : require('@electron/remote')
import { Channel } from '../Models/Channel'
import { buildPath, ConfigPath } from '../Models/ConfigPathes'
import FileOperationsService from './FileOperationsService'
import { TabsController } from './TabsController'

const path = buildPath(ConfigPath.SHORTCUTS)

export type Shortcuts = {
    openHunt: string
    openBackpack: string
    openLocation: string

    openDevTools: string
    prevTab: string
    nextTab: string
    newTab: string
    reload: string
    closeTab: string
    clearCache: string
    copyWindowUrl: string
    openFood: string
    openNotes: string
    openDressingRoom: string
    openBeltPotionRoom: string
    openChatLog: string
    openChatSettings: string
    openNotifications: string
    openEffectSets: string
    openExpiringItems: string
    makeScreenshot: string
    openSettings: string
    hideShowChat: string
    fullscreen: string

    bowSkill1: string
    bowSkill2: string
    bowSkill3: string
    bowSkill4: string
    bowSkill5: string
    bowSkill6: string
    bowSkill7: string
    bowSkill8: string
    bowSkill9: string
    bowSkill10: string
    bowSkill11: string
    bowSkill12: string
    bowSkill13: string
    bowSkill14: string
    bowSkill15: string
}

export enum ShortcutKeys {
    OPEN_HUNT = 'openHunt',
    OPEN_BACKPACK = 'openBackpack',
    OPEN_LOCATION = 'openLocation',

    OPEN_DEV_TOOLS = 'openDevTools',
    PREV_TAB = 'prevTab',
    NEXT_TAB = 'nextTab',
    NEW_TAB = 'newTab',
    RELOAD = 'reload',
    CLOSE_TAB = 'closeTab',
    CLEAR_CACHE = 'clearCache',
    COPY_WINDOW_URL = 'copyWindowUrl',

    OPEN_FOOD = 'openFood',
    OPEN_NOTES = 'openNotes',
    OPEN_DRESSING_ROOM = 'openDressingRoom',
    OPEN_BELT_POTION_ROOM = 'openBeltPotionRoom',
    OPEN_CHAT_LOG = 'openChatLog',
    OPEN_CHAT_SETTINGS = 'openChatSettings',
    OPEN_NOTIFICATIONS = 'openNotifications',
    OPEN_EFFECT_SETS = 'openEffectSets',
    OPEN_EXPIRING_ITEMS_SETTINGS = 'openExpiringItemsSettings',
    MAKE_SCREENSHOT = 'makeScreenshot',
    OPEN_SETTINGS = 'openSettings',
    HIDE_SHOW_CHAT = 'hideShowChat',
    FULLSCREEN = 'fullscreen',

    BOW_SKILL_1 = 'bowSkill1',
    BOW_SKILL_2 = 'bowSkill2',
    BOW_SKILL_3 = 'bowSkill3',
    BOW_SKILL_4 = 'bowSkill4',
    BOW_SKILL_5 = 'bowSkill5',
    BOW_SKILL_6 = 'bowSkill6',
    BOW_SKILL_7 = 'bowSkill7',
    BOW_SKILL_8 = 'bowSkill8',
    BOW_SKILL_9 = 'bowSkill9',
    BOW_SKILL_10 = 'bowSkill10',
    BOW_SKILL_11 = 'bowSkill11',
    BOW_SKILL_12 = 'bowSkill12',
    BOW_SKILL_13 = 'bowSkill13',
    BOW_SKILL_14 = 'bowSkill14',
    BOW_SKILL_15 = 'bowSkill15'
}

function getShortcuts(): Shortcuts {
    const settings = {
        openHunt: readData(ShortcutKeys.OPEN_HUNT) ?? 'Alt+A',
        openBackpack: readData(ShortcutKeys.OPEN_BACKPACK) ?? 'Alt+S',
        openLocation: readData(ShortcutKeys.OPEN_LOCATION) ?? 'Alt+D',

        openDevTools: readData(ShortcutKeys.OPEN_DEV_TOOLS) ?? 'CommandOrControl+O',
        prevTab: readData(ShortcutKeys.PREV_TAB) ?? 'Control+Shift+Tab',
        nextTab: readData(ShortcutKeys.NEXT_TAB) ?? 'Control+Tab',
        newTab: readData(ShortcutKeys.NEW_TAB) ?? 'CommandOrControl+T',
        reload: readData(ShortcutKeys.RELOAD) ?? 'CommandOrControl+R',
        closeTab: readData(ShortcutKeys.CLOSE_TAB) ?? 'CommandOrControl+W',
        clearCache: readData(ShortcutKeys.CLEAR_CACHE) ?? 'CommandOrControl+Shift+K',
        copyWindowUrl: readData(ShortcutKeys.COPY_WINDOW_URL) ?? 'CommandOrControl+Shift+C',
        openFood: readData(ShortcutKeys.OPEN_FOOD) ?? 'F1',
        openNotes: readData(ShortcutKeys.OPEN_NOTES) ?? 'F2',
        openDressingRoom: readData(ShortcutKeys.OPEN_DRESSING_ROOM) ?? 'F3',
        openBeltPotionRoom: readData(ShortcutKeys.OPEN_BELT_POTION_ROOM) ?? 'F4',
        openChatLog: readData(ShortcutKeys.OPEN_CHAT_LOG) ?? 'F5',
        openChatSettings: readData(ShortcutKeys.OPEN_CHAT_SETTINGS) ?? 'F6',
        openNotifications: readData(ShortcutKeys.OPEN_NOTIFICATIONS) ?? 'F7',
        openEffectSets: readData(ShortcutKeys.OPEN_EFFECT_SETS) ?? 'F8',
        openExpiringItems: readData(ShortcutKeys.OPEN_EXPIRING_ITEMS_SETTINGS) ?? 'F9',
        makeScreenshot: readData(ShortcutKeys.MAKE_SCREENSHOT) ?? 'F10',
        openSettings: readData(ShortcutKeys.OPEN_SETTINGS) ?? 'F12',
        hideShowChat: readData(ShortcutKeys.HIDE_SHOW_CHAT) ?? 'Shift+P',
        fullscreen: readData(ShortcutKeys.FULLSCREEN) ?? 'F11',

        bowSkill1: readData(ShortcutKeys.BOW_SKILL_1) ?? 'Alt+1',
        bowSkill2: readData(ShortcutKeys.BOW_SKILL_2) ?? 'Alt+2',
        bowSkill3: readData(ShortcutKeys.BOW_SKILL_3) ?? 'Alt+3',
        bowSkill4: readData(ShortcutKeys.BOW_SKILL_4) ?? 'Alt+4',
        bowSkill5: readData(ShortcutKeys.BOW_SKILL_5) ?? 'Alt+5',
        bowSkill6: readData(ShortcutKeys.BOW_SKILL_6) ?? 'Alt+6',
        bowSkill7: readData(ShortcutKeys.BOW_SKILL_7) ?? 'Alt+7',
        bowSkill8: readData(ShortcutKeys.BOW_SKILL_8) ?? 'Alt+8',
        bowSkill9: readData(ShortcutKeys.BOW_SKILL_9) ?? 'Alt+9',
        bowSkill10: readData(ShortcutKeys.BOW_SKILL_10) ?? 'Alt+0',
        bowSkill11: readData(ShortcutKeys.BOW_SKILL_11) ?? 'Alt+Q',
        bowSkill12: readData(ShortcutKeys.BOW_SKILL_12) ?? 'Alt+W',
        bowSkill13: readData(ShortcutKeys.BOW_SKILL_13) ?? 'Alt+E',
        bowSkill14: readData(ShortcutKeys.BOW_SKILL_14) ?? 'Alt+R',
        bowSkill15: readData(ShortcutKeys.BOW_SKILL_15) ?? 'Alt+T'
    }
    return settings
}

function writeData(key: ShortcutKeys, value: any): void {
    const contents = FileOperationsService.parseData(path) as any
    contents[key] = value
    Object.keys(contents).forEach((key) => {
        if(contents[key] === null) {
            delete contents[key]
        }
    })
    FileOperationsService.writeData(path, JSON.stringify(contents))
}

function readData(key: string): any {
    const contents = FileOperationsService.parseData(path) as any
    return contents[key]
}

function registerShortcuts() {
    const shortcuts = getShortcuts()

    if(shortcuts.openHunt != '') {
        globalShortcut.register(shortcuts.openHunt, () => {
            TabsController.mainWindowContainer?.browserView?.webContents.send(Channel.OPEN_HUNT)
        })
    }

    if(shortcuts.openBackpack != '') {
        globalShortcut.register(shortcuts.openBackpack, () => {
            TabsController.mainWindowContainer?.browserView?.webContents.send(Channel.OPEN_BACKPACK)
        })
    }

    if(shortcuts.openLocation != '') {
        globalShortcut.register(shortcuts.openLocation, () => {
            TabsController.mainWindowContainer?.browserView?.webContents.send(Channel.OPEN_LOCATION)
        })
    }

    if(shortcuts.openDevTools != '') {
        globalShortcut.register(shortcuts.openDevTools, () => {
            TabsController.currentTab().webContents.openDevTools()
        })
    }
    if(shortcuts.prevTab != '') {
        globalShortcut.register(shortcuts.prevTab, () => {
            TabsController.mainWindow?.webContents.send(Channel.SWITCH_PREV_TAB)
        })
    }
    if(shortcuts.nextTab != '') {
        globalShortcut.register(shortcuts.nextTab, () => {
            TabsController.mainWindow?.webContents.send(Channel.SWITCH_NEXT_TAB)
        })
    }
    if(shortcuts.newTab != '') {
        globalShortcut.register(shortcuts.newTab, () => {
            TabsController.mainWindow?.webContents.send(Channel.NEW_TAB)
        })
    }
    if(shortcuts.reload != '') {
        globalShortcut.register(shortcuts.reload, () => {
            TabsController.mainWindow?.webContents.send(Channel.RELOAD)
        })
    }
    if(shortcuts.closeTab != '') {
        globalShortcut.register(shortcuts.closeTab, () => {
            const openedWindow = BrowserWindow.getFocusedWindow()
            if(openedWindow && openedWindow != TabsController.mainWindow) {
                openedWindow.close()
                return
            }
            if(TabsController.currentTab() != TabsController.getMain()) {
                TabsController.mainWindow?.webContents.send(Channel.CLOSE_TAB, TabsController.current_tab_id)
            }
            if(TabsController.onlyMain()) {
                TabsController.mainWindow?.close()
            }
        })
    }
    if(shortcuts.clearCache != '') {
        globalShortcut.register(shortcuts.clearCache, async() => {
            await session.defaultSession.clearStorageData({ storages: ['appcache', 'filesystem', 'indexdb', 'shadercache', 'cachestorage'] })
            TabsController.currentTab().webContents.reload()
        })
    }
    if(shortcuts.copyWindowUrl != '') {
        globalShortcut.register(shortcuts.copyWindowUrl, async() => {
            const url = BrowserWindow.getFocusedWindow()?.webContents.getURL()
            if(url) {
                clipboard.writeText(url)
            }
        })
    }

    if(shortcuts.openFood != '') {
        globalShortcut.register(shortcuts.openFood, () => {
            TabsController.mainWindow?.webContents.send(Channel.OPEN_FOOD)
        })
    }
    if(shortcuts.openNotes != '') {
        globalShortcut.register(shortcuts.openNotes, () => {
            TabsController.mainWindow?.webContents.send(Channel.OPEN_NOTES)
        })
    }
    if(shortcuts.openDressingRoom != '') {
        globalShortcut.register(shortcuts.openDressingRoom, () => {
            TabsController.mainWindow?.webContents.send(Channel.OPEN_DRESSING_ROOM)
        })
    }
    if(shortcuts.openBeltPotionRoom != '') {
        globalShortcut.register(shortcuts.openBeltPotionRoom, () => {
            TabsController.mainWindow?.webContents.send(Channel.OPEN_BELT_POTION_ROOM)
        })
    }
    if(shortcuts.openChatLog != '') {
        globalShortcut.register(shortcuts.openChatLog, () => {
            TabsController.mainWindow?.webContents.send(Channel.OPEN_CHAT_LOG)
        })
    }
    if(shortcuts.openChatSettings != '') {
        globalShortcut.register(shortcuts.openChatSettings, () => {
            TabsController.mainWindow?.webContents.send(Channel.OPEN_CHAT_SETTINGS)
        })
    }
    if(shortcuts.openNotifications != '') {
        globalShortcut.register(shortcuts.openNotifications, () => {
            TabsController.mainWindow?.webContents.send(Channel.OPEN_NOTIFICATIONS)
        })
    }
    if(shortcuts.openEffectSets != '') {
        globalShortcut.register(shortcuts.openEffectSets, () => {
            TabsController.mainWindow?.webContents.send(Channel.OPEN_EFFECT_SETS)
        })
    }
    if(shortcuts.openExpiringItems != '') {
        globalShortcut.register(shortcuts.openExpiringItems, () => {
            TabsController.mainWindow?.webContents.send(Channel.OPEN_EXPIRING_ITEMS_SETTINGS)
        })
    }
    if(shortcuts.makeScreenshot != '') {
        globalShortcut.register(shortcuts.makeScreenshot, () => {
            TabsController.mainWindow?.webContents.send(Channel.MAKE_SCREENSHOT)
        })
    }
    if(shortcuts.openSettings != '') {
        globalShortcut.register(shortcuts.openSettings, () => {
            TabsController.mainWindow?.webContents.send(Channel.OPEN_SETTINGS)
        })
    }
    if(shortcuts.hideShowChat != '') {
        globalShortcut.register(shortcuts.hideShowChat, () => {
            TabsController.mainWindowContainer?.browserView?.webContents.send(Channel.HIDE_SHOW_CHAT)
        })
    }
    if(shortcuts.fullscreen != '') {
        globalShortcut.register(shortcuts.fullscreen, () => {
            TabsController.mainWindowContainer?.mainWindow.setFullScreen(!TabsController.mainWindowContainer?.mainWindow.isFullScreen())
        })
    }

    if(shortcuts.bowSkill1 != '') {
        globalShortcut.register(shortcuts.bowSkill1, () => {
            TabsController.mainWindowContainer?.browserView?.webContents.send(Channel.BOW_SKILL, 1)
        })
    }
    if(shortcuts.bowSkill2 != '') {
        globalShortcut.register(shortcuts.bowSkill2, () => {
            TabsController.mainWindowContainer?.browserView?.webContents.send(Channel.BOW_SKILL, 2)
        })
    }
    if(shortcuts.bowSkill3 != '') {
        globalShortcut.register(shortcuts.bowSkill3, () => {
            TabsController.mainWindowContainer?.browserView?.webContents.send(Channel.BOW_SKILL, 3)
        })
    }
    if(shortcuts.bowSkill4 != '') {
        globalShortcut.register(shortcuts.bowSkill4, () => {
            TabsController.mainWindowContainer?.browserView?.webContents.send(Channel.BOW_SKILL, 4)
        })
    }
    if(shortcuts.bowSkill5 != '') {
        globalShortcut.register(shortcuts.bowSkill5, () => {
            TabsController.mainWindowContainer?.browserView?.webContents.send(Channel.BOW_SKILL, 5)
        })
    }
    if(shortcuts.bowSkill6 != '') {
        globalShortcut.register(shortcuts.bowSkill6, () => {
            TabsController.mainWindowContainer?.browserView?.webContents.send(Channel.BOW_SKILL, 6)
        })
    }
    if(shortcuts.bowSkill7 != '') {
        globalShortcut.register(shortcuts.bowSkill7, () => {
            TabsController.mainWindowContainer?.browserView?.webContents.send(Channel.BOW_SKILL, 7)
        })
    }
    if(shortcuts.bowSkill8 != '') {
        globalShortcut.register(shortcuts.bowSkill8, () => {
            TabsController.mainWindowContainer?.browserView?.webContents.send(Channel.BOW_SKILL, 8)
        })
    }
    if(shortcuts.bowSkill9 != '') {
        globalShortcut.register(shortcuts.bowSkill9, () => {
            TabsController.mainWindowContainer?.browserView?.webContents.send(Channel.BOW_SKILL, 9)
        })
    }
    if(shortcuts.bowSkill10 != '') {
        globalShortcut.register(shortcuts.bowSkill10, () => {
            TabsController.mainWindowContainer?.browserView?.webContents.send(Channel.BOW_SKILL, 10)
        })
    }
    if(shortcuts.bowSkill11 != '') {
        globalShortcut.register(shortcuts.bowSkill11, () => {
            TabsController.mainWindowContainer?.browserView?.webContents.send(Channel.BOW_SKILL, 11)
        })
    }
    if(shortcuts.bowSkill12 != '') {
        globalShortcut.register(shortcuts.bowSkill12, () => {
            TabsController.mainWindowContainer?.browserView?.webContents.send(Channel.BOW_SKILL, 12)
        })
    }
    if(shortcuts.bowSkill13 != '') {
        globalShortcut.register(shortcuts.bowSkill13, () => {
            TabsController.mainWindowContainer?.browserView?.webContents.send(Channel.BOW_SKILL, 13)
        })
    }
    if(shortcuts.bowSkill14 != '') {
        globalShortcut.register(shortcuts.bowSkill14, () => {
            TabsController.mainWindowContainer?.browserView?.webContents.send(Channel.BOW_SKILL, 14)
        })
    }
    if(shortcuts.bowSkill15 != '') {
        globalShortcut.register(shortcuts.bowSkill15, () => {
            TabsController.mainWindowContainer?.browserView?.webContents.send(Channel.BOW_SKILL, 15)
        })
    }
}

function unregisterShortcuts() {
    globalShortcut.unregisterAll()
}

function isClearKey(event: KeyboardEvent): boolean {
    if(event.key == 'Escape' || event.code == 'Escape') {
        return true
    }
    return false
}

function isExcludedKey(event: KeyboardEvent): boolean {
    const comboKeys = ['Control', 'Meta', 'Alt', 'Shift', 'Enter', ' ', 'Backspace', 'Backquote', 'Comma', 'Period', 'BracketLeft', 'BracketRight', 'Backslash', 'Quote', 'Semicolon']
    if(comboKeys.includes(event.key) || comboKeys.includes(event.code)) {
        return true
    }
    return false
}

function parseCombination(event: KeyboardEvent): string {
    let combination = ''
    if(event.ctrlKey) {
        combination += 'Ctrl+'
    }
    if(event.shiftKey) {
        combination += 'Shift+'
    }
    if(event.altKey) {
        combination += 'Alt+'
    }
    let realKey: string = event.code
    if(realKey.includes('Digit')) {
        realKey = realKey.substring(5)
    } else if(realKey.includes('Key')) {
        realKey = realKey.substring(3)
    } else {
        realKey = event.key
    }
    combination += realKey.toUpperCase()
    return combination
}

function resetShortcuts(): void {
    FileOperationsService.deleteFile(path)
}

export default {
    getShortcuts,
    writeData,
    registerShortcuts,
    unregisterShortcuts,
    isExcludedKey,
    parseCombination,
    resetShortcuts,
    isClearKey
}
