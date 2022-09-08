import { Menu, app } from 'electron'
const { session, BrowserWindow, clipboard } = process.type === 'browser' ? require('electron') : require('@electron/remote')
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
        hideShowChat: readData(ShortcutKeys.HIDE_SHOW_CHAT) ?? 'Ctrl+/',
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

function buildMenu() {
    const isMac = process.platform === 'darwin'
    const shortcuts = getShortcuts()
    const template = [
        // { role: 'appMenu' }
        ...(isMac
            ? [
                {
                    label: app.name,
                    submenu: [{ role: 'about' }, { type: 'separator' }, { type: 'separator' }, { role: 'hide' }, { role: 'hideOthers' }, { role: 'unhide' }, { type: 'separator' }, { role: 'quit' }]
                }
            ]
            : []),
        // { role: 'fileMenu' }
        {
            label: 'Вкладки',
            submenu: [
                {
                    label: 'Create new tab',
                    accelerator: shortcuts.newTab,
                    click: () => {
                        TabsController.mainWindow?.webContents.send(Channel.NEW_TAB)
                    }
                },
                {
                    label: 'Обновить вкладку',
                    accelerator: shortcuts.reload,
                    click: () => {
                        TabsController.mainWindow?.webContents.send(Channel.RELOAD)
                    }
                },
                {
                    label: 'Следующая вкладка',
                    accelerator: shortcuts.nextTab,
                    click: () => {
                        TabsController.mainWindow?.webContents.send(Channel.SWITCH_NEXT_TAB)
                    }
                },
                {
                    label: 'Предыдущая вкладка',
                    accelerator: shortcuts.prevTab,
                    click: () => {
                        TabsController.mainWindow?.webContents.send(Channel.SWITCH_PREV_TAB)
                    }
                },
                {
                    label: 'Скопировать URL страницы',
                    accelerator: shortcuts.copyWindowUrl,
                    click: () => {
                        const url = BrowserWindow.getFocusedWindow()?.webContents.getURL()
                        if(url && !url.startsWith('file:/')) {
                            clipboard.writeText(url)
                        } else {
                            clipboard.writeText(TabsController.currentTab().webContents.getURL())
                        }
                    }
                },
                { type: 'separator' },
                {
                    label: 'Закрыть вкладку',
                    accelerator: shortcuts.closeTab,
                    click: () => {
                        const openedWindow = BrowserWindow.getFocusedWindow()
                        if(!openedWindow && TabsController.currentTab().webContents.isDevToolsOpened()) {
                            TabsController.currentTab().webContents.closeDevTools()
                            return
                        }
                        if(openedWindow && openedWindow != TabsController.mainWindow) {
                            openedWindow.close()
                            return
                        }
                        if(openedWindow && openedWindow == TabsController.mainWindow && TabsController.tabsList.length == 1) {
                            if(isMac) {
                                openedWindow.close()
                            } else {
                                app.exit()
                            }
                        }
                        if(TabsController.currentTab() != TabsController.getMain()) {
                            TabsController.mainWindow?.webContents.send(Channel.CLOSE_TAB, TabsController.current_tab_id)
                        }
                    }
                }
            ]
        },
        // { role: 'editMenu' }
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                ...(isMac
                    ? [
                        { role: 'pasteAndMatchStyle' },
                        { role: 'delete' },
                        { role: 'selectAll' },
                        { type: 'separator' },
                        {
                            label: 'Speech',
                            submenu: [{ role: 'startSpeaking' }, { role: 'stopSpeaking' }]
                        }
                    ]
                    : [{ role: 'delete' }, { type: 'separator' }, { role: 'selectAll' }])
            ]
        },
        // { role: 'viewMenu' }
        {
            label: 'View',
            submenu: [
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                {
                    label: 'Дев панель',
                    accelerator: shortcuts.openDevTools,
                    click: () => {
                        const window = BrowserWindow.getFocusedWindow()
                        if(window == TabsController.mainWindow) {
                            TabsController.currentTab().webContents.openDevTools()
                        } else {
                            window?.webContents.openDevTools()
                        }
                    }
                },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                isMac
                    ? { role: 'togglefullscreen' }
                    : {
                        label: 'Фуллскрин',
                        accelerator: shortcuts.fullscreen,
                        click: () => {
                            TabsController.mainWindowContainer?.mainWindow.setFullScreen(!TabsController.mainWindowContainer?.mainWindow.isFullScreen())
                        }
                    }
            ]
        },
        // { role: 'windowMenu' }
        {
            label: 'Window',
            submenu: [{ role: 'minimize' }, { role: 'zoom' }, ...(isMac ? [{ type: 'separator' }, { role: 'front' }, { type: 'separator' }, { role: 'window' }] : [])]
        },
        {
            label: 'Плагины',
            submenu: [
                {
                    label: 'Открыть поедалку',
                    accelerator: shortcuts.openFood,
                    click: () => {
                        TabsController.mainWindow?.webContents.send(Channel.OPEN_FOOD)
                    }
                },
                {
                    label: 'Открыть блокнот',
                    accelerator: shortcuts.openNotes,
                    click: () => {
                        TabsController.mainWindow?.webContents.send(Channel.OPEN_NOTES)
                    }
                },
                {
                    label: 'Открыть переодевалку комплектов',
                    accelerator: shortcuts.openDressingRoom,
                    click: () => {
                        TabsController.mainWindow?.webContents.send(Channel.OPEN_DRESSING_ROOM)
                    }
                },
                {
                    label: 'Открыть переодевалку поясов',
                    accelerator: shortcuts.openBeltPotionRoom,
                    click: () => {
                        TabsController.mainWindow?.webContents.send(Channel.OPEN_BELT_POTION_ROOM)
                    }
                },
                {
                    label: 'Открыть лог чата',
                    accelerator: shortcuts.openChatLog,
                    click: () => {
                        TabsController.mainWindow?.webContents.send(Channel.OPEN_CHAT_LOG)
                    }
                },
                {
                    label: 'Открыть настройки чата',
                    accelerator: shortcuts.openChatSettings,
                    click: () => {
                        TabsController.mainWindow?.webContents.send(Channel.OPEN_CHAT_SETTINGS)
                    }
                },
                {
                    label: 'Открыть настройки нотификации',
                    accelerator: shortcuts.openNotifications,
                    click: () => {
                        TabsController.mainWindow?.webContents.send(Channel.OPEN_NOTIFICATIONS)
                    }
                },
                {
                    label: 'Открыть наборы эффектов',
                    accelerator: shortcuts.openEffectSets,
                    click: () => {
                        TabsController.mainWindow?.webContents.send(Channel.OPEN_EFFECT_SETS)
                    }
                },
                {
                    label: 'Открыть настройки сгораемых вещей',
                    accelerator: shortcuts.openExpiringItems,
                    click: () => {
                        TabsController.mainWindow?.webContents.send(Channel.OPEN_EXPIRING_ITEMS_SETTINGS)
                    }
                },
                {
                    label: 'Сделать скриншот',
                    accelerator: shortcuts.makeScreenshot,
                    click: () => {
                        TabsController.mainWindow?.webContents.send(Channel.MAKE_SCREENSHOT)
                    }
                },
                {
                    label: 'Открыть настройки',
                    accelerator: shortcuts.openSettings,
                    click: () => {
                        TabsController.mainWindow?.webContents.send(Channel.OPEN_SETTINGS)
                    }
                }
            ]
        },
        {
            label: 'Скиллы лука',
            submenu: [
                {
                    label: '1-й скилл',
                    accelerator: shortcuts.bowSkill1,
                    click: () => {
                        TabsController.mainWindowContainer?.browserView?.webContents.send(Channel.BOW_SKILL, 1)
                    }
                },
                {
                    label: '2-й скилл',
                    accelerator: shortcuts.bowSkill2,
                    click: () => {
                        TabsController.mainWindowContainer?.browserView?.webContents.send(Channel.BOW_SKILL, 2)
                    }
                },
                {
                    label: '3-й скилл',
                    accelerator: shortcuts.bowSkill3,
                    click: () => {
                        TabsController.mainWindowContainer?.browserView?.webContents.send(Channel.BOW_SKILL, 3)
                    }
                },
                {
                    label: '4-й скилл',
                    accelerator: shortcuts.bowSkill4,
                    click: () => {
                        TabsController.mainWindowContainer?.browserView?.webContents.send(Channel.BOW_SKILL, 4)
                    }
                },
                {
                    label: '5-й скилл',
                    accelerator: shortcuts.bowSkill5,
                    click: () => {
                        TabsController.mainWindowContainer?.browserView?.webContents.send(Channel.BOW_SKILL, 5)
                    }
                },
                {
                    label: '6-й скилл',
                    accelerator: shortcuts.bowSkill6,
                    click: () => {
                        TabsController.mainWindowContainer?.browserView?.webContents.send(Channel.BOW_SKILL, 6)
                    }
                },
                {
                    label: '7-й скилл',
                    accelerator: shortcuts.bowSkill7,
                    click: () => {
                        TabsController.mainWindowContainer?.browserView?.webContents.send(Channel.BOW_SKILL, 7)
                    }
                },
                {
                    label: '8-й скилл',
                    accelerator: shortcuts.bowSkill8,
                    click: () => {
                        TabsController.mainWindowContainer?.browserView?.webContents.send(Channel.BOW_SKILL, 8)
                    }
                },
                {
                    label: '9-й скилл',
                    accelerator: shortcuts.bowSkill9,
                    click: () => {
                        TabsController.mainWindowContainer?.browserView?.webContents.send(Channel.BOW_SKILL, 9)
                    }
                },
                {
                    label: '10-й скилл',
                    accelerator: shortcuts.bowSkill10,
                    click: () => {
                        TabsController.mainWindowContainer?.browserView?.webContents.send(Channel.BOW_SKILL, 10)
                    }
                },
                {
                    label: '11-й скилл',
                    accelerator: shortcuts.bowSkill11,
                    click: () => {
                        TabsController.mainWindowContainer?.browserView?.webContents.send(Channel.BOW_SKILL, 11)
                    }
                },
                {
                    label: '12-й скилл',
                    accelerator: shortcuts.bowSkill12,
                    click: () => {
                        TabsController.mainWindowContainer?.browserView?.webContents.send(Channel.BOW_SKILL, 12)
                    }
                },
                {
                    label: '13-й скилл',
                    accelerator: shortcuts.bowSkill13,
                    click: () => {
                        TabsController.mainWindowContainer?.browserView?.webContents.send(Channel.BOW_SKILL, 13)
                    }
                },
                {
                    label: '14-й скилл',
                    accelerator: shortcuts.bowSkill14,
                    click: () => {
                        TabsController.mainWindowContainer?.browserView?.webContents.send(Channel.BOW_SKILL, 14)
                    }
                },
                {
                    label: '15-й скилл',
                    accelerator: shortcuts.bowSkill15,
                    click: () => {
                        TabsController.mainWindowContainer?.browserView?.webContents.send(Channel.BOW_SKILL, 15)
                    }
                }
            ]
        },
        {
            label: 'Игровые шорткаты',
            submenu: [
                {
                    label: 'Открыть рюкзак',
                    accelerator: shortcuts.openBackpack,
                    click: () => {
                        TabsController.mainWindowContainer?.browserView?.webContents.send(Channel.OPEN_BACKPACK)
                    }
                },
                {
                    label: 'Открыть локацию',
                    accelerator: shortcuts.openLocation,
                    click: () => {
                        TabsController.mainWindowContainer?.browserView?.webContents.send(Channel.OPEN_LOCATION)
                    }
                },
                {
                    label: 'Открыть охоту',
                    accelerator: shortcuts.openHunt,
                    click: () => {
                        TabsController.mainWindowContainer?.browserView?.webContents.send(Channel.OPEN_HUNT)
                    }
                },
                {
                    label: 'Спрятать/Открыть чат',
                    accelerator: shortcuts.hideShowChat,
                    click: () => {
                        TabsController.mainWindowContainer?.browserView?.webContents.send(Channel.HIDE_SHOW_CHAT)
                    }
                }
            ]
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'Discord',
                    click: async() => {
                        const { shell } = require('electron')
                        await shell.openExternal('https://discord.gg/zPtuxVnfVY')
                    }
                },
                {
                    label: 'Github',
                    click: async() => {
                        const { shell } = require('electron')
                        await shell.openExternal('https://github.com/alhafram/Dwarium')
                    }
                },
                {
                    label: 'Youtube',
                    click: async() => {
                        const { shell } = require('electron')
                        await shell.openExternal('https://www.youtube.com/c/DWARMalefice')
                    }
                },
                { type: 'separator' },
                {
                    label: 'Почистить кеш',
                    click: async() => {
                        await session.defaultSession.clearStorageData({ storages: ['appcache', 'filesystem', 'indexdb', 'shadercache', 'cachestorage'] })
                        TabsController.currentTab().webContents.reload()
                    }
                }
            ]
        }
    ]
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}

function isClearKey(event: KeyboardEvent): boolean {
    if(event.key == 'Escape' || event.code == 'Escape') {
        return true
    }
    return false
}

function isExcludedKey(event: KeyboardEvent): boolean {
    const comboKeys = [
        'Control',
        'Meta',
        'Alt',
        'Shift',
        'Enter',
        ' ',
        'Backspace',
        'Backquote',
        'Comma',
        'Period',
        'BracketLeft',
        'BracketRight',
        'Backslash',
        'Quote',
        'Semicolon',
        'ArrowDown',
        'ArrowUp',
        'ArrowLeft',
        'ArrowRight'
    ]
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
    buildMenu,
    getShortcuts,
    writeData,
    isExcludedKey,
    parseCombination,
    resetShortcuts,
    isClearKey
}
