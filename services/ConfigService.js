const { app } = process.type === 'browser' ? require('electron') : require('@electron/remote')
const fs = require('fs')
const path = require('path')
const filePath = path.join(app.getPath('userData'), 'config.json')

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

function sets() {
    let contents = parseData(filePath)
    let keys = Object.keys(contents).filter(key => key.startsWith('set_'))
    return keys.map(key => JSON.parse(contents[key]))
}

function beltSets() {
    let contents = parseData(filePath)
    let keys = Object.keys(contents).filter(key => key.startsWith('belt_set_'))
    return keys.map(key => JSON.parse(contents[key]))
}

function writeData(key, value) {
    let contents = parseData(filePath)
    contents[key] = value
    Object.keys(contents).forEach(key => {
        if(contents[key] === null) {
            delete contents[key]
        }
    })
    fs.writeFileSync(filePath, JSON.stringify(contents))
}

function readData(key) {
    let contents = parseData(filePath)
    return contents[key]
}

function parseData(filePath) {
    const defaultData = {}
    try {
        return JSON.parse(fs.readFileSync(filePath))
    } catch (error) {
        return defaultData
    }
}

module.exports = {
    server,
    baseUrl,
    loadSettings,
    windowOpenNewTab,
    windowsAboveApp,
    userAgent,
    writeData,
    sets,
    beltSets
}
