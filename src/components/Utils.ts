import { contextBridge } from 'electron'

export interface UtilsAPI {
    generateRandomId: () => string
}

declare global {
    interface Window {
        utilsAPI: UtilsAPI
    }
}

contextBridge.exposeInMainWorld('utilsAPI', {
    generateRandomId: () => {
        return generateRandomId()
    }
})

export enum DressingFilterColor {
    GRAY = 'i_gray',
    GREEN = 'i_green',
    BLUE = 'i_blue',
    PURPLE = 'i_purple',
    RED = 'i_red'
}

function getQuality(filter: DressingFilterColor): string {
    switch(filter) {
        case DressingFilterColor.GRAY:
            return '0'
        case DressingFilterColor.GREEN:
            return '1'
            case DressingFilterColor.BLUE:
            return '2'
        case DressingFilterColor.PURPLE:
            return '3'
        case DressingFilterColor.RED:
            return '4'
    }
}

function getFilterColor(quality: string): DressingFilterColor {
    switch(quality) {
        case '0':
            return DressingFilterColor.GRAY
        case '1':
            return  DressingFilterColor.GREEN
        case '2':
            return  DressingFilterColor.BLUE
        case '3':
            return  DressingFilterColor.PURPLE
        case '4':
            return  DressingFilterColor.RED
        default:
            return DressingFilterColor.GRAY
    }
}

function generateRandomId() {
    return (Math.random() + 1).toString(36).substring(2)
}

export {
    generateRandomId,
    getQuality,
    getFilterColor
}