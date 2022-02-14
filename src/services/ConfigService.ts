import { ClientSettings } from '../Models/ClientSettings'
import buildPath, { ConfigPath } from '../Models/ConfigPathes'
import FileOperationsService from './FileOperationsService'

const path = buildPath(ConfigPath.CONFIG)

// Refactor 2.3.0
function getSettings(): ClientSettings {
    let settings = {
        server: server(),
        baseUrl: baseUrl(),
        mailServer: mailServer(),
        ownServer: ownServer(),
        windowOpenNewTab: windowOpenNewTab(),
        windowsAboveApp: windowsAboveApp(),
        selectedUserAgentType: selectedUserAgentType(),
        selectedUserAgentValue: selectedUserAgentValue(),
        maximizeOnStart: maximizeOnStart(),
        hideTopPanelInFullScreen: hideTopPanelInFullScreen(),
        enableSpeed: enableSpeed(),
        fightNotificationsSystem: fightNotificationsSystem(),
        fightNotificationsIngame: fightNotificationsIngame(),
        battlegroundNotificationsSystem: battlegroundNotificationsSystem(),
        battlegroundNotificationsIngame: battlegroundNotificationsIngame(),
        messageNotificationsSystem: messageNotificationsSystem(),
        messageNotificationsIngame: messageNotificationsIngame(),
        mailNotificationsSystem: mailNotificationsSystem(),
        mailNotificationsIngame: mailNotificationsIngame(),
        updateChannel: updateChannel()
    }
    return settings
}

function server(): string {
    return readData('server')
}

function baseUrl(): string {
    const server = ownServer()
    if(server.length != 0) {
        return server
    }
    return `https://${readData('server')}.dwar${mailServer() ? '.mail' : ''}.ru`
}

function mailServer(): boolean {
    let settings = readData('settings')
    if(settings) {
        settings = JSON.parse(settings)
        return settings.mailServer ?? false
    }
    return false
}

function ownServer(): string {
    let settings = readData('settings')
    if(settings) {
        settings = JSON.parse(settings)
        return settings.ownServer ?? ''
    }
    return ''
}

function windowOpenNewTab(): boolean {
    let settings = readData('settings')
    if(settings) {
        settings = JSON.parse(settings)
        return settings.windowOpenNewTab ?? false
    }
    return false
}

function windowsAboveApp(): boolean {
    let settings = readData('settings')
    if(settings) {
        settings = JSON.parse(settings)
        return settings.windowsAboveApp ?? false
    }
    return false
}

function selectedUserAgentType(): string {
    let settings = readData('settings')
    const defaultUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
    if(settings) {
        settings = JSON.parse(settings)
        return settings.selectedUserAgentType ?? defaultUA
    }
    return defaultUA
}

function selectedUserAgentValue(): string {
    let settings = readData('settings')
    const defaultUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
    if(settings) {
        settings = JSON.parse(settings)
        return settings.selectedUserAgentValue ?? defaultUA
    }
    return defaultUA
}

function maximizeOnStart(): boolean {
    let settings = readData('settings')
    if(settings) {
        settings = JSON.parse(settings)
        return settings.maximizeOnStart ?? false
    }
    return false
}

function hideTopPanelInFullScreen(): boolean {
    let settings = readData('settings')
    if(settings) {
        settings = JSON.parse(settings)
        return settings.hideTopPanelInFullScreen ?? false
    }
    return false
}

function enableSpeed(): boolean {
    let settings = readData('settings')
    if(settings) {
        settings = JSON.parse(settings)
        return settings.enableSpeed ?? false
    }
    return false
}

// Notifications

function fightNotificationsSystem(): boolean {
    let settings = readData('settings')
    if(settings) {
        settings = JSON.parse(settings)
        return settings.fightNotificationsSystem ?? false
    }
    return false
}

function fightNotificationsIngame(): boolean {
    let settings = readData('settings')
    if(settings) {
        settings = JSON.parse(settings)
        return settings.fightNotificationsIngame ?? false
    }
    return false
}

function battlegroundNotificationsSystem(): boolean {
    let settings = readData('settings')
    if(settings) {
        settings = JSON.parse(settings)
        return settings.battlegroundNotificationsSystem ?? false
    }
    return false
}

function battlegroundNotificationsIngame(): boolean {
    let settings = readData('settings')
    if(settings) {
        settings = JSON.parse(settings)
        return settings.battlegroundNotificationsIngame ?? false
    }
    return false
}

function messageNotificationsSystem(): boolean {
    let settings = readData('settings')
    if(settings) {
        settings = JSON.parse(settings)
        return settings.messageNotificationsSystem ?? false
    }
    return false
}

function messageNotificationsIngame(): boolean {
    let settings = readData('settings')
    if(settings) {
        settings = JSON.parse(settings)
        return settings.messageNotificationsIngame ?? false
    }
    return false
}

function mailNotificationsSystem(): boolean {
    let settings = readData('settings')
    if(settings) {
        settings = JSON.parse(settings)
        return settings.mailNotificationsSystem ?? false
    }
    return false
}

function mailNotificationsIngame(): boolean {
    let settings = readData('settings')
    if(settings) {
        settings = JSON.parse(settings)
        return settings.mailNotificationsIngame ?? false
    }
    return false
}

function updateChannel(): string {
    let settings = readData('settings')
    if(settings) {
        settings = JSON.parse(settings)
        return settings.updateChannel ?? 'stable'
    }
    return 'stable'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function writeData(key: string, value: any): void {
    const contents = FileOperationsService.parseData(path) as any
    contents[key] = value
    Object.keys(contents).forEach((key) => {
        if(contents[key] === null) {
            delete contents[key]
        }
    })
    FileOperationsService.writeData(path, JSON.stringify(contents))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function readData(key: string): any {
    const contents = FileOperationsService.parseData(path) as any
    return contents[key]
}

export default {
    getSettings,
    writeData,
}
