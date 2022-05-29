import { ipcRenderer } from 'electron'
import { Channel } from '../../Models/Channel'
import GameFlagsService, { GameFlagsKeys } from '../../services/GameFlagsService'
import { GameSettingsWindowActions } from './Actions'
import { Elements } from './Elements'
import { GameSettingsWindowState } from './GameSettingsWindowState'

export default function reduce(state: GameSettingsWindowState, action: GameSettingsWindowActions, data: unknown): GameSettingsWindowState {
    switch (action) {
        case GameSettingsWindowActions.LOAD_SETTINGS: {
            return state
        }
        case GameSettingsWindowActions.SAVE_SETTINGS: {
            console.log('here')
            saveGameFlags()
            ipcRenderer.send(Channel.RELOAD)
            return {
                ...state,
                gameFlags: GameFlagsService.getGameFlags()
            }
        }
    }
}

function saveGameFlags() {
    console.log('save')
    GameFlagsService.writeData(GameFlagsKeys.HIDE_CASINO, Elements.hideCasinoInput().checked)
    GameFlagsService.writeData(GameFlagsKeys.HIDE_ACTIVITIES, Elements.hideActivitiesInput().checked)
    GameFlagsService.writeData(GameFlagsKeys.HIDE_PROMOTIONS, Elements.hidePromotionsInput().checked)
    GameFlagsService.writeData(GameFlagsKeys.HIDE_DICE_GAME, Elements.hideDiceGameInput().checked)
    GameFlagsService.writeData(GameFlagsKeys.HIDE_WHEEL_FORTUNE, Elements.hideWheelFortuneInput().checked)
    GameFlagsService.writeData(GameFlagsKeys.HIDE_NPC_EVENTS, Elements.hideNPCEventsInput().checked)
    GameFlagsService.writeData(GameFlagsKeys.HIDE_CURRENT_EVENT, Elements.hideCurrentEventInput().checked)
    GameFlagsService.writeData(GameFlagsKeys.HIDE_FRONTS, Elements.hideFrontsInput().checked)
    GameFlagsService.writeData(GameFlagsKeys.HIDE_MINI_MAP, Elements.hideMiniMapInput().checked)
    GameFlagsService.writeData(GameFlagsKeys.HIDE_BRILLIANTS_PROMOTION, Elements.hideBrilliantsPromotionInput().checked)
}
