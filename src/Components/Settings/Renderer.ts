import { shell } from 'electron'
import ShortcutService from '../../Services/ShortcutService'
import { SettingsWindowActions } from './Actions'
import { Elements } from './Elements'
import { dispatch } from './preload'
import { SettingsWindowState, UserAgentType } from './SettingsWindowState'
import '../Common/Utils'

let state: SettingsWindowState

export async function render(initialState: SettingsWindowState) {
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
    setupShortcuts()
}

function getShortcutInputs(): HTMLInputElement[] {
    return [
        Elements.openHuntShortcutInput(),
        Elements.openBackpackShortcutInput(),
        Elements.openLocationShortcutInput(),

        Elements.openDevToolsShortcutInput(),
        Elements.prevTabShortcutInput(),
        Elements.nextTabShortcutInput(),
        Elements.newTabShortcutInput(),
        Elements.reloadShortcutInput(),
        Elements.closeTabShortcutInput(),
        Elements.clearCacheShortcutInput(),
        Elements.copyWindowUrlShortcutInput(),

        Elements.openFoodShortcutInput(),
        Elements.openNotesShortcutInput(),
        Elements.openDressingRoomShortcutInput(),
        Elements.openBeltPotionRoomShortcutInput(),
        Elements.openChatLogShortcutInput(),
        Elements.openChatSettingsShortcutInput(),
        Elements.openNotificationsShortcutInput(),
        Elements.openEffectSetsShortcutInput(),
        Elements.openExpiringItemsSettingsShortcutInput(),
        Elements.makeScreenshotShortcutInput(),
        Elements.openSettingsShortcutInput(),
        Elements.hideShowChatShortcutInput(),
        Elements.fullscreenShortcutInput(),

        Elements.bowSkill1ShortcutInput(),
        Elements.bowSkill2ShortcutInput(),
        Elements.bowSkill3ShortcutInput(),
        Elements.bowSkill4ShortcutInput(),
        Elements.bowSkill5ShortcutInput(),
        Elements.bowSkill6ShortcutInput(),
        Elements.bowSkill7ShortcutInput(),
        Elements.bowSkill8ShortcutInput(),
        Elements.bowSkill9ShortcutInput(),
        Elements.bowSkill10ShortcutInput(),
        Elements.bowSkill11ShortcutInput(),
        Elements.bowSkill12ShortcutInput(),
        Elements.bowSkill13ShortcutInput(),
        Elements.bowSkill14ShortcutInput(),
        Elements.bowSkill15ShortcutInput()
    ]
}

function setupShortcuts() {
    Elements.openHuntShortcutInput().value = state.shortcuts.openHunt
    Elements.openBackpackShortcutInput().value = state.shortcuts.openBackpack
    Elements.openLocationShortcutInput().value = state.shortcuts.openLocation

    Elements.openDevToolsShortcutInput().value = state.shortcuts.openDevTools
    Elements.prevTabShortcutInput().value = state.shortcuts.prevTab
    Elements.nextTabShortcutInput().value = state.shortcuts.nextTab
    Elements.newTabShortcutInput().value = state.shortcuts.newTab
    Elements.reloadShortcutInput().value = state.shortcuts.reload
    Elements.closeTabShortcutInput().value = state.shortcuts.closeTab
    Elements.clearCacheShortcutInput().value = state.shortcuts.clearCache
    Elements.copyWindowUrlShortcutInput().value = state.shortcuts.copyWindowUrl

    Elements.openFoodShortcutInput().value = state.shortcuts.openFood
    Elements.openNotesShortcutInput().value = state.shortcuts.openNotes
    Elements.openDressingRoomShortcutInput().value = state.shortcuts.openDressingRoom
    Elements.openBeltPotionRoomShortcutInput().value = state.shortcuts.openBeltPotionRoom
    Elements.openChatLogShortcutInput().value = state.shortcuts.openChatLog
    Elements.openChatSettingsShortcutInput().value = state.shortcuts.openChatSettings
    Elements.openNotificationsShortcutInput().value = state.shortcuts.openNotifications
    Elements.openEffectSetsShortcutInput().value = state.shortcuts.openEffectSets
    Elements.openExpiringItemsSettingsShortcutInput().value = state.shortcuts.openExpiringItems
    Elements.makeScreenshotShortcutInput().value = state.shortcuts.makeScreenshot
    Elements.openSettingsShortcutInput().value = state.shortcuts.openSettings
    Elements.hideShowChatShortcutInput().value = state.shortcuts.hideShowChat
    Elements.fullscreenShortcutInput().value = state.shortcuts.fullscreen

    Elements.bowSkill1ShortcutInput().value = state.shortcuts.bowSkill1
    Elements.bowSkill2ShortcutInput().value = state.shortcuts.bowSkill2
    Elements.bowSkill3ShortcutInput().value = state.shortcuts.bowSkill3
    Elements.bowSkill4ShortcutInput().value = state.shortcuts.bowSkill4
    Elements.bowSkill5ShortcutInput().value = state.shortcuts.bowSkill5
    Elements.bowSkill6ShortcutInput().value = state.shortcuts.bowSkill6
    Elements.bowSkill7ShortcutInput().value = state.shortcuts.bowSkill7
    Elements.bowSkill8ShortcutInput().value = state.shortcuts.bowSkill8
    Elements.bowSkill9ShortcutInput().value = state.shortcuts.bowSkill9
    Elements.bowSkill10ShortcutInput().value = state.shortcuts.bowSkill10
    Elements.bowSkill11ShortcutInput().value = state.shortcuts.bowSkill11
    Elements.bowSkill12ShortcutInput().value = state.shortcuts.bowSkill12
    Elements.bowSkill13ShortcutInput().value = state.shortcuts.bowSkill13
    Elements.bowSkill14ShortcutInput().value = state.shortcuts.bowSkill14
    Elements.bowSkill15ShortcutInput().value = state.shortcuts.bowSkill15

    const inputs = getShortcutInputs()
    inputs.forEach((element) => {
        element.style.borderColor = ''
    })
    inputs.forEach((element) => {
        const excludedElementInputs = inputs.removeItem(element)
        for(const excludedElement of excludedElementInputs) {
            if(excludedElement.value == element.value && excludedElement.value != '') {
                element.style.borderColor = '#FF0000'
                excludedElement.style.borderColor = '#FF0000'
            }
        }
    })
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
    Elements.resetShortcutsButton().onclick = function() {
        ShortcutService.resetShortcuts()
        setTimeout(() => {
            document.location.reload()
        }, 500)
    }

    const inputs = getShortcutInputs()
    inputs.forEach((element) => {
        element.onfocus = function() {
            element.style.borderColor = '#000'
        }
        element.onblur = function() {
            element.style.borderColor = ''
            dispatch(SettingsWindowActions.SAVE_SHORTCUTS)
        }
        element.onkeyup = function(event) {
            if(ShortcutService.isExcludedKey(event)) {
                return
            }
            if(ShortcutService.isClearKey(event)) {
                element.value = ''
            } else {
                element.value = ShortcutService.parseCombination(event)
            }
            element.blur()
        }
        element.onkeydown = function() {
            return false
        }
    })
}
