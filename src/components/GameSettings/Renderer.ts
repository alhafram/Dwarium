import { Elements } from './Elements'
import '../Common/Utils'
import { GameSettingsWindowState } from './GameSettingsWindowState'
import { dispatch } from './preload'
import { GameSettingsWindowActions } from './Actions'

let state: GameSettingsWindowState

export function render(initialState: GameSettingsWindowState) {
    state = initialState
    setupGameFlags()
}

function setupGameFlags() {
    Elements.hideCasinoInput().checked = state.gameFlags.hideCasino
    Elements.hideActivitiesInput().checked = state.gameFlags.hideActivities
    Elements.hidePromotionsInput().checked = state.gameFlags.hidePromotions
    Elements.hideDiceGameInput().checked = state.gameFlags.hideDiceGame
    Elements.hideWheelFortuneInput().checked = state.gameFlags.hideWheelFortune
    Elements.hideNPCEventsInput().checked = state.gameFlags.hideNPCEvents
    Elements.hideCurrentEventInput().checked = state.gameFlags.hideCurrentEvent
    Elements.hideFrontsInput().checked = state.gameFlags.hideFronts
    Elements.hideMiniMapInput().checked = state.gameFlags.hideMiniMap
    Elements.hideBrilliantsPromotionInput().checked = state.gameFlags.hideBrilliantsPromotion
}

export function setupView() {
    Elements.saveButton().onclick = function() {
        dispatch(GameSettingsWindowActions.SAVE_SETTINGS)
    }
}