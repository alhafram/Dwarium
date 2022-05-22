import { buildPath, ConfigPath } from '../Models/ConfigPathes'
import FileOperationsService from './FileOperationsService'

const path = buildPath(ConfigPath.GAME_FLAGS)

export type GameFlags = {
    hideCasino: boolean
    hideActivities: boolean
    hidePromotions: boolean
    hideDiceGame: boolean
    hideWheelFortune: boolean
}

export enum GameFlagsKeys {
    HIDE_CASINO = 'hideCasino',
    HIDE_ACTIVITIES = 'hideActivities',
    HIDE_PROMOTIONS = 'hidePromotions',
    HIDE_DICE_GAME = 'hideDiceGame',
    HIDE_WHEEL_FORTUNE = 'hideWheelFortune'
}

function getGameFlags(): GameFlags {
    const settings = {
        hideCasino: readData(GameFlagsKeys.HIDE_CASINO) ?? false,
        hideActivities: readData(GameFlagsKeys.HIDE_ACTIVITIES) ?? false,
        hidePromotions: readData(GameFlagsKeys.HIDE_PROMOTIONS) ?? false,
        hideDiceGame: readData(GameFlagsKeys.HIDE_DICE_GAME) ?? false,
        hideWheelFortune: readData(GameFlagsKeys.HIDE_WHEEL_FORTUNE) ?? false
    }
    return settings
}

function writeData(key: GameFlagsKeys, value: any): void {
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
    getGameFlags,
    writeData
}