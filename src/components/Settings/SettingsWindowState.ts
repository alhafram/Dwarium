export interface SettingsWindowState {
    userAgents?: {
        id: string
        value: string
    }[]
    selectedUserAgentType: UserAgentType
    selectedUserAgentValue: string
    windowOpenNewTab: boolean
    windowsAboveApp: boolean
    maximizeOnStart: boolean
    hideTopPanelInFullScreen: boolean
    animationSpeedType: string
    mailServer: boolean
    userAgentTextFieldActive?: boolean
    screenshotsFolderPath: string
    ownServer: string
    fightNotificationsSystem: boolean
    fightNotificationsIngame: boolean
    battlegroundNotificationsSystem: boolean
    battlegroundNotificationsIngame: boolean
    messageNotificationsSystem: boolean
    messageNotificationsIngame: boolean
    mailNotificationsSystem: boolean
    mailNotificationsIngame: boolean
    updateChannel: string
    needToRestoreUrls: boolean
}

export enum UserAgentType {
    DEFAULT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
    WIN10_FIREFOX = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0',
    WIN10_OPERA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36 OPR/82.0.4227.33',
    MAC_CHROME = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
    MAC_SAFARI = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Safari/605.1.15',
    MAC_FIREFOX = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:95.0) Gecko/20100101 Firefox/95.0',
    CLIENT_V4 = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Client/4.0.53/AuthCheck Safari/537.36',
    OWN = ''
}

export function getTitle(type: UserAgentType): string {
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
