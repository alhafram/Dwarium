export const Elements = {
    windowsAboveAppInput(): HTMLInputElement {
        return document.getElementById('windowsAboveAppInput') as HTMLInputElement
    },
    windowOpenNewTabInput(): HTMLInputElement {
        return document.getElementById('windowOpenNewTabInput') as HTMLInputElement
    },
    maximizeOnStartInput(): HTMLInputElement {
        return document.getElementById('maximizeOnStartInput') as HTMLInputElement
    },
    userAgentsSelect(): HTMLSelectElement {
        return document.getElementById('userAgentsSelect') as HTMLSelectElement
    },
    saveButton(): HTMLButtonElement {
        return document.getElementById('saveButton') as HTMLButtonElement
    },
    userAgentTextInput(): HTMLInputElement {
        return document.getElementById('userAgentTextInput') as HTMLInputElement
    },
    hideTopPanelInFullScreenInput(): HTMLInputElement {
        return document.getElementById('hideTopPanelInFullScreenInput') as HTMLInputElement
    },
    animationSpeedButtons(): HTMLButtonElement[] {
        return document.getElementsByName('animationSpeedButton') as unknown as HTMLButtonElement[]
    },
    screenshotsFolderPathTextarea(): HTMLTextAreaElement {
        return document.getElementById('screenshotsFolderPathTextarea') as HTMLTextAreaElement
    },
    screenshotsFolderButton(): HTMLButtonElement {
        return document.getElementById('screenshotsFolderButton') as HTMLButtonElement
    },
    mailServerInput(): HTMLInputElement {
        return document.getElementById('mailServerInput') as HTMLInputElement
    },
    ownServerInput(): HTMLInputElement {
        return document.getElementById('ownServerInput') as HTMLInputElement
    },
    updateChannelButtons(): HTMLButtonElement[] {
        return document.getElementsByName('updateChannelButton') as unknown as HTMLButtonElement[]
    },
    needToRestoreUrlsInput(): HTMLInputElement {
        return document.getElementById('needToRestoreUrlsInput') as HTMLInputElement
    }
}
