interface SettingsWindowState {
    userAgents?: {
        id: string,
        value: string
    }[]
    selectedUserAgentType: UserAgentType,
    selectedUserAgentValue: string,
    windowOpenNewTab: boolean,
    windowsAboveApp: boolean,
    maximizeOnStart: boolean,
    hideTopPanelInFullScreen: boolean,
    userAgentTextFieldActive?: boolean,
    screenshotsFolderPath: string
}

enum UserAgentType {
    DEFAULT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
    WIN10_FIREFOX = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0',
    WIN10_OPERA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36 OPR/82.0.4227.33',
    MAC_CHROME = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
    MAC_SAFARI = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Safari/605.1.15',
    MAC_FIREFOX = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:95.0) Gecko/20100101 Firefox/95.0',
    CLIENT_V4 = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Client/4.0.53/AuthCheck Safari/537.36',
    OWN = ''
}

enum SettingsWindowActions {
    LOAD_SETTINGS,
    SAVE_SETTINGS,
    CHANGE_USER_AGENT,
    CHANGE_WINDOW_OPEN_NEW_TAB,
    CHANGE_WINDOWS_ABOVE_APP,
    CHANGE_MAXIMIZE_ON_START,
    CHANGE_HIDE_TOP_PANEL_IN_FULL_SCREEN
}

const Elements = {
    windowsAboveAppElement(): HTMLInputElement {
        return document.getElementById('windowsAboveApp') as HTMLInputElement
    },
    windowOpenNewTab(): HTMLInputElement {
        return document.getElementById('windowOpenNewTab') as HTMLInputElement
    },
    maximizeOnStart(): HTMLInputElement {
        return document.getElementById('maximizeOnStart') as HTMLInputElement
    },
    userAgentsSelect(): HTMLSelectElement {
        return document.getElementById('userAgents') as HTMLSelectElement
    },
    save(): HTMLButtonElement {
        return document.getElementById('save') as HTMLButtonElement
    },
    userAgentTextValue(): HTMLInputElement {
        return document.getElementById('userAgentText') as HTMLInputElement
    },
    hideTopPanelInFullScreenBox(): HTMLInputElement {
        return document.getElementById('hideTopPanelInFullScreen') as HTMLInputElement
    },
    screenshotsFolderPathBox(): HTMLTextAreaElement {
        return document.getElementById('screenshotsFolderPath') as HTMLTextAreaElement
    },
    screenshotsFolderBox(): HTMLButtonElement {
        return document.getElementById('screenshotsFolder') as HTMLButtonElement
    }
}

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
    Elements.screenshotsFolderBox().onclick = function() {
        window.settingsAPI.openScreenshotsFolder(initialState.screenshotsFolderPath)
    }
}

let initialState: SettingsWindowState = {
    userAgents: Object.keys(UserAgentType).map(key => {
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
    userAgentTextFieldActive: false,
    screenshotsFolderPath: ''
}

function reduce(state: SettingsWindowState = initialState, action: SettingsWindowActions): SettingsWindowState {
    switch(action) {
        case SettingsWindowActions.LOAD_SETTINGS:
            let loadedSettings = window.settingsAPI.loadSettings()
            if(Object.keys(loadedSettings).length == 0) {
                return state
            } else {
                return {
                    ...state,
                    selectedUserAgentType: loadedSettings.selectedUserAgentType,
                    selectedUserAgentValue: loadedSettings.selectedUserAgentValue,
                    userAgentTextFieldActive: loadedSettings.selectedUserAgentType == UserAgentType.OWN,
                    windowOpenNewTab: loadedSettings.windowOpenNewTab,
                    windowsAboveApp: loadedSettings.windowsAboveApp,
                    hideTopPanelInFullScreen: loadedSettings.hideTopPanelInFullScreen,
                    maximizeOnStart: loadedSettings.maximizeOnStart,
                    screenshotsFolderPath: window.settingsAPI.screenshotsFolder()
                }
            }
        case SettingsWindowActions.SAVE_SETTINGS:
            let savedSettings = Object.assign({}, state);
            delete savedSettings.userAgents
            delete savedSettings.userAgentTextFieldActive
            savedSettings.selectedUserAgentValue = Elements.userAgentTextValue().value
            if(savedSettings.selectedUserAgentValue.length == 0) {
                alert('User-Agent не может быть пустым')
                return state
            }
            window.settingsAPI.saveSettings(savedSettings)
            if(confirm('Для того что бы настройки вступили в силу, необходимо перезапустить клиент!')) {
                window.settingsAPI.restart()
            }
            return {
                ...state,
                selectedUserAgentValue: savedSettings.selectedUserAgentValue
            }
        case SettingsWindowActions.CHANGE_USER_AGENT:
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
        case SettingsWindowActions.CHANGE_WINDOW_OPEN_NEW_TAB:
            return {
                ...state,
                windowOpenNewTab: Elements.windowOpenNewTab().checked
            }
        case SettingsWindowActions.CHANGE_WINDOWS_ABOVE_APP:
            return {
                ...state,
                windowsAboveApp: Elements.windowsAboveAppElement().checked
            }
        case SettingsWindowActions.CHANGE_MAXIMIZE_ON_START:
            return {
                ...state,
                maximizeOnStart: Elements.maximizeOnStart().checked
            } 
        case SettingsWindowActions.CHANGE_HIDE_TOP_PANEL_IN_FULL_SCREEN:
            return {
                ...state,
                hideTopPanelInFullScreen: Elements.hideTopPanelInFullScreenBox().checked
            } 
    }
}

function dispatch(action: SettingsWindowActions): void {
    initialState = reduce(initialState, action)
    render()
}

function render(): void {
    function createUserAgentOption(agent: { id: string, value: string }): HTMLOptionElement | null {
        if(!agent.value) {
            return null
        }
        let element = document.createElement('option')
        element.value = agent.id
        element.text = agent.value
        return element
    }

    let parent = Elements.userAgentsSelect()
    if(parent.childElementCount == 0) {
        initialState.userAgents?.forEach(userAgent => {
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

    Elements.screenshotsFolderPathBox().value = initialState.screenshotsFolderPath
}

document.addEventListener('DOMContentLoaded', async () => {
    dispatch(SettingsWindowActions.LOAD_SETTINGS)
    setupListeners()
})