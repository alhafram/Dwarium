import { app } from '@electron/remote'
import ConfigService from '../../services/ConfigService'
import ShortcutService, { ShortcutKeys } from '../../services/ShortcutService'
import { SettingsWindowActions } from './Actions'
import { Elements } from './Elements'
import { SettingsWindowState, UserAgentType } from './SettingsWindowState'

export default function reduce(state: SettingsWindowState, action: SettingsWindowActions, data: unknown): SettingsWindowState {
    switch (action) {
        case SettingsWindowActions.LOAD_SETTINGS: {
            const loadedSettings = ConfigService.getSettings()
            if(Object.keys(loadedSettings).length == 0) {
                return state
            } else {
                return {
                    ...state,
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    selectedUserAgentType: UserAgentType[Object.keys(UserAgentType)[Object.values(UserAgentType).indexOf(loadedSettings.selectedUserAgentType)]],
                    selectedUserAgentValue: loadedSettings.selectedUserAgentValue,
                    userAgentTextFieldActive: loadedSettings.selectedUserAgentType == UserAgentType.OWN,
                    windowOpenNewTab: loadedSettings.windowOpenNewTab,
                    windowsAboveApp: loadedSettings.windowsAboveApp,
                    hideTopPanelInFullScreen: loadedSettings.hideTopPanelInFullScreen,
                    animationSpeedType: loadedSettings.animationSpeedType,
                    mailServer: loadedSettings.mailServer,
                    maximizeOnStart: loadedSettings.maximizeOnStart,
                    screenshotsFolderPath: app.getPath('userData') + '/screens',
                    ownServer: loadedSettings.ownServer ?? '',
                    fightNotificationsSystem: loadedSettings.fightNotificationsSystem,
                    fightNotificationsIngame: loadedSettings.fightNotificationsIngame,
                    battlegroundNotificationsSystem: loadedSettings.battlegroundNotificationsSystem,
                    battlegroundNotificationsIngame: loadedSettings.battlegroundNotificationsIngame,
                    messageNotificationsSystem: loadedSettings.messageNotificationsSystem,
                    messageNotificationsIngame: loadedSettings.messageNotificationsIngame,
                    mailNotificationsSystem: loadedSettings.mailNotificationsSystem,
                    mailNotificationsIngame: loadedSettings.mailNotificationsIngame,
                    updateChannel: loadedSettings.updateChannel,
                    needToRestoreUrls: loadedSettings.needToRestoreUrls
                }
            }
        }
        case SettingsWindowActions.SAVE_SETTINGS: {
            const savedSettings = Object.assign({}, state)
            delete savedSettings.userAgents
            delete savedSettings.userAgentTextFieldActive
            savedSettings.selectedUserAgentValue = Elements.userAgentTextInput().value
            savedSettings.ownServer = Elements.ownServerInput().value
            if(savedSettings.selectedUserAgentValue.length == 0) {
                alert('User-Agent не может быть пустым')
                return state
            }
            ConfigService.writeData('settings', JSON.stringify(savedSettings))
            saveShortCuts()
            if(confirm('Для того что бы настройки вступили в силу, необходимо перезапустить клиент!')) {
                app.relaunch()
                app.quit()
            }
            return {
                ...state,
                selectedUserAgentValue: savedSettings.selectedUserAgentValue
            }
        }
        case SettingsWindowActions.SAVE_SHORTCUTS: {
            saveShortCuts()
            return {
                ...state,
                shortcuts: ShortcutService.getShortcuts()
            }
        }
        case SettingsWindowActions.CHANGE_USER_AGENT: {
            const newValue = Elements.userAgentsSelect().value
            let userAgentType = UserAgentType[newValue as keyof typeof UserAgentType]
            let userAgentValue = userAgentType.toString()
            if(UserAgentType[newValue as keyof typeof UserAgentType].toString() == UserAgentType.OWN.toString()) {
                userAgentType = UserAgentType.OWN
                userAgentValue = ''
            }
            return {
                ...state,
                selectedUserAgentType: userAgentType,
                selectedUserAgentValue: userAgentValue,
                userAgentTextFieldActive: userAgentType == UserAgentType.OWN
            }
        }
        case SettingsWindowActions.CHANGE_WINDOW_OPEN_NEW_TAB:
            return {
                ...state,
                windowOpenNewTab: Elements.windowOpenNewTabInput().checked
            }
        case SettingsWindowActions.CHANGE_WINDOWS_ABOVE_APP:
            return {
                ...state,
                windowsAboveApp: Elements.windowsAboveAppInput().checked
            }
        case SettingsWindowActions.CHANGE_MAXIMIZE_ON_START:
            return {
                ...state,
                maximizeOnStart: Elements.maximizeOnStartInput().checked
            }
        case SettingsWindowActions.CHANGE_HIDE_TOP_PANEL_IN_FULL_SCREEN:
            return {
                ...state,
                hideTopPanelInFullScreen: Elements.hideTopPanelInFullScreenInput().checked
            }
        case SettingsWindowActions.CHANGE_ANIMATION_SPEED_TYPE:
            return {
                ...state,
                animationSpeedType: data as string
            }
        case SettingsWindowActions.CHANGE_MAIL_SERVER:
            return {
                ...state,
                mailServer: Elements.mailServerInput().checked
            }
        case SettingsWindowActions.CHANGE_UPDATE_CHANNEL:
            return {
                ...state,
                updateChannel: data as string
            }
        case SettingsWindowActions.CHANGE_NEED_TO_RESTORE_URLS:
            return {
                ...state,
                needToRestoreUrls: Elements.needToRestoreUrlsInput().checked
            }
    }
}

