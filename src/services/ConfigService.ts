const { app } = process.type === 'browser' ? require('electron') : require('@electron/remote')
import fs from 'fs'
import path from 'path'
import { FoodSettings } from '../Models/FoodSettings'
const configPath = path.join(app.getPath('userData'), 'config.json')

function server(): string {
    return readData('server')
}

function baseUrl(): string {
    const server = ownServer()
    if(server.length != 0) {
        return server
    }
    return `https://${readData('server')}.dwar${mailServer()}.ru`
}

function mailServer(): string {
    let settings = readData('settings')
    if(settings) {
        settings = JSON.parse(settings)
        const isMailServer = settings.mailServer ?? false
        return isMailServer ? '.mail' : ''
    }
    return ''
}

function ownServer(): string {
    let settings = readData('settings')
    if(settings) {
        settings = JSON.parse(settings)
        return settings.ownServer ?? ''
    }
    return ''
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function loadSettings(): any {
    return readData('settings')
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

function userAgent(): string {
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

function hpFood(): FoodSettings | null {
    return readData('hpFood') ?? null
}

function mpFood(): FoodSettings | null {
    return readData('mpFood') ?? null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sets(): any[] {
    const contents = parseData(configPath)
    const keys = Object.keys(contents).filter((key) => key.startsWith('set_'))
    return keys.map((key) => JSON.parse(contents[key]))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function beltSets(): any[] {
    const contents = parseData(configPath)
    const keys = Object.keys(contents).filter((key) => key.startsWith('belt_set_'))
    return keys.map((key) => JSON.parse(contents[key]))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function notes(): any[] {
    const contents = parseData(configPath)
    const keys = Object.keys(contents).filter((key) => key.startsWith('note_'))
    return keys.map((key) => JSON.parse(contents[key]))
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
    const contents = parseData(configPath)
    contents[key] = value
    Object.keys(contents).forEach((key) => {
        if(contents[key] === null) {
            delete contents[key]
        }
    })
    fs.writeFileSync(configPath, JSON.stringify(contents))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function readData(key: string): any {
    const contents = parseData(configPath)
    return contents[key]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseData(filePath: fs.PathLike): any {
    const defaultData = {}
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    } catch (error) {
        return defaultData
    }
}

export default {
    server,
    baseUrl,
    loadSettings,
    windowOpenNewTab,
    windowsAboveApp,
    maximizeOnStart,
    hideTopPanelInFullScreen,
    userAgent,
    writeData,
    sets,
    beltSets,
    notes,
    hpFood,
    mpFood,
    fightNotificationsSystem,
    fightNotificationsIngame,
    battlegroundNotificationsSystem,
    battlegroundNotificationsIngame,
    messageNotificationsSystem,
    messageNotificationsIngame,
    mailNotificationsSystem,
    mailNotificationsIngame,
    updateChannel
}
