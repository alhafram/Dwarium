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
    Elements.hideCasinoInput().checked = state.gameLocationFlags.hideCasino
    Elements.hideActivitiesInput().checked = state.gameLocationFlags.hideActivities
    Elements.hidePromotionsInput().checked = state.gameLocationFlags.hidePromotions
    Elements.hideDiceGameInput().checked = state.gameLocationFlags.hideDiceGame
    Elements.hideWheelFortuneInput().checked = state.gameLocationFlags.hideWheelFortune
    Elements.hideNPCEventsInput().checked = state.gameLocationFlags.hideNPCEvents
    Elements.hideCurrentEventInput().checked = state.gameLocationFlags.hideCurrentEvent
    Elements.hideFrontsInput().checked = state.gameLocationFlags.hideFronts
    Elements.hideMiniMapInput().checked = state.gameLocationFlags.hideMiniMap
    Elements.hideBrilliantsPromotionInput().checked = state.gameLocationFlags.hideBrilliantsPromotion
    Elements.hideMirrorInput().checked = state.gameLocationFlags.hideMirror

    Elements.hideBackpackInput().checked = state.gameTopMenuFlags.hideBackpack
    Elements.hideLocationInput().checked = state.gameTopMenuFlags.hideLocation
    Elements.hideHuntInput().checked = state.gameTopMenuFlags.hideHunt
    Elements.hideCharacterInput().checked = state.gameTopMenuFlags.hideCharacter
    Elements.hideBattlegroundInput().checked = state.gameTopMenuFlags.hideBattleground
    Elements.hideMapsInput().checked = state.gameTopMenuFlags.hideMaps
    Elements.hideEventsInput().checked = state.gameTopMenuFlags.hideEvents
    Elements.hideBankInput().checked = state.gameTopMenuFlags.hideBank
    Elements.hideAuctionInput().checked = state.gameTopMenuFlags.hideAuction
    Elements.hideFightsInput().checked = state.gameTopMenuFlags.hideFights
    Elements.hideInfoPortalInput().checked = state.gameTopMenuFlags.hideInfoPortal

    Elements.hideMailInput().checked = state.gameRightMenuFlags.hideMail
    Elements.hideExternalBackpackInput().checked = state.gameRightMenuFlags.hideExternalBackpack
    Elements.hideMountInput().checked = state.gameRightMenuFlags.hideMount
    Elements.hideCompasInput().checked = state.gameRightMenuFlags.hideCompas
    Elements.hideProfessionInput().checked = state.gameRightMenuFlags.hideProfession
    Elements.hideQuestsInput().checked = state.gameRightMenuFlags.hideQuests
    Elements.hideFriendsInput().checked = state.gameRightMenuFlags.hideFriends
}

export function setupView() {
    Elements.saveButton().onclick = function() {
        dispatch(GameSettingsWindowActions.SAVE_SETTINGS)
    }
}
