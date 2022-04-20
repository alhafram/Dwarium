import { shell } from 'electron'
import { SettingsWindowActions } from './Actions'
import { Elements } from './Elements'
import { dispatch } from './preload'
import { SettingsWindowState, UserAgentType } from './SettingsWindowState'

let state: SettingsWindowState

export function render(initialState: SettingsWindowState) {
    state = initialState
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
    const userAgentTextInputElement = Elements.userAgentTextInput()
    userAgentTextInputElement.value = initialState.selectedUserAgentValue
    userAgentTextInputElement.disabled = !initialState.userAgentTextFieldActive

    Elements.windowsAboveAppInput().checked = initialState.windowsAboveApp
    Elements.windowOpenNewTabInput().checked = initialState.windowOpenNewTab
    Elements.maximizeOnStartInput().checked = initialState.maximizeOnStart
    Elements.hideTopPanelInFullScreenInput().checked = initialState.hideTopPanelInFullScreen

    Elements.animationSpeedButtons().forEach((animationSpeedButton) => {
        if(animationSpeedButton.id == initialState.animationSpeedType) {
            animationSpeedButton.classList.replace('settingsSpeedButton', 'settingsSpeedButtonSelected')
        } else {
            animationSpeedButton.classList.replace('settingsSpeedButtonSelected', 'settingsSpeedButton')
        }
    })
    Elements.mailServerInput().checked = initialState.mailServer

    Elements.screenshotsFolderPathTextarea().value = initialState.screenshotsFolderPath
    Elements.ownServerInput().value = initialState.ownServer

    Elements.updateChannelButtons().forEach((updateChannelButton) => {
        if(updateChannelButton.id == initialState.updateChannel) {
            updateChannelButton.classList.replace('settingsSpeedButton', 'settingsSpeedButtonSelected')
        } else {
            updateChannelButton.classList.replace('settingsSpeedButtonSelected', 'settingsSpeedButton')
        }
    })
    
    Elements.needToRestoreUrlsInput().checked = initialState.needToRestoreUrls
}

export function setupView() {
    Elements.userAgentsSelect().onchange = () => {
        dispatch(SettingsWindowActions.CHANGE_USER_AGENT)
    }
    Elements.saveButton().onclick = () => {
        dispatch(SettingsWindowActions.SAVE_SETTINGS)
    }
    Elements.windowOpenNewTabInput().onchange = () => {
        dispatch(SettingsWindowActions.CHANGE_WINDOW_OPEN_NEW_TAB)
    }
    Elements.windowsAboveAppInput().onchange = () => {
        dispatch(SettingsWindowActions.CHANGE_WINDOWS_ABOVE_APP)
    }
    Elements.maximizeOnStartInput().onchange = () => {
        dispatch(SettingsWindowActions.CHANGE_MAXIMIZE_ON_START)
    }
    Elements.hideTopPanelInFullScreenInput().onchange = () => {
        dispatch(SettingsWindowActions.CHANGE_HIDE_TOP_PANEL_IN_FULL_SCREEN)
    }
    Elements.animationSpeedButtons().forEach((animationSpeedButton) => {
        animationSpeedButton.onclick = () => {
            dispatch(SettingsWindowActions.CHANGE_ANIMATION_SPEED_TYPE, animationSpeedButton.id)
        }
    })
    Elements.screenshotsFolderButton().onclick = function() {
        shell.openPath(state.screenshotsFolderPath)
    }
    Elements.mailServerInput().onclick = function() {
        dispatch(SettingsWindowActions.CHANGE_MAIL_SERVER)
    }
    Elements.updateChannelButtons().forEach((updateChannelButton) => {
        updateChannelButton.onclick = () => {
            dispatch(SettingsWindowActions.CHANGE_UPDATE_CHANNEL, updateChannelButton.id)
        }
    })
    Elements.needToRestoreUrlsInput().onchange = () => {
        dispatch(SettingsWindowActions.CHANGE_NEED_TO_RESTORE_URLS)
    }
}
