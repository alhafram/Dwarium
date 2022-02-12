const { app } = process.type === 'browser' ? require('electron') : require('@electron/remote')
import { Rectangle } from 'electron'
import fs from 'fs'
import path from 'path'
import { WindowType } from '../Models/WindowModels'

const configPath = path.join(app.getPath('userData'), 'windows.json')

function saveClientWindowPosition(type: WindowType, size: Rectangle): void {
    const contents = parseData(configPath)
    contents[type] = fixNegativePositions(size)
    Object.keys(contents).forEach((key) => {
        if(contents[key] === null) {
            delete contents[key]
        }
    })
    fs.writeFileSync(configPath, JSON.stringify(contents))
}

function saveBrowserWindowPosition(path: string, size: Rectangle): void {
    const contents = parseData(configPath)
    contents[path] = fixNegativePositions(size)
    Object.keys(contents).forEach((key) => {
        if(contents[key] === null) {
            delete contents[key]
        }
    })
    fs.writeFileSync(configPath, JSON.stringify(contents))
}

function getClientWindowPosition(type: WindowType): Rectangle | undefined {
    const contents = parseData(configPath)
    if(contents && contents[type]) {
        const rect = contents[type] as Rectangle
        return fixNegativePositions(rect)
    }
    return contents[type]
}

function getBrowserWindowPosition(path: string): Rectangle | undefined {
    const contents = parseData(configPath)
    return contents[path]
}

function fixNegativePositions(size: Rectangle): Rectangle {
    if(size.x < -20) {
        size.x = 0
    }
    if(size.y < -20) {
        size.y = 0
    }
    return size
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

export { saveClientWindowPosition, saveBrowserWindowPosition, getClientWindowPosition, getBrowserWindowPosition }
