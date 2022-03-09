import { SettingsWindowActions } from './Actions'
import reduce from './Reducer'
import { getTitle, SettingsWindowState, UserAgentType } from './SettingsWindowState'
import setupMode from '../../services/DarkModeHandler'
import { render, setupView } from './Renderer'


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
    battlegroundNotificationsSystem: false,
    battlegroundNotificationsIngame: false,
    messageNotificationsSystem: false,
    messageNotificationsIngame: false,
    mailNotificationsSystem: false,
    mailNotificationsIngame: false,
    updateChannel: 'stable'
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
