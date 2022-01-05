import { app } from 'electron';
import fs from 'fs';
import path from 'path';
const configPath = path.join(app.getPath('userData'), 'config.json')

function server() {
    return readData('server')
}

function baseUrl() {
    return `https://${readData('server')}.dwar.ru`
}

function loadSettings() {
    return readData('settings')
}

function windowOpenNewTab() {
    let settings = readData('settings')
    if(settings) {
        settings = JSON.parse(settings)
        return settings.windowOpenNewTab
    }
    return false
}

function windowsAboveApp() {
    let settings = readData('settings')
    if(settings) {
        settings = JSON.parse(settings)
        return settings.windowsAboveApp
    }
    return false
}

function userAgent() {
    let settings = readData('settings')
    if(settings) {
        settings = JSON.parse(settings)
        return settings.userAgentText
    }
    return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
}

function maximizeOnStart() {
    let settings = readData('settings')
    if(settings) {
        settings = JSON.parse(settings)
        return settings.maximizeOnStart
    }
    return false
}

function sets() {
    let contents = parseData(configPath)
    let keys = Object.keys(contents).filter(key => key.startsWith('set_'))
    return keys.map(key => JSON.parse(contents[key]))
}

function beltSets() {
    let contents = parseData(configPath)
    let keys = Object.keys(contents).filter(key => key.startsWith('belt_set_'))
    return keys.map(key => JSON.parse(contents[key]))
}

function writeData(key: string, value: any) {
    let contents = parseData(configPath)
    contents[key] = value
    Object.keys(contents).forEach(key => {
        if(contents[key] === null) {
            delete contents[key]
        }
    })
    fs.writeFileSync(configPath, JSON.stringify(contents))
}

function readData(key: string) {
    let contents = parseData(configPath)
    return contents[key]
}

function parseData(filePath: fs.PathLike) {
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
    userAgent,
    writeData,
    sets,
    beltSets
}