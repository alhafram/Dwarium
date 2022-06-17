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
    hideMirror: boolean
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

export type GameRightMenuFlags = {
    hideMail: boolean
    hideExternalBackpack: boolean
    hideMount: boolean
    hideCompas: boolean
    hideProfession: boolean
    hideQuests: boolean
    hideFriends: boolean
}

export type HuntFlags = {
    hideHuntMinimap: boolean
    hideHuntLeftAction: boolean
    hideHuntRightAction: boolean
    hideHuntFilter: boolean
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
    HIDE_BRILLIANTS_PROMOTION = 'hideBrilliantsPromotion',
    HIDE_MIRROR = 'hideMirror'
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

export enum GameRightMenuFlagsKeys {
    HIDE_MAIL = 'hideMail',
    HIDE_EXTERNAL_BACKPACK = 'hideExternalBackpack',
    HIDE_MOUNT = 'hideMount',
    HIDE_COMPAS = 'hideCompas',
    HIDE_PROFESSTION = 'hideProfession',
    HIDE_QUESTS = 'hideQuests',
    HIDE_FRIENDS = 'hideFriends'
}

export enum HuntFlagsKeys {
    HIDE_HUNT_MINIMAP = 'hideHuntMinimap',
    HIDE_HUNT_LEFT_ACTION = 'hideHuntLeftAction',
    HIDE_HUNT_RIGHT_ACTION = 'hideHuntRightAction',
    HIDE_HUNT_FILTER = 'hideHuntFilter'
}

export type GameFlags = {
    gameLocationFlags: GameLocationFlags
    gameTopMenuFlags: GameTopMenuFlags
    gameRightMenuFlags: GameRightMenuFlags
    huntFlags: HuntFlags
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
        hideBrilliantsPromotion: readData(GameLocationFlagsKeys.HIDE_BRILLIANTS_PROMOTION) ?? false,
        hideMirror: readData(GameLocationFlagsKeys.HIDE_MIRROR) ?? false
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
        hideInfoPortal: readData(GameTopMenuFlagsKeys.HIDE_INFOPORTAL) ?? false
    }
    const gameRightMenuFlags = {
        hideMail: readData(GameRightMenuFlagsKeys.HIDE_MAIL) ?? false,
        hideExternalBackpack: readData(GameRightMenuFlagsKeys.HIDE_EXTERNAL_BACKPACK) ?? false,
        hideMount: readData(GameRightMenuFlagsKeys.HIDE_MOUNT) ?? false,
        hideCompas: readData(GameRightMenuFlagsKeys.HIDE_COMPAS) ?? false,
        hideProfession: readData(GameRightMenuFlagsKeys.HIDE_PROFESSTION) ?? false,
        hideQuests: readData(GameRightMenuFlagsKeys.HIDE_QUESTS) ?? false,
        hideFriends: readData(GameRightMenuFlagsKeys.HIDE_FRIENDS) ?? false
    }
    const huntFlags = {
        hideHuntMinimap: readData(HuntFlagsKeys.HIDE_HUNT_MINIMAP) ?? false,
        hideHuntLeftAction: readData(HuntFlagsKeys.HIDE_HUNT_LEFT_ACTION) ?? false,
        hideHuntRightAction: readData(HuntFlagsKeys.HIDE_HUNT_RIGHT_ACTION) ?? false,
        hideHuntFilter: readData(HuntFlagsKeys.HIDE_HUNT_FILTER) ?? false
    }
    return {
        gameLocationFlags,
        gameTopMenuFlags,
        gameRightMenuFlags,
        huntFlags
    }
}

function writeData(key: GameLocationFlagsKeys | GameTopMenuFlagsKeys | GameRightMenuFlagsKeys | HuntFlagsKeys, value: any): void {
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
