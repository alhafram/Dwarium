import { buildPath, ConfigPath } from '../Models/ConfigPathes'
import FileOperationsService from './FileOperationsService'

const path = buildPath(ConfigPath.GAME_FLAGS)

export type GameLocationFlags = {
    hideCasino: boolean
    hideActivities: boolean
    hidePromotions: boolean
    hideDiceGame: boolean
    hideWheelFortune: boolean
    hideNPCEvents: boolean
    hideCurrentEvent: boolean
    hideFronts: boolean
    hideMiniMap: boolean
    hideBrilliantsPromotion: boolean
}

export type GameTopMenuFlags = {
    hideBackpack: boolean
    hideLocation: boolean
    hideHunt: boolean
    hideCharacter: boolean
    hideBattleground: boolean
    hideMaps: boolean
    hideEvents: boolean
    hideBank: boolean
    hideAuction: boolean
    hideFights: boolean
    hideInfoPortal: boolean
}

export enum GameLocationFlagsKeys {
    HIDE_CASINO = 'hideCasino',
    HIDE_ACTIVITIES = 'hideActivities',
    HIDE_PROMOTIONS = 'hidePromotions',
    HIDE_DICE_GAME = 'hideDiceGame',
    HIDE_WHEEL_FORTUNE = 'hideWheelFortune',
    HIDE_NPC_EVENTS = 'hideNPCEvents',
    HIDE_CURRENT_EVENT = 'hideCurrentEvent',
    HIDE_FRONTS = 'hideFronts',
    HIDE_MINI_MAP = 'hideMiniMap',
    HIDE_BRILLIANTS_PROMOTION = 'hideBrilliantsPromotion'
}

export enum GameTopMenuFlagsKeys {
    HIDE_BACKPACK = 'hideBackpack',
    HIDE_LOCATION = 'hideLocation',
    HIDE_HUNT = 'hideHunt',
    HIDE_CHARACTER = 'hideCharacter',
    HIDE_BATTLEGROUND = 'hideBattleground',
    HIDE_MAPS = 'hideMaps',
    HIDE_EVENTS = 'hideEvents',
    HIDE_BANK = 'hideBank',
    HIDE_AUCTION = 'hideAuction',
    HIDE_FIGHTS = 'hideFights',
    HIDE_INFOPORTAL = 'hideInfoPortal'
}

export type GameFlags = {
    gameLocationFlags: GameLocationFlags
    gameTopMenuFlags: GameTopMenuFlags
}

function getGameFlags(): GameFlags {
    const gameLocationFlags = {
        hideCasino: readData(GameLocationFlagsKeys.HIDE_CASINO) ?? false,
        hideActivities: readData(GameLocationFlagsKeys.HIDE_ACTIVITIES) ?? false,
        hidePromotions: readData(GameLocationFlagsKeys.HIDE_PROMOTIONS) ?? false,
        hideDiceGame: readData(GameLocationFlagsKeys.HIDE_DICE_GAME) ?? false,
        hideWheelFortune: readData(GameLocationFlagsKeys.HIDE_WHEEL_FORTUNE) ?? false,
        hideNPCEvents: readData(GameLocationFlagsKeys.HIDE_NPC_EVENTS) ?? false,
        hideCurrentEvent: readData(GameLocationFlagsKeys.HIDE_CURRENT_EVENT) ?? false,
        hideFronts: readData(GameLocationFlagsKeys.HIDE_FRONTS) ?? false,
        hideMiniMap: readData(GameLocationFlagsKeys.HIDE_MINI_MAP) ?? false,
        hideBrilliantsPromotion: readData(GameLocationFlagsKeys.HIDE_BRILLIANTS_PROMOTION) ?? false
    }
    const gameTopMenuFlags = {
        hideBackpack: readData(GameTopMenuFlagsKeys.HIDE_BACKPACK) ?? false,
        hideLocation: readData(GameTopMenuFlagsKeys.HIDE_LOCATION) ?? false,
        hideHunt: readData(GameTopMenuFlagsKeys.HIDE_HUNT) ?? false,
        hideCharacter: readData(GameTopMenuFlagsKeys.HIDE_CHARACTER) ?? false,
        hideBattleground: readData(GameTopMenuFlagsKeys.HIDE_BATTLEGROUND) ?? false,
        hideMaps: readData(GameTopMenuFlagsKeys.HIDE_MAPS) ?? false,
        hideEvents: readData(GameTopMenuFlagsKeys.HIDE_EVENTS) ?? false,
        hideBank: readData(GameTopMenuFlagsKeys.HIDE_BANK) ?? false,
        hideAuction: readData(GameTopMenuFlagsKeys.HIDE_AUCTION) ?? false,
        hideFights: readData(GameTopMenuFlagsKeys.HIDE_FIGHTS) ?? false,
        hideInfoPortal: readData(GameTopMenuFlagsKeys.HIDE_INFOPORTAL) ?? false,
    }
    return {
        gameLocationFlags,
        gameTopMenuFlags
    }
}

function writeData(key: GameLocationFlagsKeys | GameTopMenuFlagsKeys, value: any): void {
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
