export const Elements = {
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
    animationSpeedTypes(): HTMLButtonElement[] {
        return document.getElementsByName('animationSpeed') as unknown as HTMLButtonElement[]
    },
    screenshotsFolderPathBox(): HTMLTextAreaElement {
        return document.getElementById('screenshotsFolderPath') as HTMLTextAreaElement
    },
    screenshotsFolderBox(): HTMLButtonElement {
        return document.getElementById('screenshotsFolder') as HTMLButtonElement
    },
    mailServerBox(): HTMLInputElement {
        return document.getElementById('mailServer') as HTMLInputElement
    },
    ownServerBox(): HTMLInputElement {
        return document.getElementById('ownServer') as HTMLInputElement
    },
    updateChannelBoxes(): HTMLButtonElement[] {
        return document.getElementsByName('updateChannel') as unknown as HTMLButtonElement[]
    }
}
