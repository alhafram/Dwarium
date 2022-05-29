import { ipcRenderer } from 'electron'
import { Channel } from '../../Models/Channel'
import GameFlagsService, { GameLocationFlagsKeys, GameRightMenuFlagsKeys, GameTopMenuFlagsKeys } from '../../services/GameFlagsService'
import { GameSettingsWindowActions } from './Actions'
import { Elements } from './Elements'
import { GameSettingsWindowState } from './GameSettingsWindowState'

export default function reduce(state: GameSettingsWindowState, action: GameSettingsWindowActions, data: unknown): GameSettingsWindowState {
    switch (action) {
        case GameSettingsWindowActions.LOAD_SETTINGS: {
            return state
        }
        case GameSettingsWindowActions.SAVE_SETTINGS: {
            saveGameFlags()
            ipcRenderer.send(Channel.RELOAD)
            const flags = GameFlagsService.getGameFlags()
            return {
                ...state,
                gameLocationFlags: flags.gameLocationFlags,
                gameTopMenuFlags: flags.gameTopMenuFlags,
                gameRightMenuFlags: flags.gameRightMenuFlags
            }
        }
    }
}

function saveGameFlags() {
    GameFlagsService.writeData(GameLocationFlagsKeys.HIDE_CASINO, Elements.hideCasinoInput().checked)
    GameFlagsService.writeData(GameLocationFlagsKeys.HIDE_ACTIVITIES, Elements.hideActivitiesInput().checked)
    GameFlagsService.writeData(GameLocationFlagsKeys.HIDE_PROMOTIONS, Elements.hidePromotionsInput().checked)
    GameFlagsService.writeData(GameLocationFlagsKeys.HIDE_DICE_GAME, Elements.hideDiceGameInput().checked)
    GameFlagsService.writeData(GameLocationFlagsKeys.HIDE_WHEEL_FORTUNE, Elements.hideWheelFortuneInput().checked)
    GameFlagsService.writeData(GameLocationFlagsKeys.HIDE_NPC_EVENTS, Elements.hideNPCEventsInput().checked)
    GameFlagsService.writeData(GameLocationFlagsKeys.HIDE_CURRENT_EVENT, Elements.hideCurrentEventInput().checked)
    GameFlagsService.writeData(GameLocationFlagsKeys.HIDE_FRONTS, Elements.hideFrontsInput().checked)
    GameFlagsService.writeData(GameLocationFlagsKeys.HIDE_MINI_MAP, Elements.hideMiniMapInput().checked)
    GameFlagsService.writeData(GameLocationFlagsKeys.HIDE_BRILLIANTS_PROMOTION, Elements.hideBrilliantsPromotionInput().checked)

    GameFlagsService.writeData(GameTopMenuFlagsKeys.HIDE_BACKPACK, Elements.hideBackpackInput().checked)
    GameFlagsService.writeData(GameTopMenuFlagsKeys.HIDE_LOCATION, Elements.hideLocationInput().checked)
    GameFlagsService.writeData(GameTopMenuFlagsKeys.HIDE_HUNT, Elements.hideHuntInput().checked)
    GameFlagsService.writeData(GameTopMenuFlagsKeys.HIDE_CHARACTER, Elements.hideCharacterInput().checked)
    GameFlagsService.writeData(GameTopMenuFlagsKeys.HIDE_BATTLEGROUND, Elements.hideBattlegroundInput().checked)
    GameFlagsService.writeData(GameTopMenuFlagsKeys.HIDE_MAPS, Elements.hideMapsInput().checked)
    GameFlagsService.writeData(GameTopMenuFlagsKeys.HIDE_EVENTS, Elements.hideEventsInput().checked)
    GameFlagsService.writeData(GameTopMenuFlagsKeys.HIDE_BANK, Elements.hideBankInput().checked)
    GameFlagsService.writeData(GameTopMenuFlagsKeys.HIDE_AUCTION, Elements.hideAuctionInput().checked)
    GameFlagsService.writeData(GameTopMenuFlagsKeys.HIDE_FIGHTS, Elements.hideFightsInput().checked)
    GameFlagsService.writeData(GameTopMenuFlagsKeys.HIDE_INFOPORTAL, Elements.hideInfoPortalInput().checked)

    GameFlagsService.writeData(GameRightMenuFlagsKeys.HIDE_MAIL, Elements.hideMailInput().checked)
    GameFlagsService.writeData(GameRightMenuFlagsKeys.HIDE_EXTERNAL_BACKPACK, Elements.hideExternalBackpackInput().checked)
    GameFlagsService.writeData(GameRightMenuFlagsKeys.HIDE_MOUNT, Elements.hideMountInput().checked)
    GameFlagsService.writeData(GameRightMenuFlagsKeys.HIDE_COMPAS, Elements.hideCompasInput().checked)
    GameFlagsService.writeData(GameRightMenuFlagsKeys.HIDE_PROFESSTION, Elements.hideProfessionInput().checked)
    GameFlagsService.writeData(GameRightMenuFlagsKeys.HIDE_QUESTS, Elements.hideQuestsInput().checked)
    GameFlagsService.writeData(GameRightMenuFlagsKeys.HIDE_FRIENDS, Elements.hideFriendsInput().checked)
}
