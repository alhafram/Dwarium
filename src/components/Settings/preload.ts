import { shell } from '@electron/remote'
import { Elements } from './Elements'
import { SettingsWindowActions } from './Actions'
import reduce from './Reducer'
import { SettingsWindowState, UserAgentType } from './SettingsWindowState'
import setupMode from '../../services/DarkModeHandler'

function getTitle(type: UserAgentType): string {
    switch (type) {
        case UserAgentType.DEFAULT:
            return 'Windows 10 - Chrome'
        case UserAgentType.WIN10_FIREFOX:
            return 'Windows 10 - Firefox'
        case UserAgentType.WIN10_OPERA:
            return 'Windows 10 - Opera'
        case UserAgentType.MAC_CHROME:
            return 'MacOS - Chrome'
        case UserAgentType.MAC_SAFARI:
            return 'MacOS - Safari'
        case UserAgentType.MAC_FIREFOX:
            return 'MacOS - Firefox'
        case UserAgentType.CLIENT_V4:
            return 'Client - v4'
        case UserAgentType.OWN:
            return 'Ввести вручную'
    }
}

function setupListeners() {
    Elements.userAgentsSelect().onchange = () => {
        dispatch(SettingsWindowActions.CHANGE_USER_AGENT)
    }
    Elements.save().onclick = () => {
        dispatch(SettingsWindowActions.SAVE_SETTINGS)
    }
    Elements.windowOpenNewTab().onchange = () => {
        dispatch(SettingsWindowActions.CHANGE_WINDOW_OPEN_NEW_TAB)
    }
    Elements.windowsAboveAppElement().onchange = () => {
        dispatch(SettingsWindowActions.CHANGE_WINDOWS_ABOVE_APP)
    }
    Elements.maximizeOnStart().onchange = () => {
        dispatch(SettingsWindowActions.CHANGE_MAXIMIZE_ON_START)
    }
    Elements.hideTopPanelInFullScreenBox().onchange = () => {
        dispatch(SettingsWindowActions.CHANGE_HIDE_TOP_PANEL_IN_FULL_SCREEN)
    }
    Elements.animationSpeedTypes().forEach((speedType) => {
        speedType.onclick = () => {
            dispatch(SettingsWindowActions.CHANGE_ANIMATION_SPEED_TYPE, speedType.id)
        }
    })
    Elements.screenshotsFolderBox().onclick = function() {
        shell.openPath(initialState.screenshotsFolderPath)
    }
    Elements.mailServerBox().onclick = function() {
        dispatch(SettingsWindowActions.CHANGE_MAIL_SERVER)
    }
    Elements.updateChannelBoxes().forEach((updateChannel) => {
        updateChannel.onclick = () => {
            dispatch(SettingsWindowActions.CHANGE_UPDATE_CHANNEL, updateChannel.id)
        }
    })
}

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

function dispatch(action: SettingsWindowActions, data?: unknown): void {
    initialState = reduce(initialState, action, data)
    render()
}

function render(): void {
    function createUserAgentOption(agent: { id: string; value: string }): HTMLOptionElement | null {
        if(!agent.value) {
            return null
        }
        const element = document.createElement('option')
        element.value = agent.id
        element.text = agent.value
        return element
    }

    const parent = Elements.userAgentsSelect()
    if(parent.childElementCount == 0) {
        initialState.userAgents?.forEach((userAgent) => {
            const option = createUserAgentOption(userAgent)
            if(option) {
                if(UserAgentType[option.value as keyof typeof UserAgentType] == initialState.selectedUserAgentType) {
                    option.selected = true
                }
                parent.add(option)
            }
        })
    }
    const userAgentTextInputElement = Elements.userAgentTextValue()
    userAgentTextInputElement.value = initialState.selectedUserAgentValue
    userAgentTextInputElement.disabled = !initialState.userAgentTextFieldActive

    Elements.windowsAboveAppElement().checked = initialState.windowsAboveApp
    Elements.windowOpenNewTab().checked = initialState.windowOpenNewTab
    Elements.maximizeOnStart().checked = initialState.maximizeOnStart
    Elements.hideTopPanelInFullScreenBox().checked = initialState.hideTopPanelInFullScreen

    Elements.animationSpeedTypes().forEach((speedType) => {
        if(speedType.id == initialState.animationSpeedType) {
            speedType.classList.replace('settingsSpeedButton', 'settingsSpeedButtonSelected')
        } else {
            speedType.classList.replace('settingsSpeedButtonSelected', 'settingsSpeedButton')
        }
    })
    Elements.mailServerBox().checked = initialState.mailServer

    Elements.screenshotsFolderPathBox().value = initialState.screenshotsFolderPath
    Elements.ownServerBox().value = initialState.ownServer

    Elements.updateChannelBoxes().forEach((channel) => {
        if(channel.id == initialState.updateChannel) {
            channel.classList.replace('settingsSpeedButton', 'settingsSpeedButtonSelected')
        } else {
            channel.classList.replace('settingsSpeedButtonSelected', 'settingsSpeedButton')
        }
    })
}

document.addEventListener('DOMContentLoaded', async() => {
    dispatch(SettingsWindowActions.LOAD_SETTINGS)
    setupListeners()
    setupMode()
})
