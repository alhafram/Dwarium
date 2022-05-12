import { globalShortcut } from 'electron'
import { Channel } from '../Models/Channel'
import { buildPath, ConfigPath } from '../Models/ConfigPathes'
import FileOperationsService from './FileOperationsService'
import { TabsController } from './TabsController'

const path = buildPath(ConfigPath.SHORTCUTS)

export type Shortcuts = {
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
}

export enum ShortcutKeys {
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
    OPEN_SETTINGS = 'openSettings'
}

function getShortcuts(): Shortcuts {
    const settings = {
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
        openSettings: readData(ShortcutKeys.OPEN_SETTINGS) ?? 'F12'
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
    globalShortcut.register(shortcuts.openFood, async() => {
        TabsController.mainWindow?.webContents.send(Channel.OPEN_FOOD)
    })
    globalShortcut.register(shortcuts.openNotes, async() => {
        TabsController.mainWindow?.webContents.send(Channel.OPEN_NOTES)
    })
    globalShortcut.register(shortcuts.openDressingRoom, async() => {
        TabsController.mainWindow?.webContents.send(Channel.OPEN_DRESSING_ROOM)
    })
    globalShortcut.register(shortcuts.openBeltPotionRoom, async() => {
        TabsController.mainWindow?.webContents.send(Channel.OPEN_BELT_POTION_ROOM)
    })
    globalShortcut.register(shortcuts.openChatLog, async() => {
        TabsController.mainWindow?.webContents.send(Channel.OPEN_CHAT_LOG)
    })
    globalShortcut.register(shortcuts.openChatSettings, async() => {
        TabsController.mainWindow?.webContents.send(Channel.OPEN_CHAT_SETTINGS)
    })
    globalShortcut.register(shortcuts.openNotifications, async() => {
        TabsController.mainWindow?.webContents.send(Channel.OPEN_NOTIFICATIONS)
    })
    globalShortcut.register(shortcuts.openEffectSets, async() => {
        TabsController.mainWindow?.webContents.send(Channel.OPEN_EFFECT_SETS)
    })
    globalShortcut.register(shortcuts.openExpiringItems, async() => {
        TabsController.mainWindow?.webContents.send(Channel.OPEN_EXPIRING_ITEMS_SETTINGS)
    })
    globalShortcut.register(shortcuts.makeScreenshot, async() => {
        TabsController.mainWindow?.webContents.send(Channel.MAKE_SCREENSHOT)
    })
    globalShortcut.register(shortcuts.openSettings, async() => {
        TabsController.mainWindow?.webContents.send(Channel.OPEN_SETTINGS)
    })
}

function unregisterShortcuts() {
    const shortcuts = getShortcuts()
    globalShortcut.unregister(shortcuts.openFood)
    globalShortcut.unregister(shortcuts.openNotes)
    globalShortcut.unregister(shortcuts.openDressingRoom)
    globalShortcut.unregister(shortcuts.openBeltPotionRoom)
    globalShortcut.unregister(shortcuts.openChatLog)
    globalShortcut.unregister(shortcuts.openChatSettings)
    globalShortcut.unregister(shortcuts.openNotifications)
    globalShortcut.unregister(shortcuts.openEffectSets)
    globalShortcut.unregister(shortcuts.openExpiringItems)
    globalShortcut.unregister(shortcuts.makeScreenshot)
    globalShortcut.unregister(shortcuts.openSettings)
}

export default {
    getShortcuts,
    writeData,
    registerShortcuts,
    unregisterShortcuts
}