function saveShortCuts() {

    ShortcutService.writeData(ShortcutKeys.OPEN_DEV_TOOLS, Elements.openDevToolsShortcutInput().value)
    ShortcutService.writeData(ShortcutKeys.PREV_TAB, Elements.prevTabShortcutInput().value)
    ShortcutService.writeData(ShortcutKeys.NEXT_TAB, Elements.nextTabShortcutInput().value)
    ShortcutService.writeData(ShortcutKeys.NEW_TAB, Elements.newTabShortcutInput().value)
    ShortcutService.writeData(ShortcutKeys.RELOAD, Elements.reloadShortcutInput().value)
    ShortcutService.writeData(ShortcutKeys.CLOSE_TAB, Elements.closeTabShortcutInput().value)
    ShortcutService.writeData(ShortcutKeys.CLEAR_CACHE, Elements.clearCacheShortcutInput().value)
    ShortcutService.writeData(ShortcutKeys.COPY_WINDOW_URL, Elements.copyWindowUrlShortcutInput().value)

    ShortcutService.writeData(ShortcutKeys.OPEN_FOOD, Elements.openFoodShortcutInput().value)
    ShortcutService.writeData(ShortcutKeys.OPEN_NOTES, Elements.openNotesShortcutInput().value)
    ShortcutService.writeData(ShortcutKeys.OPEN_DRESSING_ROOM, Elements.openDressingRoomShortcutInput().value)
    ShortcutService.writeData(ShortcutKeys.OPEN_BELT_POTION_ROOM, Elements.openBeltPotionRoomShortcutInput().value)
    ShortcutService.writeData(ShortcutKeys.OPEN_CHAT_LOG, Elements.openChatLogShortcutInput().value)
    ShortcutService.writeData(ShortcutKeys.OPEN_CHAT_SETTINGS, Elements.openChatSettingsShortcutInput().value)
    ShortcutService.writeData(ShortcutKeys.OPEN_NOTIFICATIONS, Elements.openNotificationsShortcutInput().value)
    ShortcutService.writeData(ShortcutKeys.OPEN_EFFECT_SETS, Elements.openEffectSetsShortcutInput().value)
    ShortcutService.writeData(ShortcutKeys.OPEN_EXPIRING_ITEMS_SETTINGS, Elements.openExpiringItemsSettingsShortcutInput().value)
    ShortcutService.writeData(ShortcutKeys.MAKE_SCREENSHOT, Elements.makeScreenshotShortcutInput().value)
    ShortcutService.writeData(ShortcutKeys.OPEN_SETTINGS, Elements.openSettingsShortcutInput().value)
    ShortcutService.writeData(ShortcutKeys.HIDE_SHOW_CHAT, Elements.hideShowChatShortcutInput().value)
    ShortcutService.writeData(ShortcutKeys.FULLSCREEN, Elements.fullscreenShortcutInput().value)

    ShortcutService.writeData(ShortcutKeys.BOW_SKILL_1, Elements.bowSkill1ShortcutInput().value)
    ShortcutService.writeData(ShortcutKeys.BOW_SKILL_2, Elements.bowSkill2ShortcutInput().value)
    ShortcutService.writeData(ShortcutKeys.BOW_SKILL_3, Elements.bowSkill3ShortcutInput().value)
    ShortcutService.writeData(ShortcutKeys.BOW_SKILL_4, Elements.bowSkill4ShortcutInput().value)
    ShortcutService.writeData(ShortcutKeys.BOW_SKILL_5, Elements.bowSkill5ShortcutInput().value)
    ShortcutService.writeData(ShortcutKeys.BOW_SKILL_6, Elements.bowSkill6ShortcutInput().value)
    ShortcutService.writeData(ShortcutKeys.BOW_SKILL_7, Elements.bowSkill7ShortcutInput().value)
    ShortcutService.writeData(ShortcutKeys.BOW_SKILL_8, Elements.bowSkill8ShortcutInput().value)
    ShortcutService.writeData(ShortcutKeys.BOW_SKILL_9, Elements.bowSkill9ShortcutInput().value)
    ShortcutService.writeData(ShortcutKeys.BOW_SKILL_10, Elements.bowSkill10ShortcutInput().value)
    ShortcutService.writeData(ShortcutKeys.BOW_SKILL_11, Elements.bowSkill11ShortcutInput().value)
    ShortcutService.writeData(ShortcutKeys.BOW_SKILL_12, Elements.bowSkill12ShortcutInput().value)
    ShortcutService.writeData(ShortcutKeys.BOW_SKILL_13, Elements.bowSkill13ShortcutInput().value)
    ShortcutService.writeData(ShortcutKeys.BOW_SKILL_14, Elements.bowSkill14ShortcutInput().value)
    ShortcutService.writeData(ShortcutKeys.BOW_SKILL_15, Elements.bowSkill15ShortcutInput().value)
}
