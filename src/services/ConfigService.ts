const { app } = process.type === 'browser' ? require('electron') : require('@electron/remote')
import fs from 'fs';
import path from 'path';
const configPath = path.join(app.getPath('userData'), 'config.json')

function server(): string {
    return readData('server')
}

function baseUrl(): string {
    return `https://${readData('server')}.dwar.ru`
}

function loadSettings(): any {
    return readData('settings')
}

function windowOpenNewTab(): boolean {
    let settings = readData('settings')
    if(settings) {
        settings = JSON.parse(settings)
        return settings.windowOpenNewTab
    }
    return false
}

function windowsAboveApp(): boolean {
    let settings = readData('settings')
    if(settings) {
        settings = JSON.parse(settings)
        return settings.windowsAboveApp
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

function sets(): any[] {
    let contents = parseData(configPath)
    let keys = Object.keys(contents).filter(key => key.startsWith('set_'))
    return keys.map(key => JSON.parse(contents[key]))
}

function beltSets(): any[] {
    let contents = parseData(configPath)
    let keys = Object.keys(contents).filter(key => key.startsWith('belt_set_'))
    return keys.map(key => JSON.parse(contents[key]))
}

function writeData(key: string, value: any): void {
    let contents = parseData(configPath)
    contents[key] = value
    Object.keys(contents).forEach(key => {
        if(contents[key] === null) {
            delete contents[key]
        }
    })
    fs.writeFileSync(configPath, JSON.stringify(contents))
}

function readData(key: string): any {
    let contents = parseData(configPath)
    return contents[key]
}

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
    beltSets
}