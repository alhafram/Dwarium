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
    },
    // Plugin shortcuts
    openFoodShortcutInput(): HTMLInputElement {
        return document.getElementById('openFoodShortcutInput') as HTMLInputElement
    },
    openNotesShortcutInput(): HTMLInputElement {
        return document.getElementById('openNotesShortcutInput') as HTMLInputElement
    },
    openDressingRoomShortcutInput(): HTMLInputElement {
        return document.getElementById('openDressingRoomShortcutInput') as HTMLInputElement
    },
    openBeltPotionRoomShortcutInput(): HTMLInputElement {
        return document.getElementById('openBeltPotionRoomShortcutInput') as HTMLInputElement
    },
    openChatLogShortcutInput(): HTMLInputElement {
        return document.getElementById('openChatLogShortcutInput') as HTMLInputElement
    },
    openChatSettingsShortcutInput(): HTMLInputElement {
        return document.getElementById('openChatSettingsShortcutInput') as HTMLInputElement
    },
    openNotificationsShortcutInput(): HTMLInputElement {
        return document.getElementById('openNotificationsShortcutInput') as HTMLInputElement
    },
    openEffectSetsShortcutInput(): HTMLInputElement {
        return document.getElementById('openEffectSetsShortcutInput') as HTMLInputElement
    },
    openExpiringItemsSettingsShortcutInput(): HTMLInputElement {
        return document.getElementById('openExpiringItemsSettingsShortcutInput') as HTMLInputElement
    },
    makeScreenshotShortcutInput(): HTMLInputElement {
        return document.getElementById('makeScreenshotShortcutInput') as HTMLInputElement
    },
    openSettingsShortcutInput(): HTMLInputElement {
        return document.getElementById('openSettingsShortcutInput') as HTMLInputElement
    }
}
