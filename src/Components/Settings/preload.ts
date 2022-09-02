import { SettingsWindowActions } from './Actions'
import reduce from './Reducer'
import { getTitle, SettingsWindowState, UserAgentType } from './SettingsWindowState'
import setupMode from '../../Services/DarkModeHandler'
import { render, setupView } from './Renderer'
import ShortcutService from '../../Services/ShortcutService'

let initialState: SettingsWindowState = {
    userAgents: Object.keys(UserAgentType).map((key) => {
        return {
            id: key,
            value: getTitle(UserAgentType[key as keyof typeof UserAgentType])
        }
    }),
    selectedUserAgentType: UserAgentType.DEFAULT,
    selectedUserAgentValue: UserAgentType.DEFAULT,
    windowOpenNewTab: false,
    windowsAboveApp: false,
    maximizeOnStart: false,
    hideTopPanelInFullScreen: false,
    animationSpeedType: '',
    mailServer: false,
    userAgentTextFieldActive: false,
    screenshotsFolderPath: '',
    ownServer: '',
    fightNotificationsSystem: false,
    fightNotificationsIngame: false,
    fightFinishedNotificationsSystem: false,
    fightFinishedNotificationsIngame: false,
    battlegroundNotificationsSystem: false,
    battlegroundNotificationsIngame: false,
    messageNotificationsSystem: false,
    messageNotificationsIngame: false,
    mailNotificationsSystem: false,
    mailNotificationsIngame: false,
    updateChannel: 'stable',
    needToRestoreUrls: false,
    shortcuts: ShortcutService.getShortcuts()
}

export function dispatch(action: SettingsWindowActions, data?: unknown): void {
    initialState = reduce(initialState, action, data)
    render(initialState)
}

document.addEventListener('DOMContentLoaded', async() => {
    dispatch(SettingsWindowActions.LOAD_SETTINGS)
    setupView()
    setupMode()
})
