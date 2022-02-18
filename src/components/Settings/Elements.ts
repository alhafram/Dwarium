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
    enableSpeedBox(): HTMLInputElement {
        return document.getElementById('enableSpeed') as HTMLInputElement
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
    fightNotificationsSystemBox(): HTMLInputElement {
        return document.getElementById('fightNotificationsSystem') as HTMLInputElement
    },
    fightNotificationsIngameBox(): HTMLInputElement {
        return document.getElementById('fightNotificationsIngame') as HTMLInputElement
    },
    battlegroundNotificationsSystemBox(): HTMLInputElement {
        return document.getElementById('battlegroundNotificationsSystem') as HTMLInputElement
    },
    battlegroundNotificationsIngameBox(): HTMLInputElement {
        return document.getElementById('battlegroundNotificationsIngame') as HTMLInputElement
    },
    messageNotificationsSystemBox(): HTMLInputElement {
        return document.getElementById('messageNotificationsSystem') as HTMLInputElement
    },
    messageNotificationsIngameBox(): HTMLInputElement {
        return document.getElementById('messageNotificationsIngame') as HTMLInputElement
    },
    mailNotificationsSystemBox(): HTMLInputElement {
        return document.getElementById('mailNotificationsSystem') as HTMLInputElement
    },
    mailNotificationsIngameBox(): HTMLInputElement {
        return document.getElementById('mailNotificationsIngame') as HTMLInputElement
    },
    updateChannelBoxes(): HTMLInputElement[] {
        return Array.from(document.getElementsByName('updateChannel')) as HTMLInputElement[]
    }
}
