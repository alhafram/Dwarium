import { Rectangle } from 'electron'
import { buildPath, ConfigPath } from '../Models/ConfigPathes'
import { WindowType } from '../Models/WindowModels'
import FileOperationsService from './FileOperationsService'

const path = buildPath(ConfigPath.WINDOW_SIZE)

function saveClientWindowPosition(type: WindowType, size: Rectangle): void {
    const contents = FileOperationsService.parseData(path) as any
    contents[type] = fixNegativePositions(size)
    Object.keys(contents).forEach((key) => {
        if(contents[key] === null) {
            delete contents[key]
        }
    })
    FileOperationsService.writeData(path, JSON.stringify(contents))
}

function saveBrowserWindowPosition(url: string, size: Rectangle): void {
    const contents = FileOperationsService.parseData(path) as any
    contents[url] = fixNegativePositions(size)
    Object.keys(contents).forEach((key) => {
        if(contents[key] === null) {
            delete contents[key]
        }
    })
    FileOperationsService.writeData(path, JSON.stringify(contents))
}

function getClientWindowPosition(type: WindowType): Rectangle | undefined {
    const contents = FileOperationsService.parseData(path) as any
    if(contents && contents[type]) {
        const rect = contents[type] as Rectangle
        return fixNegativePositions(rect)
    }
    return contents[type]
}

function getBrowserWindowPosition(url: string): Rectangle | undefined {
    const contents = FileOperationsService.parseData(path) as any
    return contents[url]
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

export { saveClientWindowPosition, saveBrowserWindowPosition, getClientWindowPosition, getBrowserWindowPosition }
