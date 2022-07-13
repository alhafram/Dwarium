import { ClientSettings } from '../Models/ClientSettings'
import { buildPath, ConfigPath } from '../Models/ConfigPathes'
import FileOperationsService from './FileOperationsService'

const path = buildPath(ConfigPath.CONFIG)

function getSettings(): ClientSettings {
    const settings = {
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
        animationSpeedType: animationSpeedType(),
        fightNotificationsSystem: fightNotificationsSystem(),
        fightNotificationsIngame: fightNotificationsIngame(),
        battlegroundNotificationsSystem: battlegroundNotificationsSystem(),
        battlegroundNotificationsIngame: battlegroundNotificationsIngame(),
        messageNotificationsSystem: messageNotificationsSystem(),
        messageNotificationsIngame: messageNotificationsIngame(),
        mailNotificationsSystem: mailNotificationsSystem(),
        mailNotificationsIngame: mailNotificationsIngame(),
        expiringItemsNotificationsSystem: expiringItemsNotificationsSystem(),
        expiringItemsNotificationsIngame: expiringItemsNotificationsIngame(),
        resourceFarmingFinishedNotificationSystem: resourceFarmingFinishedNotificationSystem(),
        resourceFarmingFinishedNotificationIngame: resourceFarmingFinishedNotificationIngame(),
        updateChannel: updateChannel(),
        needToRestoreUrls: needToRestoreUrls(),
        restoreUrls: restoreUrls()
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

function animationSpeedType(): string {
    let settings = readData('settings')
    if(settings) {
        settings = JSON.parse(settings)
        return settings.animationSpeedType ?? 'gameSpeed'
    }
    return 'gameSpeed'
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

function expiringItemsNotificationsSystem(): boolean {
    let settings = readData('settings')
    if(settings) {
        settings = JSON.parse(settings)
        return settings.expiringItemsNotificationsSystem ?? false
    }
    return false
}

function expiringItemsNotificationsIngame(): boolean {
    let settings = readData('settings')
    if(settings) {
        settings = JSON.parse(settings)
        return settings.expiringItemsNotificationsIngame ?? false
    }
    return false
}

function resourceFarmingFinishedNotificationSystem(): boolean {
    let settings = readData('settings')
    if(settings) {
        settings = JSON.parse(settings)
        return settings.resourceFarmingFinishedNotificationSystem ?? false
    }
    return false
}

function resourceFarmingFinishedNotificationIngame(): boolean {
    let settings = readData('settings')
    if(settings) {
        settings = JSON.parse(settings)
        return settings.resourceFarmingFinishedNotificationIngame ?? false
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

function needToRestoreUrls(): boolean {
    let settings = readData('settings')
    if(settings) {
        settings = JSON.parse(settings)
        return settings.needToRestoreUrls ?? false
    }
    return false
}

function restoreUrls(): string[] {
    let settings = readData('settings')
    if(settings) {
        settings = JSON.parse(settings)
        return settings.restoreUrls ?? []
    }
    return []
}

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

function readData(key: string): any {
    const contents = FileOperationsService.parseData(path) as any
    return contents[key]
}

export default {
    getSettings,
    writeData
}
